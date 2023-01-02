import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import {TranslateService} from "./services/translate.service";
import {CrontabMode} from "./models/crontab-mode";
import {CrontabModel} from "./models/crontab-model";
import {CrontabService} from "./services/crontab.service";
import {constants} from './models/constants';
import {ComponentStyle} from "./models/component-style";
import {ControlValueAccessor, FormBuilder, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'ngx-crontab-builder',
  template: `
    <!-- FIELDSETS display mode -->
    <div *ngIf="componentStyle === 'FIELDSETS'" class="ngx-crontab-builder-root root-fieldset flex flex-column gap-2">
      <p-fieldset *ngIf="showSecondsMode">
        <ng-template pTemplate="header">
          <p-radioButton [(ngModel)]="model.mode" (onClick)="recalculateCrontab()"
                         [value]="CrontabMode.EVERY_X_SECONDS" name="crontabmode"
                         [label]="tr.locale.header_every_x_seconds"></p-radioButton>
        </ng-template>

        <ng-template [ngTemplateOutlet]="everyXSeconds"></ng-template>
      </p-fieldset>

      <p-fieldset *ngIf="showMinutesMode">
        <ng-template pTemplate="header">
          <p-radioButton [(ngModel)]="model.mode" (onClick)="recalculateCrontab()"
                         [value]="CrontabMode.EVERY_X_MINUTES" name="crontabmode"
                         [label]="tr.locale.header_every_x_minutes"></p-radioButton>
        </ng-template>

        <ng-template [ngTemplateOutlet]="everyXMinutes"></ng-template>
      </p-fieldset>

      <p-fieldset *ngIf="showHoursMode">
        <ng-template pTemplate="header">
          <p-radioButton [(ngModel)]="model.mode" (onClick)="recalculateCrontab()"
                         [value]="CrontabMode.EVERY_X_HOURS" name="crontabmode"
                         [label]="tr.locale.header_every_x_hours"></p-radioButton>
        </ng-template>

        <ng-template [ngTemplateOutlet]="everyXHours"></ng-template>
      </p-fieldset>

      <p-fieldset *ngIf="showDailyMode">
        <ng-template pTemplate="header">
          <p-radioButton [(ngModel)]="model.mode" (onClick)="recalculateCrontab()" [value]="CrontabMode.EVERY_DAY"
                         name="crontabmode"
                         [label]="tr.locale.header_every_day"></p-radioButton>
        </ng-template>

        <ng-template [ngTemplateOutlet]="everyDay"></ng-template>
      </p-fieldset>

      <p-fieldset *ngIf="showWeekMode">
        <ng-template pTemplate="header">
          <p-radioButton [(ngModel)]="model.mode" (onClick)="recalculateCrontab()"
                         [value]="CrontabMode.EVERY_WEEK"
                         name="crontabmode"
                         [label]="tr.locale.header_every_week"></p-radioButton>
        </ng-template>

        <ng-template [ngTemplateOutlet]="everyWeek"></ng-template>
      </p-fieldset>

      <p-fieldset *ngIf="showNthDayOfWeekMode">
        <ng-template pTemplate="header">
          <p-radioButton [(ngModel)]="model.mode" (onClick)="recalculateCrontab()"
                         [value]="CrontabMode.NTH_WEEKDAY"
                         name="crontabmode"
                         [label]="tr.locale.header_every_nth_day"></p-radioButton>
        </ng-template>

        <ng-template [ngTemplateOutlet]="everyNthDayOfWeek"></ng-template>
      </p-fieldset>

      <p-fieldset *ngIf="showMonthMode">
        <ng-template pTemplate="header">
          <p-radioButton [(ngModel)]="model.mode" (onClick)="recalculateCrontab()"
                         [value]="CrontabMode.EVERY_MONTH"
                         name="crontabmode"
                         [label]="tr.locale.header_every_month"></p-radioButton>
        </ng-template>

        <ng-template [ngTemplateOutlet]="everyMonth"></ng-template>
      </p-fieldset>

      <p-fieldset *ngIf="showLastDayOfMonthMode">
        <ng-template pTemplate="header">
          <p-radioButton [(ngModel)]="model.mode" (onClick)="recalculateCrontab()"
                         [value]="CrontabMode.LAST_DAY_OF_MONTH"
                         name="crontabmode"
                         [label]="tr.locale.header_every_last_day_of_month"></p-radioButton>
        </ng-template>

        <ng-template [ngTemplateOutlet]="lastDayOfMonth"></ng-template>
      </p-fieldset>

      <p-fieldset *ngIf="showCustomExpressionMode">
        <ng-template pTemplate="header">
          <p-radioButton [(ngModel)]="model.mode" (onClick)="recalculateCrontab()"
                         [value]="CrontabMode.CUSTOM"
                         name="crontabmode"
                         [label]="tr.locale.header_custom_cron"></p-radioButton>
        </ng-template>

        <ng-template [ngTemplateOutlet]="customCrontab"></ng-template>
      </p-fieldset>
    </div>

    <!-- PLAIN display mode -->
    <div *ngIf="componentStyle === 'PLAIN'" class="ngx-crontab-builder-root root-plain flex flex-column gap-2">
      <p-divider *ngIf="showSecondsMode">
        <p-radioButton [(ngModel)]="model.mode" (ngModelChange)="recalculateCrontab()"
                       [value]="CrontabMode.EVERY_X_SECONDS" name="crontabmode"
                       [label]="tr.locale.header_every_x_seconds" labelStyleClass="font-bold"></p-radioButton>
      </p-divider>
      <ng-template [ngTemplateOutlet]="everyXSeconds" *ngIf="showSecondsMode"></ng-template>

      <p-divider *ngIf="showMinutesMode">
        <p-radioButton [(ngModel)]="model.mode" (ngModelChange)="recalculateCrontab()"
                       [value]="CrontabMode.EVERY_X_MINUTES" name="crontabmode"
                       [label]="tr.locale.header_every_x_minutes" labelStyleClass="font-bold"></p-radioButton>
      </p-divider>
      <ng-template [ngTemplateOutlet]="everyXMinutes" *ngIf="showMinutesMode"></ng-template>

      <p-divider *ngIf="showHoursMode">
        <p-radioButton [(ngModel)]="model.mode" (ngModelChange)="recalculateCrontab()"
                       [value]="CrontabMode.EVERY_X_HOURS" name="crontabmode"
                       [label]="tr.locale.header_every_x_hours" labelStyleClass="font-bold"></p-radioButton>
      </p-divider>
      <ng-template [ngTemplateOutlet]="everyXHours" *ngIf="showHoursMode"></ng-template>

      <p-divider *ngIf="showDailyMode">
        <p-radioButton [(ngModel)]="model.mode" (ngModelChange)="recalculateCrontab()" [value]="CrontabMode.EVERY_DAY"
                       name="crontabmode"
                       [label]="tr.locale.header_every_day" labelStyleClass="font-bold"></p-radioButton>
      </p-divider>
      <ng-template [ngTemplateOutlet]="everyDay" *ngIf="showDailyMode"></ng-template>

      <p-divider *ngIf="showWeekMode">
        <p-radioButton [(ngModel)]="model.mode" (ngModelChange)="recalculateCrontab()"
                       [value]="CrontabMode.EVERY_WEEK"
                       name="crontabmode"
                       [label]="tr.locale.header_every_week" labelStyleClass="font-bold"></p-radioButton>
      </p-divider>
      <ng-template [ngTemplateOutlet]="everyWeek" *ngIf="showWeekMode"></ng-template>

      <p-divider *ngIf="showNthDayOfWeekMode">
        <p-radioButton [(ngModel)]="model.mode" (ngModelChange)="recalculateCrontab()"
                       [value]="CrontabMode.NTH_WEEKDAY"
                       name="crontabmode"
                       [label]="tr.locale.header_every_nth_day" labelStyleClass="font-bold"></p-radioButton>
      </p-divider>
      <ng-template [ngTemplateOutlet]="everyNthDayOfWeek" *ngIf="showNthDayOfWeekMode"></ng-template>

      <p-divider *ngIf="showMonthMode">
        <p-radioButton [(ngModel)]="model.mode" (ngModelChange)="recalculateCrontab()"
                       [value]="CrontabMode.EVERY_MONTH"
                       name="crontabmode"
                       [label]="tr.locale.header_every_month" labelStyleClass="font-bold"></p-radioButton>
      </p-divider>
      <ng-template [ngTemplateOutlet]="everyMonth" *ngIf="showMonthMode"></ng-template>

      <p-divider *ngIf="showLastDayOfMonthMode">
        <p-radioButton [(ngModel)]="model.mode" (ngModelChange)="recalculateCrontab()"
                       [value]="CrontabMode.LAST_DAY_OF_MONTH"
                       name="crontabmode"
                       [label]="tr.locale.header_every_last_day_of_month" labelStyleClass="font-bold"></p-radioButton>
      </p-divider>
      <ng-template [ngTemplateOutlet]="lastDayOfMonth" *ngIf="showLastDayOfMonthMode"></ng-template>

      <p-divider *ngIf="showCustomExpressionMode">
        <p-radioButton [(ngModel)]="model.mode" (ngModelChange)="recalculateCrontab()"
                       [value]="CrontabMode.CUSTOM"
                       name="crontabmode"
                       [label]="tr.locale.header_custom_cron" labelStyleClass="font-bold"></p-radioButton>
      </p-divider>
      <ng-template [ngTemplateOutlet]="customCrontab" *ngIf="showCustomExpressionMode"></ng-template>
    </div>

    <!-- TABBED display mode -->
    <div *ngIf="componentStyle === 'TABBED'" class="ngx-crontab-builder-root root-fieldset flex flex-column gap-2">
      <p-tabView [scrollable]="true" [activeIndex]="activeTabIndex" (activeIndexChange)="tabChanged($event)">
        <p-tabPanel *ngIf="showSecondsMode" [header]="tr.locale.header_every_x_seconds">
          <ng-template [ngTemplateOutlet]="everyXSeconds"></ng-template>
        </p-tabPanel>

        <p-tabPanel *ngIf="showMinutesMode" [header]="tr.locale.header_every_x_minutes">
          <ng-template [ngTemplateOutlet]="everyXMinutes"></ng-template>
        </p-tabPanel>

        <p-tabPanel *ngIf="showHoursMode" [header]="tr.locale.header_every_x_hours">
          <ng-template [ngTemplateOutlet]="everyXHours"></ng-template>
        </p-tabPanel>

        <p-tabPanel *ngIf="showDailyMode" [header]="tr.locale.header_every_day">
          <ng-template [ngTemplateOutlet]="everyDay"></ng-template>
        </p-tabPanel>

        <p-tabPanel *ngIf="showWeekMode" [header]="tr.locale.header_every_week">
          <ng-template [ngTemplateOutlet]="everyWeek"></ng-template>
        </p-tabPanel>

        <p-tabPanel *ngIf="showNthDayOfWeekMode" [header]="tr.locale.header_every_nth_day">
          <ng-template [ngTemplateOutlet]="everyNthDayOfWeek"></ng-template>
        </p-tabPanel>

        <p-tabPanel *ngIf="showMonthMode" [header]="tr.locale.header_every_month">
          <ng-template [ngTemplateOutlet]="everyMonth"></ng-template>
        </p-tabPanel>

        <p-tabPanel *ngIf="showLastDayOfMonthMode" [header]="tr.locale.header_every_last_day_of_month">
          <ng-template [ngTemplateOutlet]="lastDayOfMonth"></ng-template>
        </p-tabPanel>

        <p-tabPanel *ngIf="showCustomExpressionMode" [header]="tr.locale.header_custom_cron">
          <ng-template [ngTemplateOutlet]="customCrontab"></ng-template>
        </p-tabPanel>
      </p-tabView>
    </div>

    <!-- Actual editor components -->
    <ng-template #everyXSeconds>
      <div class="flex flex-row align-items-center gap-2" [ngClass]="{'disabled': model.mode !== CrontabMode.EVERY_X_SECONDS}">
        <div class="disable-check">{{tr.locale.run_every}}</div>
        <input pInputText [(ngModel)]="model.secondModeSeconds" (ngModelChange)="recalculateCrontab()"
               [pattern]="constants.regex1to59" [disabled]="model.mode !== CrontabMode.EVERY_X_SECONDS">
        <div class="disable-check">{{tr.locale.seconds}}</div>
      </div>
    </ng-template>

    <ng-template #everyXMinutes>
      <div class="flex flex-row align-items-center gap-2" [ngClass]="{'disabled': model.mode !== CrontabMode.EVERY_X_MINUTES}">
        <div>{{tr.locale.run_every}}</div>
        <input pInputText [(ngModel)]="model.minuteModeMinutes" (ngModelChange)="recalculateCrontab()"
               [pattern]="constants.regex1to59" [disabled]="model.mode !== CrontabMode.EVERY_X_MINUTES">
        <div>{{tr.locale.minutes}}</div>
      </div>
    </ng-template>

    <ng-template #everyXHours>
      <div class="flex flex-row align-items-center gap-2" [ngClass]="{'disabled': model.mode !== CrontabMode.EVERY_X_HOURS}">
        <div>{{tr.locale.run_every}}</div>
        <input pInputText [(ngModel)]="model.hourlyModeHours" (ngModelChange)="recalculateCrontab()"
               [pattern]="constants.regex1to23" [disabled]="model.mode !== CrontabMode.EVERY_X_HOURS">
        <div>{{tr.locale.hours}}</div>
      </div>
    </ng-template>

    <ng-template #everyDay>
      <div class="flex flex-row align-items-center gap-2" [ngClass]="{'disabled': model.mode !== CrontabMode.EVERY_DAY}">
        <div>{{tr.locale.run_every_day_at}}</div>
        <input pInputText [(ngModel)]="model.dailyModeTime" (ngModelChange)="recalculateCrontab()"
               [pattern]="constants.timestampRegex" [disabled]="model.mode !== CrontabMode.EVERY_DAY">
        <div>{{tr.locale.time_format_info}}</div>
      </div>
    </ng-template>

    <ng-template #everyWeek>
      <div class="flex flex-row align-items-center gap-2" [ngClass]="{'disabled': model.mode !== CrontabMode.EVERY_WEEK}">
        <div>{{tr.locale.run_every_week_on_day}}</div>
        <div class="flex flex-row align-items-center gap-1">
          <p-checkbox [(ngModel)]="model.monday" [label]="tr.locale.day_mon" [binary]="true"
                      (ngModelChange)="recalculateCrontab()"
                      [disabled]="model.mode !== CrontabMode.EVERY_WEEK"></p-checkbox>
          <p-checkbox [(ngModel)]="model.tuesday" [label]="tr.locale.day_tue" [binary]="true"
                      (ngModelChange)="recalculateCrontab()"
                      [disabled]="model.mode !== CrontabMode.EVERY_WEEK"></p-checkbox>
          <p-checkbox [(ngModel)]="model.wednesday" [label]="tr.locale.day_wed" [binary]="true"
                      (ngModelChange)="recalculateCrontab()"
                      [disabled]="model.mode !== CrontabMode.EVERY_WEEK"></p-checkbox>
          <p-checkbox [(ngModel)]="model.thursday" [label]="tr.locale.day_thu" [binary]="true"
                      (ngModelChange)="recalculateCrontab()"
                      [disabled]="model.mode !== CrontabMode.EVERY_WEEK"></p-checkbox>
          <p-checkbox [(ngModel)]="model.friday" [label]="tr.locale.day_fri" [binary]="true"
                      (ngModelChange)="recalculateCrontab()"
                      [disabled]="model.mode !== CrontabMode.EVERY_WEEK"></p-checkbox>
          <p-checkbox [(ngModel)]="model.saturday" [label]="tr.locale.day_sat" [binary]="true"
                      (ngModelChange)="recalculateCrontab()"
                      [disabled]="model.mode !== CrontabMode.EVERY_WEEK"></p-checkbox>
          <p-checkbox [(ngModel)]="model.sunday" [label]="tr.locale.day_sun" [binary]="true"
                      (ngModelChange)="recalculateCrontab()"
                      [disabled]="model.mode !== CrontabMode.EVERY_WEEK"></p-checkbox>
        </div>
        <div>{{tr.locale.at}}</div>
        <input pInputText [(ngModel)]="model.weeklyModeTime" (ngModelChange)="recalculateCrontab()"
               [pattern]="constants.timestampRegex" [disabled]="model.mode !== CrontabMode.EVERY_WEEK">
        <div>{{tr.locale.time_format_info}}</div>
      </div>
    </ng-template>

    <ng-template #everyNthDayOfWeek>
      <div class="flex flex-row align-items-center gap-2" [ngClass]="{'disabled': model.mode !== CrontabMode.NTH_WEEKDAY}">
        <div>{{tr.locale.run_every}}</div>
        <p-dropdown [options]="tr.localizedWeekOrdinals" [(ngModel)]="model.nthDayOfWeekIndex" optionLabel="label"
                    optionValue="value" appendTo="body"
                    (ngModelChange)="recalculateCrontab()"
                    [disabled]="model.mode !== CrontabMode.NTH_WEEKDAY"></p-dropdown>
        <p-dropdown [options]="tr.localizedWeekDays" [(ngModel)]="model.nthDayOfWeekWeekday" optionLabel="label"
                    optionValue="value"
                    (ngModelChange)="recalculateCrontab()"
                    [disabled]="model.mode !== CrontabMode.NTH_WEEKDAY"></p-dropdown>
        <div>{{tr.locale.of_the_week_at}}</div>
        <input pInputText [(ngModel)]="model.weeklyModeTime" (ngModelChange)="recalculateCrontab()"
               [pattern]="constants.timestampRegex" [disabled]="model.mode !== CrontabMode.NTH_WEEKDAY">
        <div>{{tr.locale.time_format_info}}</div>
      </div>
    </ng-template>

    <ng-template #everyMonth>
      <div class="flex flex-column gap-2" [ngClass]="{'disabled': model.mode !== CrontabMode.EVERY_MONTH}">
        <div class="flex flex-row align-items-center gap-2">
          <div>{{tr.locale.run_every_month_on_day}}</div>
          <input pInputText [(ngModel)]="model.monthlyModeDay" (ngModelChange)="recalculateCrontab()"
                 [pKeyFilter]="constants.regex1to31" [disabled]="model.mode !== CrontabMode.EVERY_MONTH">
          <div>(1-31) {{tr.locale.of_the_week_at}}</div>
          <input pInputText [(ngModel)]="model.monthlyModeTime" (ngModelChange)="recalculateCrontab()"
                 [pattern]="constants.timestampRegex" [disabled]="model.mode !== CrontabMode.EVERY_MONTH">
          <div>{{tr.locale.time_format_info}}</div>
        </div>

        <div>
          <p-checkbox [(ngModel)]="model.monthlyWeekdayMode" [binary]="true" [label]="tr.locale.nearest_weekday_option"
                      (ngModelChange)="recalculateCrontab()"
                      [disabled]="model.mode !== CrontabMode.EVERY_MONTH"></p-checkbox>
        </div>
      </div>
    </ng-template>

    <ng-template #lastDayOfMonth>
      <div class="flex flex-column gap-2" [ngClass]="{'disabled': model.mode !== CrontabMode.LAST_DAY_OF_MONTH}">
        <div class="flex flex-row align-items-center gap-2">
          <div>{{tr.locale.run_on_last_day_of_month}}</div>
          <div>(1-31) {{tr.locale.at}}</div>
          <input pInputText [(ngModel)]="model.lastDayOfMonthModeTime" (ngModelChange)="recalculateCrontab()"
                 [pattern]="constants.timestampRegex" [disabled]="model.mode !== CrontabMode.LAST_DAY_OF_MONTH">
          <div>{{tr.locale.time_format_info}}</div>
        </div>

        <div>
          <p-checkbox [(ngModel)]="model.lastWeekDayOfMonthMode" [binary]="true"
                      [label]="tr.locale.last_weekday_of_month_option"
                      (ngModelChange)="recalculateCrontab()"
                      [disabled]="model.mode !== CrontabMode.LAST_DAY_OF_MONTH"></p-checkbox>
        </div>
      </div>
    </ng-template>

    <ng-template #customCrontab>
      <div class="flex flex-row align-items-center gap-2" [ngClass]="{'disabled': model.mode !== CrontabMode.CUSTOM}">
        <div>{{tr.locale.use_custom_crontab}}</div>
        <input pInputText [(ngModel)]="model.customCrontabString" (ngModelChange)="recalculateCrontab()"
               [disabled]="model.mode !== CrontabMode.CUSTOM">
      </div>
    </ng-template>
  `,
  styles: [`
    .ngx-crontab-builder-root .p-fieldset-legend {
      padding: 0.5rem !important;
    }

    .ngx-crontab-builder-root .p-fieldset-content {
      padding: 0.2rem !important;
    }

    .ngx-crontab-builder-root .p-divider.p-divider-horizontal {
      margin: 0.5rem 0 !important;
    }

    .ngx-crontab-builder-root .disabled {
      opacity: 0.6 !important;
      cursor: default !important;
    }
  `],
  encapsulation: ViewEncapsulation.None,
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
  crontabModeKeys: CrontabMode[] = Object.keys(CrontabMode).filter(x => isNaN(Number(x))).map(x => x as CrontabMode);
  activeTabIndex: number = 0;
  disabled: boolean;
  private  touched: boolean;
  private onTouched: any;
  private onChange: any;

  constructor() {

    this.model = this.crontabService.parse(constants.initialCrontab, false);
  }

  ngOnInit(): void {
    this.tr.updateLocale(this.locale);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['locale']) {
      this.tr.updateLocale(this.locale);
    }
    if(changes['componentStyle']){
      console.log("componentStyle changed", changes);
      this.activeTabIndex = this.crontabModeKeys.indexOf(this.model.mode);
    }
  }

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

  tabChanged(idx: number){
    this.model.mode = this.crontabModeKeys[idx];
    this.recalculateCrontab();
  }

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
    this.activeTabIndex = this.crontabModeKeys.indexOf(this.model.mode);
  }
}
