import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Visibility from '@mui/icons-material/Visibility';
import Copy from '@mui/icons-material/FileCopyOutlined';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import React, {CSSProperties} from 'react';
import {useStores} from '../stores';
import {copyToClipboard} from '../clipboard';
import {useTranslation} from '../i18n';

interface IProps {
    value: string;
    style?: CSSProperties;
}

const CopyableSecret = ({value, style}: IProps) => {
    const [visible, setVisible] = React.useState(false);
    const text = visible ? value : '•••••••••••••••';
    const {snackManager} = useStores();
    const {t} = useTranslation();
    const toggleVisibility = () => setVisible((b) => !b);
    return (
        <div style={style}>
            <IconButton
                onClick={() =>
                    copyToClipboard(value).then(
                        () => snackManager.snack(t('Copied to clipboard')),
                        () => snackManager.snack(t('Cannot access clipboard.'))
                    )
                }
                title={t('Copy to clipboard')}
                size="small">
                <Copy fontSize="small" />
            </IconButton>
            <IconButton
                onClick={toggleVisibility}
                className="toggle-visibility"
                title={visible ? t('Hide token') : t('Show token')}
                size="small">
                {visible ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
            </IconButton>
            <Typography
                style={{fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'}}
                sx={{fontSize: 14, ml: 0.5}}>
                {text}
            </Typography>
        </div>
    );
};

export default CopyableSecret;
