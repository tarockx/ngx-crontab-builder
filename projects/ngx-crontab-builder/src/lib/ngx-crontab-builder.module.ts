import {NgModule} from '@angular/core';
import {NgxCrontabBuilderComponent} from './ngx-crontab-builder.component';
import {InputTextModule} from 'primeng/inputtext';
import {FieldsetModule} from 'primeng/fieldset';
import {CommonModule, NgTemplateOutlet} from "@angular/common";
import {RadioButtonModule} from "primeng/radiobutton";
import {FormsModule} from "@angular/forms";
import {InputNumberModule} from "primeng/inputnumber";
import {KeyFilterModule} from "primeng/keyfilter";

@NgModule({
  declarations: [
    NgxCrontabBuilderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    FieldsetModule,
    RadioButtonModule,
    InputNumberModule,
    KeyFilterModule,
    NgTemplateOutlet
  ],
  exports: [
    NgxCrontabBuilderComponent
  ]
})
export class NgxCrontabBuilderModule {
}
