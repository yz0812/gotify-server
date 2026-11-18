import {Typography} from '@mui/material';
import React from 'react';
import TimeAgo from 'react-timeago';
import {timeAgoFormatter} from './TimeAgoFormatter';
import {useTranslation} from '../i18n';

export const LastUsedCell: React.FC<{lastUsed: string | null}> = ({lastUsed}) => {
    const {t} = useTranslation();
    if (lastUsed === null) {
        return (
            <Typography variant="body2" sx={{color: 'text.secondary'}}>
                {t('Never')}
            </Typography>
        );
    }

    if (+new Date(lastUsed) + 300000 > Date.now()) {
        return (
            <Typography variant="body2" title={lastUsed}>
                {t('Recently')}
            </Typography>
        );
    }

    return <TimeAgo date={lastUsed} formatter={timeAgoFormatter('long')} />;
};
