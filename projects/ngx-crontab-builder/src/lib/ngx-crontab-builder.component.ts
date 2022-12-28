import {
  AfterContentInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {TranslateService} from "./services/translate.service";
import {CrontabMode} from "./models/crontab-mode";
import {CrontabModel} from "./models/crontab-model";
import {CrontabService} from "./services/crontab.service";

@Component({
  selector: 'ngx-crontab-builder',
  template: `
    <div class="flex flex-column gap-1">
      <p-fieldset *ngIf="showSecondsMode">
        <ng-template pTemplate="header">
            <p-radioButton [(ngModel)]="model.mode" (ngModelChange)="recalculateCrontab()" [value]="CrontabMode.EVERY_X_SECONDS" name="crontabmode" [label]="tr().header_every_x_seconds" ></p-radioButton>
        </ng-template>

        <ng-template [ngTemplateOutlet]="everyXSeconds"></ng-template>
      </p-fieldset>

      <p-fieldset *ngIf="showMinutesMode">
        <ng-template pTemplate="header">
          <p-radioButton [(ngModel)]="model.mode" (ngModelChange)="recalculateCrontab()" [value]="CrontabMode.EVERY_X_MINUTES" name="crontabmode" [label]="tr().header_every_x_minutes" ></p-radioButton>
        </ng-template>

        <ng-template [ngTemplateOutlet]="everyXMinutes"></ng-template>
      </p-fieldset>

      <p-fieldset *ngIf="showHoursMode">
        <ng-template pTemplate="header">
          <p-radioButton [(ngModel)]="model.mode" (ngModelChange)="recalculateCrontab()" [value]="CrontabMode.EVERY_X_HOURS" name="crontabmode"
                         [label]="tr().header_every_x_hours"></p-radioButton>
        </ng-template>

        <ng-template [ngTemplateOutlet]="everyXHours"></ng-template>
      </p-fieldset>
    </div>

    <ng-template #everyXSeconds>
      <div class="flex flex-row align-items-center gap-2">
        <div>{{tr().run_every}}</div>
        <input pInputText [(ngModel)]="model.secondModeSeconds" (ngModelChange)="recalculateCrontab()"
               [pKeyFilter]="'int'" [disabled]="model.mode !== CrontabMode.EVERY_X_SECONDS">
        <div>{{tr().seconds}}</div>
      </div>
    </ng-template>

    <ng-template #everyXMinutes>
      <div class="flex flex-row align-items-center gap-2">
        <div>{{tr().run_every}}</div>
        <input pInputText [(ngModel)]="model.minuteModeMinutes" (ngModelChange)="recalculateCrontab()"
               [pKeyFilter]="'int'" [disabled]="model.mode !== CrontabMode.EVERY_X_MINUTES">
        <div>{{tr().minutes}}</div>
      </div>
    </ng-template>

    <ng-template #everyXHours>
      <div class="flex flex-row align-items-center gap-2">
        <div>{{tr().run_every}}</div>
        <input pInputText [(ngModel)]="model.hourlyModeHours" (ngModelChange)="recalculateCrontab()"
               [pKeyFilter]="'int'" [disabled]="model.mode !== CrontabMode.EVERY_X_HOURS">
        <div>{{tr().hours}}</div>
      </div>
    </ng-template>
  `,
  styles: [
  ]
})
export class NgxCrontabBuilderComponent implements OnInit, OnChanges  {
  private translateService: TranslateService = new TranslateService();
  private crontabService: CrontabService = new CrontabService();

  CrontabMode = CrontabMode;

  @Input() locale: string;

  @Input() crontab: string;
  @Output() crontabChange = new EventEmitter<string>();
  @Input() showSecondsMode: boolean = true;
  @Input() showMinutesMode: boolean = true;
  @Input() showHoursMode: boolean = true;

  model: CrontabModel;

  constructor() {
    this.model = this.crontabService.parse("0/1 * * 1/1 * ?", false);
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['crontab']){
      this.model = this.crontabService.parse(this.crontab, false);
      setTimeout(() => this.crontabChange.emit(this.model.outputCrontabString));
    }
  }

  recalculateCrontab() {
    this.crontabService.updateModel(this.model);
    if(this.crontab !== this.model.outputCrontabString){
      this.crontab = this.model.outputCrontabString;
      this.crontabChange.emit(this.model.outputCrontabString);
    }
  }

  tr(){
    return this.translateService.get(this.locale || 'en');
  }
}
