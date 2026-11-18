import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Palette from '@mui/icons-material/PaletteOutlined';
import Lock from '@mui/icons-material/LockOutlined';
import {alpha} from '@mui/material/styles';
import {observer} from 'mobx-react-lite';
import DefaultPage from '../common/DefaultPage';
import ElevationForm from '../common/ElevationForm';
import {ThemeKey} from '../layout/theme';
import {useStores} from '../stores';
import * as config from '../config';
import {isLanguage, languages, setLanguage, useTranslation} from '../i18n';

interface IProps {
    themeMode: ThemeKey;
    setTheme: (theme: ThemeKey) => void;
}

const Section: React.FC<
    React.PropsWithChildren<{icon: React.ReactNode; title: string; className?: string}>
> = ({icon, title, className, children}) => (
    <Grid size={{xs: 12}}>
        <Paper elevation={1} sx={{padding: 3}} className={className}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5, marginBottom: 2.5}}>
                <Box
                    sx={(theme) => ({
                        display: 'flex',
                        padding: 1,
                        borderRadius: 2,
                        color: theme.palette.primary.main,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    })}>
                    {icon}
                </Box>
                <Typography variant="h6">{title}</Typography>
            </Box>
            {children}
        </Paper>
    </Grid>
);

const Settings = observer(({themeMode, setTheme}: IProps) => {
    const {t, language} = useTranslation();
    return (
        <DefaultPage
            title={t('Settings')}
            description={t('Customize appearance, language and account security.')}
            maxWidth={560}>
            <Section icon={<Palette fontSize="small" />} title={t('Appearance')}>
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2.5}}>
                    <FormControl fullWidth>
                        <InputLabel id="theme-select-label">{t('Theme')}</InputLabel>
                        <Select
                            labelId="theme-select-label"
                            className="theme-select"
                            label={t('Theme')}
                            value={themeMode}
                            onChange={(e) => setTheme(e.target.value)}>
                            <MenuItem value="light">{t('Light')}</MenuItem>
                            <MenuItem value="dark">{t('Dark')}</MenuItem>
                            <MenuItem value="system">{t('System')}</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="language-select-label">{t('Language')}</InputLabel>
                        <Select
                            labelId="language-select-label"
                            className="language-select"
                            label={t('Language')}
                            value={language}
                            onChange={(e) => {
                                if (isLanguage(e.target.value)) {
                                    setLanguage(e.target.value);
                                }
                            }}>
                            {languages.map(({key, label}) => (
                                <MenuItem key={key} value={key}>
                                    {label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Section>
            <Section icon={<Lock fontSize="small" />} title={t('Change Password')}>
                <ChangePasswordForm />
            </Section>
        </DefaultPage>
    );
});

const ChangePasswordForm = observer(() => {
    const [pass, setPass] = useState('');
    const {currentUser, elevateStore} = useStores();
    const {t} = useTranslation();
    const localAuthEnabled = config.get('localAuth');

    const submit = () => {
        currentUser.changePassword(pass);
        setPass('');
    };

    if (!localAuthEnabled) {
        return (
            <Typography sx={{color: 'text.secondary'}}>
                {t('Password login is disabled on this server.')}
            </Typography>
        );
    }

    if (!elevateStore.elevated) {
        return <ElevationForm />;
    }

    return (
        <form
            id="changepw-form"
            onSubmit={(e) => {
                e.preventDefault();
                submit();
            }}>
            <TextField
                className="newpass"
                margin="dense"
                type="password"
                label={t('New Password *')}
                value={pass}
                disabled={!localAuthEnabled}
                onChange={(e) => setPass(e.target.value)}
                fullWidth
            />
            <Tooltip title={pass.length !== 0 ? '' : t('Password is required')}>
                <div>
                    <Button
                        className="change"
                        type="submit"
                        disabled={!localAuthEnabled || pass.length === 0}
                        color="primary"
                        variant="contained"
                        sx={{mt: 1.5}}
                        fullWidth>
                        {t('Change')}
                    </Button>
                </div>
            </Tooltip>
        </form>
    );
});

export default Settings;
