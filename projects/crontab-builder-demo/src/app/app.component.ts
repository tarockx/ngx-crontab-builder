import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgxCrontabBuilderComponent, ComponentStyle} from "ngx-crontab-builder";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Subscription} from "rxjs";
import {Panel} from "primeng/panel";
import {Checkbox} from "primeng/checkbox";
import {Select} from "primeng/select";
import {TabPanels, TabPanel, Tab, Tabs, TabList} from "primeng/tabs";

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    NgxCrontabBuilderComponent,
    Panel,
    FormsModule,
    Checkbox,
    ReactiveFormsModule,
    Select,
    Tab,
    Tabs,
    TabPanel,
    TabPanels,
    TabList
  ],
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'crontab-builder-demo';

  //UI values
  languages = [
    {value: 'en', label: 'English'},
    {value: 'it', label: 'Italian'}
  ];
  componentStyles = [
    {value: ComponentStyle.PLAIN, label: 'Plain panel with separators'},
    {value: ComponentStyle.FIELDSETS, label: 'Field sets'},
    {value: ComponentStyle.TABBED, label: 'Tabbed interface'},
  ];
  currentCrontab!: string|null;

  //ngModel data binding backing property
  crontabProperty: string = '0/42 * * 1/1 * ?';

  //reactive forms backing property
  crontabFormControl = new FormControl('0/42 * * 1/1 * ?');

  //ngx-crontab-builder configuration
  selectedLanguage: string = 'en';
  selectedStyle = ComponentStyle.FIELDSETS;
  showSecondsMode: boolean = true;
  showMinutesMode: boolean = true;
  showHoursMode: boolean = true;
  showDailyMode: boolean = true;
  showWeekMode: boolean = true;
  showNthDayOfWeekMode: boolean = true;
  showMonthMode: boolean = true;
  showLastDayOfMonthMode: boolean = true;
  showCustomExpressionMode: boolean = true;

  //private
  private formSubscription!: Subscription;

  constructor() {
  }

  crontabUpdated(crontab: string) {
    console.log("Crontab has changed (ngModel)", crontab);
    this.currentCrontab = crontab;
  }

  modeChanged(activeIndex: unknown) {
    this.currentCrontab = activeIndex === 0 ? this.crontabProperty : this.crontabFormControl.getRawValue();
  }

  ngOnInit(): void {
    this.formSubscription = this.crontabFormControl.valueChanges.subscribe({
      next: (crontab) => {
        console.log("Crontab has changed (reactive)", crontab);
        this.currentCrontab = crontab;
      }
    });
  }

  ngOnDestroy(): void {
    this.formSubscription?.unsubscribe();
  }

}
