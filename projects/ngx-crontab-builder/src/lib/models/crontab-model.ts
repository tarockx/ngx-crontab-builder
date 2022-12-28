import {CrontabMode} from "./crontab-mode";

export class CrontabModel {
  public constructor(init?:Partial<CrontabModel>) {
    Object.assign(this, init);
  }

  mode: CrontabMode

  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  saturday: boolean;
  friday: boolean;
  sunday: boolean;

  monthlyModeTime: string;
  monthlyModeDay: string;
  secondModeSeconds: string;
  minuteModeMinutes: string;
  hourlyModeHours: string;
  dailyModeTime: string;
  weeklyModeTime: string;
  lastDayOfMonthModeTime: string;
  nthDayOfWeekIndex: string;
  nthDayOfWeekWeekday: string;
  outputCrontabString: string;
  customCrontabString: string;
}
