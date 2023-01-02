import {en} from '../../lang/en';
import {it} from '../../lang/it';
import {LocaleInterface} from "../../lang/locale-interface";
import {ValueAndLabel} from "../models/value-and-label";

export class TranslateService {
  locales: Record<string, LocaleInterface> = {
    'en': en,
    'it': it
  }

  localizedWeekOrdinals: ValueAndLabel[];
  localizedWeekDays: ValueAndLabel[];
  localeCode: string;
  locale: LocaleInterface;

  constructor(locale: string) {
    this.updateLocale(locale);
  }

  public updateLocale(locale: string){
    this.localeCode = locale;
    this.locale = this.locales[locale];

    this.localizedWeekOrdinals = [
      {value: '1', label: this.locale.ord_1},
      {value: '2', label: this.locale.ord_2},
      {value: '3', label: this.locale.ord_3},
      {value: '4', label: this.locale.ord_4},
      {value: '5', label: this.locale.ord_5},
    ];

    this.localizedWeekDays = [
      {value: 'MON', label: this.locale.day_monday},
      {value: 'TUE', label: this.locale.day_tuesday},
      {value: 'WED', label: this.locale.day_wednesday},
      {value: 'THU', label: this.locale.day_thursday},
      {value: 'FRI', label: this.locale.day_friday},
      {value: 'SAT', label: this.locale.day_saturday},
      {value: 'SUN', label: this.locale.day_sunday},
    ];
  }

  public get(locale: string): LocaleInterface {
    return this.locales[locale];
  }


}
