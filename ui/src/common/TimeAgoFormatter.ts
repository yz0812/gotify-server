import {Formatter} from 'react-timeago';
import {makeIntlFormatter} from 'react-timeago/defaultFormatter';
import {getLanguage, Language} from '../i18n';

type FormatterStyle = 'long' | 'narrow' | 'longMinutes';

const createFormatters = (locale: Language): Record<FormatterStyle, Formatter> => {
    const longFormatter = makeIntlFormatter({style: 'long', locale});
    const longMinutesFormatter: Formatter = (value, unit, ...rest) =>
        unit === 'second'
            ? longFormatter(1, 'minute', ...rest)
            : longFormatter(value, unit, ...rest);
    return {
        long: longFormatter,
        narrow: makeIntlFormatter({style: 'narrow', locale}),
        longMinutes: longMinutesFormatter,
    };
};

const formatters: Record<Language, Record<FormatterStyle, Formatter>> = {
    en: createFormatters('en'),
    'zh-CN': createFormatters('zh-CN'),
};

// Components using this must re-render on language change (e.g. via useTranslation).
export const timeAgoFormatter = (style: FormatterStyle): Formatter =>
    formatters[getLanguage()][style];

export const formatDate = (date: string): string => date.slice(0, 10);
