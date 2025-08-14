import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import {TranslateService} from "./services/translate.service";
import {CrontabMode} from "./models/crontab-mode";
import {CrontabModel} from "./models/crontab-model";
import {CrontabService} from "./services/crontab.service";
import {constants} from './models/constants';
import {ComponentStyle} from "./models/component-style";
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Fieldset} from "primeng/fieldset";
import {RadioButton} from "primeng/radiobutton";
import {NgClass, NgIf, NgTemplateOutlet} from "@angular/common";
import {PrimeTemplate} from "primeng/api";
import {Divider} from "primeng/divider";
import {InputText} from "primeng/inputtext";
import {Checkbox} from "primeng/checkbox";
import {Select} from "primeng/select";
import {TabPanels, TabPanel, Tab, Tabs, TabList} from "primeng/tabs";


@Component({
  standalone: true,
  selector: 'ngx-crontab-builder',
  templateUrl: './ngx-crontab-builder.component.html',
  styleUrls: ['./ngx-crontab-builder.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    Fieldset,
    RadioButton,
    FormsModule,
    NgTemplateOutlet,
    NgIf,
    PrimeTemplate,
    Divider,
    InputText,
    NgClass,
    Checkbox,
    Select,
    Tabs,
    Tab,
    TabPanel,
    TabPanels,
    TabList
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: NgxCrontabBuilderComponent
    }
  ]
})
export class NgxCrontabBuilderComponent implements OnInit, OnChanges, ControlValueAccessor  {
  //Internal references/services
  private crontabService: CrontabService = new CrontabService();
  tr: TranslateService = new TranslateService('en');
  CrontabMode = CrontabMode;
  constants = constants;
  model: CrontabModel; //Internal view model to which the UI elements are bound

  //Inputs/outputs
  @Input() locale: string = constants.defaultLocale; //language code (ISO 639-1)
  @Input() componentStyle: ComponentStyle = ComponentStyle.FIELDSETS;
  @Input() showSecondsMode: boolean = true;
  @Input() showMinutesMode: boolean = true;
  @Input() showHoursMode: boolean = true;
  @Input() showDailyMode: boolean = true;
  @Input() showWeekMode: boolean = true;
  @Input() showNthDayOfWeekMode: boolean = true;
  @Input() showMonthMode: boolean = true;
  @Input() showLastDayOfMonthMode: boolean = true;
  @Input() showCustomExpressionMode: boolean = true;

  //UI
  crontabModeKeys: CrontabMode[] = [];
  activeTabIndex: number|null = 0;
  disabled!: boolean;
  private  touched!: boolean;
  private onTouched: any;
  private onChange: any;

  constructor() {
    this.model = this.crontabService.parse(constants.initialCrontab, false);
  }

  //OnInit implementation
  ngOnInit(): void {
    this.tr.updateLocale(this.locale);
  }

  //OnChanges implementation
  ngOnChanges(changes: SimpleChanges) {
    //Update language if locale changed
    if (changes['locale']) {
      this.tr.updateLocale(this.locale);
    }

    //Update active tab if in tabbed mode
    const visibilityProps = ['showSecondsMode', 'showMinutesMode', 'showHoursMode', 'showDailyMode',
      'showWeekMode', 'showNthDayOfWeekMode', 'showMonthMode', 'showLastDayOfMonthMode', 'showCustomExpressionMode'];
    if(changes['componentStyle'] || visibilityProps.some(x => changes[x])){
      this.crontabModeKeys = Object.keys(CrontabMode)
        .filter(x => isNaN(Number(x)))
        .map(x => x as CrontabMode)
        .filter((x, idx) => this[visibilityProps[idx] as keyof NgxCrontabBuilderComponent]);
      this.updateTabIndex();
    }
  }

  //ControlValueAccessor implementation
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(obj: string): void {
    if(obj !== this.model.outputCrontabString){
      this.model = this.crontabService.parse(obj, false);
      this.crontabChanged();
    }
    this.updateTabIndex();
  }

  //Component methods
  recalculateCrontab() {
    const curCrontab = this.model.outputCrontabString;
    this.crontabService.updateModel(this.model);
    if (curCrontab !== this.model.outputCrontabString) {
      this.crontabChanged();
    }
  }

  crontabChanged(){
    this.onChange && this.onChange(this.model.outputCrontabString);
    if(!this.touched){
      this.onTouched && this.onTouched();
      this.touched = true;
    }
  }

  tabChanged(idx: unknown){
    this.model.mode = this.crontabModeKeys[idx as number];
    this.recalculateCrontab();
  }

  updateTabIndex(){
    this.activeTabIndex = this.crontabModeKeys.includes(this.model.mode) ? this.crontabModeKeys.indexOf(this.model.mode) : null;
  }
}
