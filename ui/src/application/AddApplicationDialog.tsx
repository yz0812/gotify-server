import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import {NumberField} from '../common/NumberField';
import React, {useState} from 'react';
import {useTranslation} from '../i18n';

interface IProps {
    fClose: (token: string | null) => void;
    fOnSubmit: (name: string, description: string, defaultPriority: number) => Promise<string>;
}

export const AddApplicationDialog = ({fClose, fOnSubmit}: IProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [defaultPriority, setDefaultPriority] = useState(0);
    const {t} = useTranslation();

    const submitEnabled = name.length !== 0;
    const submitAndNext = async () => {
        const token = await fOnSubmit(name, description, defaultPriority);
        fClose(token);
    };

    return (
        <Dialog
            open={true}
            onClose={() => fClose(null)}
            aria-labelledby="form-dialog-title"
            id="app-dialog">
            <DialogTitle id="form-dialog-title">{t('Create an application')}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t('An application is allowed to send messages.')}
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
                <TextField
                    margin="dense"
                    className="description"
                    label={t('Short Description')}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    multiline
                />
                <NumberField
                    margin="dense"
                    className="priority"
                    label={t('Default Priority')}
                    value={defaultPriority}
                    onChange={(value) => setDefaultPriority(value)}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => fClose(null)}>{t('Cancel')}</Button>
                <Tooltip title={submitEnabled ? '' : t('name is required')}>
                    <div>
                        <Button
                            className="create"
                            disabled={!submitEnabled}
                            onClick={submitAndNext}
                            color="primary"
                            variant="contained">
                            {t('Create')}
                        </Button>
                    </div>
                </Tooltip>
            </DialogActions>
        </Dialog>
    );
};
