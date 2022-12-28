import { en } from '../../lang/en';
import { it } from '../../lang/it';
import {LocaleInterface} from "../../lang/locale-interface";

export class TranslateService {
  locales: Record<string, LocaleInterface> = {
    'en': en,
    'it': it
  }

  constructor() { }

  public get(locale: string): LocaleInterface{
    return this.locales[locale];
  }

  // public translate(key: string, locale: string): string{
  //   return (this.locales[locale] as any)[key];
  // }
}
