import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';
import {Box, Typography} from '@mui/material';
import {useStores} from '../stores';
import {copyToClipboard} from '../clipboard';
import {useTranslation} from '../i18n';

interface IProps {
    token: string;
    fClose: VoidFunction;
}

export const TokenConfirmDialog = ({token, fClose}: IProps) => {
    const {snackManager} = useStores();
    const {t} = useTranslation();

    return (
        <Dialog open={true} aria-labelledby="form-dialog-title" id="token-dialog">
            <DialogTitle id="form-dialog-title">{t('Token Confirmation')}</DialogTitle>
            <DialogContent>
                <DialogContentText>{t('Your token will only be shown once.')}</DialogContentText>
                <Box
                    component="span"
                    sx={{
                        display: 'block',
                        mt: 2,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'action.hover',
                        border: 1,
                        borderColor: 'divider',
                        wordBreak: 'break-all',
                    }}
                    onClick={(e) => {
                        window.getSelection()?.selectAllChildren(e.currentTarget);
                    }}>
                    <Typography
                        className="token"
                        variant="body1"
                        style={{
                            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                            fontSize: 15,
                        }}>
                        {token}
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() =>
                        copyToClipboard(token).then(
                            () => snackManager.snack(t('Copied to clipboard')),
                            () => snackManager.snack(t('Cannot access clipboard.'))
                        )
                    }>
                    {t('Copy to clipboard')}
                </Button>
                <Button className="finish" onClick={fClose} color="primary" variant="contained">
                    {t('Finish')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
