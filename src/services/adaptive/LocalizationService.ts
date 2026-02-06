import { SupportedLanguage } from '../types';
import * as fs from 'fs';
import * as path from 'path';

export class LocalizationService {
  private translations: Map<SupportedLanguage, any>;
  private currentLanguage: Map<string, SupportedLanguage>;

  constructor() {
    this.translations = new Map();
    this.currentLanguage = new Map();
    this.loadTranslations();
  }

  private loadTranslations(): void {
    const languages: SupportedLanguage[] = ['en', 'es', 'fr', 'de', 'zh', 'ja'];

    for (const lang of languages) {
      const translationPath = path.join(__dirname, '../locales', `${lang}.json`);

      if (fs.existsSync(translationPath)) {
        const translation = JSON.parse(fs.readFileSync(translationPath, 'utf-8'));
        this.translations.set(lang, translation);
      } else {
        // Create default translation file
        const defaultTranslation = this.getDefaultTranslations(lang);
        this.translations.set(lang, defaultTranslation);

        // Save to file
        fs.mkdirSync(path.dirname(translationPath), { recursive: true });
        fs.writeFileSync(translationPath, JSON.stringify(defaultTranslation, null, 2));
      }
    }
  }

  private getDefaultTranslations(lang: SupportedLanguage): any {
    const translations: Record<SupportedLanguage, any> = {
      en: {
        common: {
          welcome: 'Welcome',
          save: 'Save',
          cancel: 'Cancel',
          delete: 'Delete',
          edit: 'Edit',
          close: 'Close',
        },
        aiCompanion: {
          greeting: 'Hello! How can I support you today?',
          listeningPrompt: 'I\'m listening...',
          processingMessage: 'Thinking...',
        },
        health: {
          medicationReminder: 'Time to take your medication',
          hydrationReminder: 'Remember to drink water',
          trackVitals: 'Track your vitals',
        },
        routines: {
          morningRoutine: 'Morning Routine',
          middayRoutine: 'Midday Routine',
          nightRoutine: 'Night Routine',
        },
      },
      es: {
        common: {
          welcome: 'Bienvenido',
          save: 'Guardar',
          cancel: 'Cancelar',
          delete: 'Eliminar',
          edit: 'Editar',
          close: 'Cerrar',
        },
        aiCompanion: {
          greeting: '¡Hola! ¿Cómo puedo apoyarte hoy?',
          listeningPrompt: 'Estoy escuchando...',
          processingMessage: 'Pensando...',
        },
        health: {
          medicationReminder: 'Hora de tomar tu medicación',
          hydrationReminder: 'Recuerda beber agua',
          trackVitals: 'Registra tus signos vitales',
        },
        routines: {
          morningRoutine: 'Rutina Matutina',
          middayRoutine: 'Rutina del Mediodía',
          nightRoutine: 'Rutina Nocturna',
        },
      },
      fr: {
        common: {
          welcome: 'Bienvenue',
          save: 'Enregistrer',
          cancel: 'Annuler',
          delete: 'Supprimer',
          edit: 'Modifier',
          close: 'Fermer',
        },
        aiCompanion: {
          greeting: 'Bonjour! Comment puis-je vous aider aujourd\'hui?',
          listeningPrompt: 'J\'écoute...',
          processingMessage: 'Réflexion...',
        },
        health: {
          medicationReminder: 'Il est temps de prendre vos médicaments',
          hydrationReminder: 'N\'oubliez pas de boire de l\'eau',
          trackVitals: 'Enregistrez vos signes vitaux',
        },
        routines: {
          morningRoutine: 'Routine Matinale',
          middayRoutine: 'Routine de Midi',
          nightRoutine: 'Routine Nocturne',
        },
      },
      de: {
        common: {
          welcome: 'Willkommen',
          save: 'Speichern',
          cancel: 'Abbrechen',
          delete: 'Löschen',
          edit: 'Bearbeiten',
          close: 'Schließen',
        },
        aiCompanion: {
          greeting: 'Hallo! Wie kann ich Sie heute unterstützen?',
          listeningPrompt: 'Ich höre zu...',
          processingMessage: 'Nachdenken...',
        },
        health: {
          medicationReminder: 'Zeit für Ihre Medikamente',
          hydrationReminder: 'Denken Sie daran, Wasser zu trinken',
          trackVitals: 'Ihre Vitalwerte erfassen',
        },
        routines: {
          morningRoutine: 'Morgenroutine',
          middayRoutine: 'Mittagsroutine',
          nightRoutine: 'Abendroutine',
        },
      },
      zh: {
        common: {
          welcome: '欢迎',
          save: '保存',
          cancel: '取消',
          delete: '删除',
          edit: '编辑',
          close: '关闭',
        },
        aiCompanion: {
          greeting: '你好！今天我能如何帮助你？',
          listeningPrompt: '我在听...',
          processingMessage: '思考中...',
        },
        health: {
          medicationReminder: '该吃药了',
          hydrationReminder: '记得喝水',
          trackVitals: '记录您的生命体征',
        },
        routines: {
          morningRoutine: '早晨例行',
          middayRoutine: '午间例行',
          nightRoutine: '夜间例行',
        },
      },
      ja: {
        common: {
          welcome: 'ようこそ',
          save: '保存',
          cancel: 'キャンセル',
          delete: '削除',
          edit: '編集',
          close: '閉じる',
        },
        aiCompanion: {
          greeting: 'こんにちは！今日はどのようにサポートできますか？',
          listeningPrompt: '聞いています...',
          processingMessage: '考え中...',
        },
        health: {
          medicationReminder: '薬を飲む時間です',
          hydrationReminder: '水を飲むことを忘れずに',
          trackVitals: 'バイタルサインを記録',
        },
        routines: {
          morningRoutine: '朝のルーティン',
          middayRoutine: '昼のルーティン',
          nightRoutine: '夜のルーティン',
        },
      },
    };

    return translations[lang];
  }

  translate(userId: string, key: string, params?: Record<string, string>): string {
    const lang = this.currentLanguage.get(userId) || 'en';
    const translation = this.translations.get(lang);

    if (!translation) {
      return key;
    }

    // Navigate nested keys (e.g., "common.welcome")
    const keys = key.split('.');
    let value = translation;

    for (const k of keys) {
      value = value[k];
      if (value === undefined) {
        return key;
      }
    }

    // Replace parameters
    if (params && typeof value === 'string') {
      Object.entries(params).forEach(([param, replacement]) => {
        value = value.replace(`{${param}}`, replacement);
      });
    }

    return value;
  }

  setLanguage(userId: string, language: SupportedLanguage): void {
    this.currentLanguage.set(userId, language);
  }

  getLanguage(userId: string): SupportedLanguage {
    return this.currentLanguage.get(userId) || 'en';
  }

  getSupportedLanguages(): SupportedLanguage[] {
    return ['en', 'es', 'fr', 'de', 'zh', 'ja'];
  }
}
