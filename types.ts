/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'ar' | 'en';

export interface TranslationSchema {
  app_name: string;
  store: string;
  azkar: string;
  quran: string;
  dua: string;
  prayer: string;
  discover: string;
  channel: string;
  visit_store: string;
  store_desc: string;
  buy_now: string;
  counter: string;
  share: string;
  copy: string;
  download: string;
  azkar_title: string;
  quran_title: string;
  dua_title: string;
  prayer_title: string;
  subscribe: string;
  channel_desc: string;
  qibla: string;
  map: string;
  khatma: string;
  podcast: string;
  verse_wall: string;
  allow_location: string;
  enter_city: string;
  tolerance: string;
  adhan_alert: string;
  khatma_plan: string;
  days_left: string;
  report_mistake: string;
  offline_cached: string;
  bismillah_watermark: string;
  quran_read: string;
  surah_list: string;
  next: string;
  prev: string;
  bookmark: string;
  font_size: string;
  night_mode: string;
  play_tilawa: string;
  pro_only: string;
}

export interface Zikr {
  text: string;
  count: number;
  description_ar: string;
  description_en: string;
}

export interface DuaItem {
  ar: string;
  en: string;
  ref_ar: string;
  ref_en: string;
}

export interface SurahMeta {
  id: number;
  name_ar: string;
  name_en: string;
  verses_count: number;
}

export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
}

export interface CachedVerse {
  chapter: number;
  verse_key: string;
  text_uthmani: string;
}
