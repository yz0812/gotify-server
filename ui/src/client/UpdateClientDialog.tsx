import React, {useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import {NumberField} from '../common/NumberField';
import {useTranslation} from '../i18n';

interface IProps {
    fClose: VoidFunction;
    fOnSubmit: (name: string, expiresAfterInactivitySeconds: number) => Promise<void>;
    initialName: string;
    initialExpiresAfterInactivitySeconds: number;
}

const UpdateClientDialog = ({
    fClose,
    fOnSubmit,
    initialName = '',
    initialExpiresAfterInactivitySeconds,
}: IProps) => {
    const [name, setName] = useState(initialName);
    const [expiresAfter, setExpiresAfter] = useState(initialExpiresAfterInactivitySeconds);
    const {t} = useTranslation();

    const submitEnabled = name.length !== 0;
    const submitAndClose = async () => {
        await fOnSubmit(name, Math.max(0, expiresAfter));
        fClose();
    };

    return (
        <Dialog open={true} onClose={fClose} aria-labelledby="form-dialog-title" id="client-dialog">
            <DialogTitle id="form-dialog-title">{t('Update a Client')}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t(
                        'A client manages messages, clients, applications and users (with admin permissions).'
                    )}
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    className="name"
                    label={t('Name *')}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                />
                <NumberField
                    margin="dense"
                    className="expires-after"
                    label={t('Expires after inactivity (seconds, 0 = never)')}
                    value={expiresAfter}
                    onChange={(value) => setExpiresAfter(value)}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={fClose}>{t('Cancel')}</Button>
                <Tooltip title={submitEnabled ? '' : t('name is required')}>
                    <div>
                        <Button
                            className="update"
                            disabled={!submitEnabled}
                            onClick={submitAndClose}
                            color="primary"
                            variant="contained">
                            {t('Update')}
                        </Button>
                    </div>
                </Tooltip>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateClientDialog;
