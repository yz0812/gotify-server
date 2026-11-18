import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ErrorOutline from '@mui/icons-material/ErrorOutlined';
import {useTranslation} from '../i18n';

interface ConnectionErrorBannerProps {
    height: number;
    retry: () => void;
    message: string;
}

export const ConnectionErrorBanner = ({height, retry, message}: ConnectionErrorBannerProps) => {
    const {t} = useTranslation();
    return (
        <div
            style={{
                background: 'linear-gradient(90deg, #dc2626, #e11d48)',
                color: '#fff',
                height,
                width: '100%',
                zIndex: 1300,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                padding: '0 16px',
            }}>
            <ErrorOutline />
            <Typography sx={{fontWeight: 500}} noWrap>
                {message}
            </Typography>
            <Button
                variant="contained"
                size="small"
                onClick={retry}
                sx={{bgcolor: '#fff', color: '#dc2626', '&:hover': {bgcolor: '#fee2e2'}}}>
                {t('Retry')}
            </Button>
        </div>
    );
};
