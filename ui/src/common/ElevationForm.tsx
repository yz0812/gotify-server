import React, {useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {observer} from 'mobx-react-lite';
import {useStores} from '../stores';
import * as config from '../config';
import CircularProgress from '@mui/material/CircularProgress';
import {Box, Divider} from '@mui/material';
import {useTranslation} from '../i18n';

const ElevateDuration = 60 * 60;

const ElevationForm = observer(() => {
    const {elevateStore} = useStores();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const {t} = useTranslation();

    const localAuthEnabled = config.get('localAuth');
    const oidcEnabled = config.get('oidc');
    const oidcPending = elevateStore.oidcElevatePending;
    const oidcIdpName = config.get('oidcIdpName');

    const handleLocalElevate = async () => {
        try {
            await elevateStore.localElevate(password, ElevateDuration);
        } catch {
            setError(t('Elevation failed. Check your password.'));
        }
    };

    if (oidcPending) {
        return (
            <Box sx={{textAlign: 'center', my: 2}}>
                <CircularProgress sx={{mb: 2}} />
                <Typography sx={{mb: 1}}>
                    {t('Waiting for {name} sign-in...', {name: oidcIdpName})}
                </Typography>
                <Typography variant="body2" sx={{color: 'text.secondary', mb: 1}}>
                    {t('Complete sign-in in the new tab, then close it to continue.')}
                </Typography>
                <Button
                    className="elevation-oidc-cancel"
                    variant="outlined"
                    fullWidth
                    onClick={() => elevateStore.cleanupOidcElevate()}>
                    {t('Cancel {name} Login', {name: oidcIdpName})}
                </Button>
            </Box>
        );
    }

    return (
        <>
            <Typography sx={{color: 'text.secondary', mb: 1}}>
                {t('This action requires re-authentication.')}
            </Typography>
            {localAuthEnabled && (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleLocalElevate();
                    }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        type="password"
                        label={t('Password')}
                        className="elevation-password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError('');
                        }}
                        fullWidth
                        error={!!error}
                        helperText={error}
                    />
                    <Button
                        type="submit"
                        className="elevation-submit"
                        disabled={password.length === 0}
                        color="primary"
                        variant="contained"
                        sx={{mt: 1}}
                        fullWidth>
                        {t('Elevate with Password')}
                    </Button>
                </form>
            )}

            {oidcEnabled && (
                <>
                    {localAuthEnabled && <Divider sx={{my: 2}}>{t('or')}</Divider>}
                    <Button
                        className="elevation-oidc"
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => elevateStore.oidcElevate(ElevateDuration)}>
                        {t('Elevate via {name}', {name: oidcIdpName})}
                    </Button>
                </>
            )}
        </>
    );
});

export default ElevationForm;
