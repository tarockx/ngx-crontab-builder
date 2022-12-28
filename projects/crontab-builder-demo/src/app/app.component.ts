import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'crontab-builder-demo';

  languages = [
    { value: 'en', label: 'English' },
    { value: 'it', label: 'Italian' }
  ];
  selectedLanguage: string = 'en';
  currentCrontab: string = '0/42 * * 1/1 * ?';

  showSecondsMode: boolean = true;
  showMinutesMode: boolean = true;
  showHoursMode: boolean = true;

  constructor() {
  }

  crontabUpdated(crontab: string) {
    this.currentCrontab = crontab;
  }
}
