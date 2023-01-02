import {CrontabModel} from "../models/crontab-model";
import {CrontabMode} from "../models/crontab-mode";
import {constants} from "../models/constants";

export class CrontabService {

  updateModel(model: CrontabModel) {
    switch (model.mode) {
      case CrontabMode.EVERY_X_SECONDS:
        this.computeEverySecondCrontab(model);
        break;
      case CrontabMode.EVERY_X_MINUTES:
        this.computeEveryMinuteCrontab(model);
        break;
      case CrontabMode.EVERY_X_HOURS:
        this.computeEveryHourCrontab(model);
        break;
      case CrontabMode.EVERY_DAY:
        this.computeEveryDayCrontab(model);
        break;
      case CrontabMode.EVERY_WEEK:
        this.computeEveryWeekDayCrontab(model);
        break;
      case CrontabMode.NTH_WEEKDAY:
        this.computeEveryNthDayOfWeekCrontab(model);
        break;
      case CrontabMode.EVERY_MONTH:
        this.computeNDayInMonthCrontab(model);
        break;
      case CrontabMode.LAST_DAY_OF_MONTH:
        this.computeLastMonthDay(model);
        break;
      case CrontabMode.CUSTOM:
        this.computeCustom(model);
        break;
    }
  }

  parse(crontab: string, customMode: boolean): CrontabModel {
    if (this.isNullOrWhiteSpace(crontab)) {
      return new CrontabModel({
        mode: CrontabMode.CUSTOM
      });
    }

    if (customMode) {
      return new CrontabModel({
        mode: CrontabMode.CUSTOM,
        customCrontabString: crontab
      });
    }

    //Every X seconds mode
    let re = /0\/([0-9]|[0-5][0-9]) \* \* 1\/1 \* \?/;
    if (re.test(crontab)) {
      return new CrontabModel({
        mode: CrontabMode.EVERY_X_SECONDS,
        outputCrontabString: crontab,
        secondModeSeconds: re.exec(crontab)[1]
      });
    }

    //Every X minutes mode
    re = /0 0\/([0-9]|[0-5][0-9]) \* 1\/1 \* \?/;
    if (re.test(crontab)) {
      return new CrontabModel({
        mode: CrontabMode.EVERY_X_MINUTES,
        outputCrontabString: crontab,
        minuteModeMinutes: re.exec(crontab)[1]
      });
    }

    //Every X hours mode
    re = /0 0 0\/([0-9]|[0-2][0-9]) 1\/1 \* \?/;
    if (re.test(crontab)) {
      return new CrontabModel({
        mode: CrontabMode.EVERY_X_HOURS,
        outputCrontabString: crontab,
        hourlyModeHours: re.exec(crontab)[1]
      });
    }

    //Every day mode
    re = /0 ([0-9]|[0-5][0-9]) ([0-9]|[0-2][0-9]) \* \* \?/;
    if (re.test(crontab)) {
      return new CrontabModel({
        mode: CrontabMode.EVERY_DAY,
        outputCrontabString: crontab,
        dailyModeTime: `${this.padWithZero(re.exec(crontab)[2], 2)}:${this.padWithZero(re.exec(crontab)[1], 2)}`
      });
    }

    //Day of month mode
    re = /0 ([0-9]|[0-5][0-9]) ([0-9]|[0-2][0-9]) ([1-9]|0[1-9]|[1-2][0-9]|3[0-1])W? \* \?/;
    if (re.test(crontab))
    {
      const minutes = this.padWithZero(re.exec(crontab)[1], 2);
      const hours = this.padWithZero(re.exec(crontab)[2], 2);
      const day = re.exec(crontab)[3];

      return new CrontabModel({
        mode: CrontabMode.EVERY_MONTH,
        outputCrontabString: crontab,
        monthlyWeekdayMode: crontab.includes("W"),
        monthlyModeTime: `${hours}:${minutes}`,
        monthlyModeDay: day
      });
    }

    //Last day of month mode
    re = /0 ([0-9]|[0-5][0-9]) ([0-9]|[0-2][0-9]) LW? \* \?/;
    if (re.test(crontab))
    {
      const minutes = this.padWithZero(re.exec(crontab)[1], 2);
      const hours = this.padWithZero(re.exec(crontab)[2], 2);

      return new CrontabModel({
        mode: CrontabMode.LAST_DAY_OF_MONTH,
        outputCrontabString: crontab,
        lastWeekDayOfMonthMode: crontab.includes("LW"),
        lastDayOfMonthModeTime: `${hours}:${minutes}`
      });
    }

    //n-th weekday mode
    re = /0 ([0-9]|[0-5][0-9]) ([0-9]|[0-2][0-9]) \? \* (?<day>(?<mon>(MON|2)#[1-5])|(?<tue>(TUE|3)#[1-5])|(?<wed>(WED|4)#[1-5])|(?<thu>(THU|5)#[1-5])|(?<fri>(FRI|6)#[1-5])|(?<sat>(SAT|7)#[1-5])|(?<sun>(SUN|1)#[1-5]))/;
    if (re.test(crontab))
    {
      const match = re.exec(crontab);
      const minutes = this.padWithZero(match[1], 2);
      const hours = this.padWithZero(match[2], 2);

      let dayOfWeek = match.groups['day'].split('#')[0];
      switch (dayOfWeek)
      {
        case "1":
          dayOfWeek = "SUN";
          break;
        case "2":
          dayOfWeek = "MON";
          break;
        case "3":
          dayOfWeek = "TUE";
          break;
        case "4":
          dayOfWeek = "WED";
          break;
        case "5":
          dayOfWeek = "THU";
          break;
        case "6":
          dayOfWeek = "FRI";
          break;
        case "7":
          dayOfWeek = "SAT";
          break;
        default:
          break;
      }

      return  new CrontabModel({
        mode: CrontabMode.NTH_WEEKDAY,
        outputCrontabString: crontab,
        weeklyModeTime: `${hours}:${minutes}`,
        nthDayOfWeekIndex: match.groups['day'].split('#')[1],
        nthDayOfWeekWeekday: dayOfWeek
      });
    }

    re = /0 ([0-9]|[0-5][0-9]) ([0-9]|[0-2][0-9]) \? \* (MON,?)?(TUE,?)?(WED,?)?(THU,?)?(FRI,?)?(SAT,?)?(SUN,?)?/;
    if (re.test(crontab))
    {
      const minutes = this.padWithZero(re.exec(crontab)[1], 2);
      const hours = this.padWithZero(re.exec(crontab)[2], 2);

      return new CrontabModel({
        mode: CrontabMode.EVERY_WEEK,
        outputCrontabString: crontab,
        weeklyModeTime: `${hours}:${minutes}`,
        monday: crontab.includes("MON"),
        tuesday: crontab.includes("TUE"),
        wednesday: crontab.includes("WED"),
        thursday: crontab.includes("THU"),
        friday: crontab.includes("FRI"),
        saturday: crontab.includes("SAT"),
        sunday: crontab.includes("SUN"),
      });
    }

    //No match, infer custom mode
    return new CrontabModel({
      mode: CrontabMode.CUSTOM,
      outputCrontabString: crontab,
      customCrontabString: crontab
    })
  }

  private padWithZero(s: string, desiredLength: number) {
    while (s.length < desiredLength) {
      s = `0${s}`;
    }

    return s;
  }

  private isNullOrWhiteSpace(input: string) {
    return !input || !input.trim();
  }

  private isValidMinutesOrSeconds(s: string) {
    return !this.isNullOrWhiteSpace(s) && s.match(constants.regex1to59);
  }

  private isValidHours(s: string) {
    return !this.isNullOrWhiteSpace(s) && s.match(constants.regex1to23);
  }

  private isValidTime(s: string) {
    return !this.isNullOrWhiteSpace(s) && s.match(constants.timestampRegex);
  }

  private isValidDayOfMonth(s: string) {
    return !this.isNullOrWhiteSpace(s) && s.match(constants.regex1to31);
  }

  private computeEverySecondCrontab(model: CrontabModel) {
    if (this.isNullOrWhiteSpace(model.secondModeSeconds)) {
      model.secondModeSeconds = "1";
    }
    if (model.mode === CrontabMode.EVERY_X_SECONDS && this.isValidMinutesOrSeconds(model.secondModeSeconds)) {
      const seconds = Number(model.secondModeSeconds);
      model.outputCrontabString = `0/${seconds} * * 1/1 * ?`;
    }
  }

  private computeEveryMinuteCrontab(model: CrontabModel) {
    if (this.isNullOrWhiteSpace(model.minuteModeMinutes)) {
      model.minuteModeMinutes = "1";
    }
    if (model.mode === CrontabMode.EVERY_X_MINUTES && this.isValidMinutesOrSeconds(model.minuteModeMinutes)) {
      const minutes = Number(model.minuteModeMinutes);
      model.outputCrontabString = `0 0/${minutes} * 1/1 * ?`;
    }
  }

  private computeEveryHourCrontab(model: CrontabModel) {
    if (this.isNullOrWhiteSpace(model.hourlyModeHours)) {
      model.hourlyModeHours = "1";
    }
    if (model.mode === CrontabMode.EVERY_X_HOURS && this.isValidHours(model.hourlyModeHours)) {
      const hours = Number(model.hourlyModeHours);
      model.outputCrontabString = `0 0 0/${hours} 1/1 * ?`;
    }
  }

  private computeEveryDayCrontab(model: CrontabModel) {
    if (this.isNullOrWhiteSpace(model.dailyModeTime)) {
      model.dailyModeTime = "12:00"
    }

    if (model.mode === CrontabMode.EVERY_DAY && this.isValidTime(model.dailyModeTime)) {
      const minutes = Number(model.dailyModeTime.split(':')[1]);
      const hours = Number(model.dailyModeTime.split(':')[0]);
      model.outputCrontabString = `0 ${minutes} ${hours} * * ?`;
    }
  }

  private computeEveryWeekDayCrontab(model: CrontabModel) {
    if (this.isNullOrWhiteSpace(model.weeklyModeTime)) {
      model.weeklyModeTime = "12:00";
    }

    if (model.mode === CrontabMode.EVERY_WEEK && this.isValidTime(model.weeklyModeTime)) {
      const daysArray = [
        {day: "MON", selected: model.monday},
        {day: "TUE", selected: model.tuesday},
        {day: "WED", selected: model.wednesday},
        {day: "THU", selected: model.thursday},
        {day: "FRI", selected: model.friday},
        {day: "SAT", selected: model.saturday},
        {day: "SUN", selected: model.sunday}
      ];

      let days = daysArray.filter(d => d.selected)
        .map(d => d.day)
        .join(',');

      if (this.isNullOrWhiteSpace(days)) {
        days = "*";
      }

      const minutes = Number(model.weeklyModeTime.split(':')[1]);
      const hours = Number(model.weeklyModeTime.split(':')[0]);
      model.outputCrontabString = `0 ${minutes} ${hours} ? * ${days}`;

    }

  }

  private computeEveryNthDayOfWeekCrontab(model: CrontabModel) {
    if (this.isNullOrWhiteSpace(model.weeklyModeTime)) {
      model.weeklyModeTime = "12:00";
    }

    if (model.mode === CrontabMode.NTH_WEEKDAY && this.isValidTime(model.weeklyModeTime)) {
      const days = `${model.nthDayOfWeekWeekday}#${model.nthDayOfWeekIndex}`;

      const minutes = Number(model.weeklyModeTime.split(':')[1]);
      const hours = Number(model.weeklyModeTime.split(':')[0]);
      model.outputCrontabString = `0 ${minutes} ${hours} ? * ${days}`;
    }
  }

  private computeNDayInMonthCrontab(model: CrontabModel) {
    if (this.isNullOrWhiteSpace(model.monthlyModeDay)) {
      model.monthlyModeDay = "1";
    }
    if (this.isNullOrWhiteSpace(model.monthlyModeTime)) {
      model.monthlyModeTime = "12:00";
    }

    if (model.mode === CrontabMode.EVERY_MONTH && this.isValidTime(model.monthlyModeTime) && this.isValidDayOfMonth(model.monthlyModeDay)) {
      const minutes = Number(model.monthlyModeTime.split(':')[1]);
      const hours = Number(model.monthlyModeTime.split(':')[0]);
      const dayInMonth = Number(model.monthlyModeDay);
      model.outputCrontabString = `0 ${minutes} ${hours} ${dayInMonth}${model.monthlyWeekdayMode ? "W" : ""} * ?`;
    }
  }

  private computeLastMonthDay(model: CrontabModel) {
    if (this.isNullOrWhiteSpace(model.lastDayOfMonthModeTime)) {
      model.lastDayOfMonthModeTime = "12:00";
    }

    if (model.mode === CrontabMode.LAST_DAY_OF_MONTH && this.isValidTime(model.lastDayOfMonthModeTime)) {
      const minutes = Number(model.lastDayOfMonthModeTime.split(':')[1]);
      const hours = Number(model.lastDayOfMonthModeTime.split(':')[0]);
      model.outputCrontabString = `0 ${minutes} ${hours} ${model.lastWeekDayOfMonthMode ? "LW" : "L"} * ?`;
    }
  }

  private computeCustom(model: CrontabModel){
    if(model.mode === CrontabMode.CUSTOM){
      model.outputCrontabString = model.customCrontabString;
    }
  }
}
