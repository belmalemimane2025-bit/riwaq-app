/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CachedVerse } from '../types';

export class RiwaqDB {
  private static dbName = 'RiwaqDB';
  private static dbVersion = 1;

  private static getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event) => {
        const db = request.result;
        if (!db.objectStoreNames.contains('verses')) {
          db.createObjectStore('verses', { keyPath: 'verse_key' });
        }
        if (!db.objectStoreNames.contains('bookmark')) {
          db.createObjectStore('bookmark', { keyPath: 'id' });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  /**
   * Cache a list of verses
   */
  public static async cacheVerses(verses: CachedVerse[]): Promise<void> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction('verses', 'readwrite');
      const store = transaction.objectStore('verses');

      for (const v of verses) {
        store.put(v);
      }

      return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });
    } catch (e) {
      console.error('IndexedDB Error in cacheVerses:', e);
    }
  }

  /**
   * Fetch verses cached for a given chapter
   */
  public static async getCachedVerses(chapterId: number): Promise<CachedVerse[]> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction('verses', 'readonly');
      const store = transaction.objectStore('verses');

      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => {
          const all = request.result as CachedVerse[];
          // Filter by chapter
          const filtered = all.filter((v) => v.chapter === chapterId);
          resolve(filtered);
        };
        request.onerror = () => {
          reject(request.error);
        };
      });
    } catch (e) {
      console.error('IndexedDB Error in getCachedVerses:', e);
      return [];
    }
  }

  /**
   * Keep only last N cached verses to prevent infinite storage growth
   */
  public static async pruneVerses(limit = 200): Promise<void> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction('verses', 'readwrite');
      const store = transaction.objectStore('verses');

      const allRequest = store.getAll();
      allRequest.onsuccess = () => {
        const all = allRequest.result;
        if (all.length > limit) {
          // Delete extra
          const toDelete = all.length - limit;
          for (let i = 0; i < toDelete; i++) {
            store.delete(all[i].verse_key);
          }
        }
      };
    } catch (e) {
      console.error('IndexedDB Error in pruneVerses:', e);
    }
  }

  /**
   * Set bookmark
   */
  public static async saveBookmark(bookmark: { id: string; chapter: number; verseNumber: number; surahName: string }): Promise<void> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction('bookmark', 'readwrite');
      const store = transaction.objectStore('bookmark');
      store.put(bookmark);
    } catch (e) {
      console.error('IndexedDB Error saving bookmark:', e);
    }
  }

  /**
   * Get bookmark
   */
  public static async getBookmark(): Promise<{ id: string; chapter: number; verseNumber: number; surahName: string } | null> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction('bookmark', 'readonly');
      const store = transaction.objectStore('bookmark');
      return new Promise((resolve) => {
        const request = store.get('current');
        request.onsuccess = () => {
          resolve(request.result || null);
        };
        request.onerror = () => {
          resolve(null);
        };
      });
    } catch (e) {
      return null;
    }
  }
}
export default RiwaqDB;
