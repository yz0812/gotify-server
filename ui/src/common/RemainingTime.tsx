import React, {useEffect, useState} from 'react';
import {t, useTranslation} from '../i18n';

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const REFRESH_MS = 5 * MINUTE_MS;

const format = (until: string): string => {
    const diffMs = Math.max(0, Date.parse(until) - Date.now());
    const days = Math.floor(diffMs / DAY_MS);
    const hours = Math.floor((diffMs % DAY_MS) / HOUR_MS);
    const minutes = Math.floor((diffMs % HOUR_MS) / MINUTE_MS);
    const parts: string[] = [];
    if (days > 0) parts.push(t('{value}d', {value: days}));
    if (days > 0 || hours > 0) parts.push(t('{value}h', {value: hours}));
    parts.push(t('{value}m', {value: minutes}));
    return parts.join(' ');
};

export const RemainingTime: React.FC<{until: string | null | undefined}> = ({until}) => {
    const [, setTick] = useState(0);
    useTranslation();
    useEffect(() => {
        const id = window.setInterval(() => setTick((t) => t + 1), REFRESH_MS);
        return () => window.clearInterval(id);
    }, []);
    if (!until) return <>-</>;
    return <>{format(until)}</>;
};
