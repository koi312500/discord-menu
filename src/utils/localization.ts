import ko from "../lang/ko.json"
import enUS from "../lang/en_US.json"
import { Locale } from "discord.js"

const lang = {
  ko: ko,
  "en-US": enUS,
} as Partial<Record<Locale, Record<string, string>>>

const defaultLangData = lang["en-US"]!

const t = (locale: keyof typeof Locale, key: string) =>
  (lang[Locale[locale]] ?? defaultLangData)[key] || key
