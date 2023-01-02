import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {FieldsetModule} from 'primeng/fieldset';

import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgxCrontabBuilderModule} from "ngx-crontab-builder";
import {DropdownModule} from "primeng/dropdown";
import {PaginatorModule} from "primeng/paginator";
import {PanelModule} from "primeng/panel";
import {CheckboxModule} from "primeng/checkbox";
import {ReactiveFormsModule} from "@angular/forms";
import {TabViewModule} from "primeng/tabview";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FieldsetModule,
    DropdownModule,
    PanelModule,
    CheckboxModule,
    PaginatorModule,
    ReactiveFormsModule,
    TabViewModule,
    NgxCrontabBuilderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
