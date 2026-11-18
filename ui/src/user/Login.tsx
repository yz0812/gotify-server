import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import React from 'react';
import Container from '../common/Container';
import DefaultPage from '../common/DefaultPage';
import * as config from '../config';
import RegistrationDialog from './Register';
import {useStores} from '../stores';
import {observer} from 'mobx-react-lite';
import {useNavigate, useSearchParams} from 'react-router';
import {useTranslation} from '../i18n';

const Login = observer(() => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [registerDialog, setRegisterDialog] = React.useState(false);
    const {currentUser} = useStores();
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const localAuthEnabled = config.get('localAuth');
    const oidcEnabled = config.get('oidc');
    const oidcIdpName = config.get('oidcIdpName');

    const oidcAutoRedirect =
        oidcEnabled &&
        config.get('oidcAutoRedirect') &&
        searchParams.get('redirect') !== 'false' &&
        !currentUser.connectionErrorMessage;
    const oidcLoginUrl =
        config.get('url') +
        'auth/oidc/login?name=' +
        encodeURIComponent(currentUser.createClientName());
    React.useEffect(() => {
        if (currentUser.loggedIn) {
            navigate('/');
            return;
        }
        if (!currentUser.authenticating && oidcAutoRedirect) {
            window.location.href = oidcLoginUrl;
        }
    }, [currentUser.loggedIn, currentUser.authenticating, oidcAutoRedirect]);

    const registerButton = () => {
        if (localAuthEnabled && config.get('register'))
            return (
                <Button
                    id="register"
                    variant="outlined"
                    color="primary"
                    onClick={() => setRegisterDialog(true)}>
                    {t('Register')}
                </Button>
            );
        else return null;
    };
    const login = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        currentUser.login(username, password);
    };
    return (
        <DefaultPage
            title={t('Login')}
            description={t('Sign in to your Gotify server')}
            rightControl={registerButton()}
            maxWidth={400}>
            <Grid size={{xs: 12}} style={{textAlign: 'center'}}>
                <Container style={{padding: 28}}>
                    <img
                        src="static/favicon-196x196.png"
                        alt=""
                        width={56}
                        height={56}
                        style={{borderRadius: 14, marginBottom: 8}}
                    />
                    {localAuthEnabled && (
                        <form onSubmit={(e) => e.preventDefault()} id="login-form">
                            <TextField
                                autoFocus
                                id="username"
                                className="name"
                                label={t('Username')}
                                fullWidth
                                name="username"
                                margin="dense"
                                autoComplete="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <TextField
                                id="password"
                                type="password"
                                className="password"
                                label={t('Password')}
                                fullWidth
                                name="password"
                                margin="normal"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                className="login"
                                color="primary"
                                disabled={
                                    !!currentUser.connectionErrorMessage ||
                                    currentUser.authenticating
                                }
                                style={{marginTop: 12}}
                                fullWidth
                                loading={currentUser.authenticating}
                                onClick={login}>
                                {t('Login')}
                            </Button>
                        </form>
                    )}
                    {oidcEnabled && (
                        <>
                            {localAuthEnabled && (
                                <Divider style={{marginTop: 20, marginBottom: 20}}>
                                    {t('or')}
                                </Divider>
                            )}
                            <Button
                                id="oidc-login"
                                component="a"
                                href={oidcLoginUrl}
                                variant="outlined"
                                size="large"
                                color="primary"
                                fullWidth
                                style={{marginTop: localAuthEnabled ? 0 : 12}}>
                                {t('Login with {name}', {name: oidcIdpName})}
                            </Button>
                        </>
                    )}
                </Container>
            </Grid>
            {registerDialog && (
                <RegistrationDialog
                    fClose={() => setRegisterDialog(false)}
                    fOnSubmit={currentUser.register}
                />
            )}
        </DefaultPage>
    );
});

export default Login;
