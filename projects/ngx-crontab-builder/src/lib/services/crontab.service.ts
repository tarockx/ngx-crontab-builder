import {CrontabModel} from "../models/crontab-model";
import {CrontabMode} from "../models/crontab-mode";

export class CrontabService {

  updateModel(model: CrontabModel) {
    console.log("model", model);
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

    }

    console.log("model updated", model);
  }

  parse(crontab: string, customMode: boolean): CrontabModel{
    if(this.isNullOrWhiteSpace(crontab)){
      return  new CrontabModel({
        mode: CrontabMode.CUSTOM
      });
    }

    if(customMode){
      return new CrontabModel({
        mode: CrontabMode.CUSTOM,
        customCrontabString: crontab
      });
    }

    let re = /0\/([0-9]|[0-5][0-9]) \* \* 1\/1 \* \?/;
    if (re.test(crontab))
    {
      return new CrontabModel({
        mode: CrontabMode.EVERY_X_SECONDS,
        outputCrontabString: crontab,
        secondModeSeconds: re.exec(crontab)[1]
      });
    }

    re = /0 0\/([0-9]|[0-5][0-9]) \* 1\/1 \* \?/;
    if (re.test(crontab))
    {
      return new CrontabModel({
        mode: CrontabMode.EVERY_X_MINUTES,
        outputCrontabString: crontab,
        minuteModeMinutes: re.exec(crontab)[1]
      });
    }

    re = /0 0 0\/([0-9]|[0-2][0-9]) 1\/1 \* \?/;
    if (re.test(crontab))
    {
      return new CrontabModel({
        mode: CrontabMode.EVERY_X_HOURS,
        outputCrontabString: crontab,
        hourlyModeHours: re.exec(crontab)[1]
      });
    }

    //No match, infer custom mode
    return  new CrontabModel({
      mode: CrontabMode.CUSTOM,
      outputCrontabString: crontab,
      customCrontabString: crontab
    })
  }

  private isNullOrWhiteSpace(input: string) {
    return !input || !input.trim();
  }

  private isValidMinutesOrSeconds(s: string) {
    if (this.isNullOrWhiteSpace(s) || !s.match(/^[0-9]?[0-9]$/gm)) {
      return false;
    }

    const val = Number(s);
    return val > 0 && val < 60;
  }

  private isValidHours(s: string) {
    if (this.isNullOrWhiteSpace(s) || !s.match(/^[0-2]?[0-9]$/gm)) {
      return false;
    }

    const val = Number(s);
    return val > 0 && val < 24;
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
}
