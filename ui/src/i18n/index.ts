import * as React from 'react';
import zhCN from './zh-CN';

export type Language = 'en' | 'zh-CN';

// Translation keys are the English source strings. Placeholders use the {name} syntax.
export type TranslationKey = keyof typeof zhCN;
export type TranslationParams = Record<string, string | number>;

export const languages: ReadonlyArray<{key: Language; label: string}> = [
    {key: 'en', label: 'English'},
    {key: 'zh-CN', label: '简体中文'},
];

const dictionaries: Record<Language, Partial<Record<TranslationKey, string>>> = {
    en: {},
    'zh-CN': zhCN,
};

const localStorageLanguageKey = 'gotify-language';

export const isLanguage = (value: string | null): value is Language =>
    value === 'en' || value === 'zh-CN';

const detectLanguage = (): Language => {
    const stored = window.localStorage.getItem(localStorageLanguageKey);
    if (isLanguage(stored)) {
        return stored;
    }
    return window.navigator.language?.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
};

let current: Language = detectLanguage();
document.documentElement.lang = current;
const listeners = new Set<VoidFunction>();

export const getLanguage = (): Language => current;

export const setLanguage = (language: Language) => {
    current = language;
    window.localStorage.setItem(localStorageLanguageKey, language);
    document.documentElement.lang = language;
    listeners.forEach((listener) => listener());
};

export const t = (key: TranslationKey, params?: TranslationParams): string => {
    const template = dictionaries[current][key] ?? key;
    if (!params) {
        return template;
    }
    return template.replace(/\{(\w+)\}/g, (match, name: string) =>
        name in params ? String(params[name]) : match
    );
};

const subscribe = (listener: VoidFunction) => {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
};

/**
 * Re-renders the component when the language changes.
 */
export const useTranslation = () => {
    const language = React.useSyncExternalStore(subscribe, getLanguage);
    return {t, language};
};
