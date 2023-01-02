import {NgModule} from '@angular/core';
import {NgxCrontabBuilderComponent} from './ngx-crontab-builder.component';
import {InputTextModule} from 'primeng/inputtext';
import {FieldsetModule} from 'primeng/fieldset';
import {CommonModule, NgTemplateOutlet} from "@angular/common";
import {RadioButtonModule} from "primeng/radiobutton";
import {FormsModule} from "@angular/forms";
import {InputNumberModule} from "primeng/inputnumber";
import {KeyFilterModule} from "primeng/keyfilter";
import {CheckboxModule} from "primeng/checkbox";
import {DropdownModule} from "primeng/dropdown";
import {DividerModule} from "primeng/divider";
import {ComponentStyle} from "./models/component-style";
import {TabViewModule} from "primeng/tabview";

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
    CheckboxModule,
    DropdownModule,
    DividerModule,
    InputNumberModule,
    TabViewModule,
    KeyFilterModule,
    NgTemplateOutlet
  ],
  exports: [
    NgxCrontabBuilderComponent
  ]
})
export class NgxCrontabBuilderModule {
}
