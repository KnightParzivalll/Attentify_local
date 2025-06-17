import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import enTranslation from './locales/en/translation.json'
import ruTranslation from './locales/ru/translation.json'

// Define resources type
const resources = {
	en: { translation: enTranslation },
	ru: { translation: ruTranslation }
} as const

i18n
	.use(LanguageDetector) // Auto-detects language
	.use(initReactI18next) // Bind i18next to React
	.init({
		resources,
		fallbackLng: 'en', // Default language
		detection: {
			order: ['localStorage', 'cookie', 'sessionStorage', 'navigator'], // Check storage first, then browser
			caches: ['localStorage', 'cookie'] // Save selected language
		},
		interpolation: { escapeValue: false }
	})

export default i18n
