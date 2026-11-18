import AppBar from '@mui/material/AppBar';
import Button, {ButtonProps} from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import {alpha, PaletteMode, Theme} from '@mui/material/styles';
import {makeStyles} from 'tss-react/mui';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Chat from '@mui/icons-material/ChatOutlined';
import DevicesOther from '@mui/icons-material/DevicesOtherOutlined';
import ExitToApp from '@mui/icons-material/LogoutOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import Apps from '@mui/icons-material/ExtensionOutlined';
import SupervisorAccount from '@mui/icons-material/SupervisorAccountOutlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import LightMode from '@mui/icons-material/LightModeOutlined';
import DarkMode from '@mui/icons-material/DarkModeOutlined';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';
import {Link, useLocation} from 'react-router';
import {useMediaQuery} from '@mui/material';
import {ThemeKey} from './theme';
import {useTranslation} from '../i18n';

const useStyles = makeStyles()((theme: Theme) => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        [theme.breakpoints.down('sm')]: {
            paddingBottom: 6,
        },
    },
    toolbar: {
        justifyContent: 'space-between',
        minHeight: 64,
        [theme.breakpoints.down('sm')]: {
            flexWrap: 'wrap',
        },
    },
    menuButtons: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        [theme.breakpoints.down('md')]: {
            flex: 1,
            justifyContent: 'flex-end',
        },
        [theme.breakpoints.down('sm')]: {
            flexBasis: '100%',
            order: 1,
            height: 48,
            justifyContent: 'space-between',
        },
    },
    title: {
        [theme.breakpoints.up('md')]: {
            flex: 1,
        },
        display: 'flex',
        alignItems: 'center',
        gap: 10,
    },
    logo: {
        width: 32,
        height: 32,
        borderRadius: 8,
    },
    titleName: {
        fontWeight: 700,
        letterSpacing: '-0.02em',
    },
    version: {
        fontSize: 12,
        fontWeight: 600,
        padding: '2px 8px',
        borderRadius: 999,
        color: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.18),
        },
    },
    link: {
        color: 'inherit',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
    },
    navButton: {
        color: theme.palette.text.secondary,
        '&:hover': {
            color: theme.palette.text.primary,
        },
    },
    navButtonActive: {
        color: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        '&:hover': {
            color: theme.palette.primary.main,
            backgroundColor: alpha(theme.palette.primary.main, 0.16),
        },
    },
    userAvatar: {
        width: 26,
        height: 26,
        fontSize: 13,
        fontWeight: 600,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },
}));

interface IProps {
    loggedIn: boolean;
    name: string;
    admin: boolean;
    version: string;
    logout: VoidFunction;
    setNavOpen: (open: boolean) => void;
    paletteMode: PaletteMode;
    setTheme: (theme: ThemeKey) => void;
}

const Header = ({
    version,
    name,
    loggedIn,
    admin,
    logout,
    setNavOpen,
    paletteMode,
    setTheme,
}: IProps) => {
    const {classes} = useStyles();
    const {t} = useTranslation();
    return (
        <AppBar position="static" className={classes.appBar}>
            <Toolbar className={classes.toolbar}>
                <div className={classes.title}>
                    <Link to="/" className={classes.link}>
                        <img src="static/favicon-196x196.png" alt="" className={classes.logo} />
                        <Typography variant="h6" className={classes.titleName} color="inherit">
                            Gotify
                        </Typography>
                    </Link>
                    <Tooltip title={t('View release on GitHub')}>
                        <a
                            href={
                                version.startsWith('master-')
                                    ? `https://github.com/gotify/server/commit/${version.replace('master-', '')}`
                                    : `https://github.com/gotify/server/releases/tag/v${version}`
                            }
                            className={classes.version}>
                            @{version}
                        </a>
                    </Tooltip>
                </div>
                {loggedIn && (
                    <Buttons
                        admin={admin}
                        name={name}
                        logout={logout}
                        setNavOpen={setNavOpen}
                        paletteMode={paletteMode}
                        setTheme={setTheme}
                    />
                )}
            </Toolbar>
        </AppBar>
    );
};

const Buttons = ({
    name,
    admin,
    logout,
    setNavOpen,
    paletteMode,
    setTheme,
}: {
    name: string;
    admin: boolean;
    logout: VoidFunction;
    setNavOpen: (open: boolean) => void;
    paletteMode: PaletteMode;
    setTheme: (theme: ThemeKey) => void;
}) => {
    const {classes, cx} = useStyles();
    const {t} = useTranslation();
    const {pathname} = useLocation();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const userDropDown = Boolean(anchorEl);
    const compact = useMediaQuery('(max-width:1000px)');

    const navClass = (path: string) =>
        cx(classes.navButton, {[classes.navButtonActive]: pathname.startsWith(path)});

    return (
        <div className={classes.menuButtons}>
            <ResponsiveButton
                sx={{display: {sm: 'none', xs: 'inline-flex'}}}
                icon={<MenuIcon />}
                onClick={() => setNavOpen(true)}
                label={t('Menu')}
                color="inherit"
            />
            {admin && (
                <Link className={classes.link} to="/users" id="navigate-users">
                    <ResponsiveButton
                        icon={<SupervisorAccount />}
                        label={t('Users')}
                        className={navClass('/users')}
                    />
                </Link>
            )}
            <Link className={classes.link} to="/applications" id="navigate-apps">
                <ResponsiveButton
                    icon={<Chat />}
                    label={t('Apps')}
                    className={navClass('/applications')}
                />
            </Link>
            <Link className={classes.link} to="/clients" id="navigate-clients">
                <ResponsiveButton
                    icon={<DevicesOther />}
                    label={t('Clients')}
                    className={navClass('/clients')}
                />
            </Link>
            <Link className={classes.link} to="/plugins" id="navigate-plugins">
                <ResponsiveButton
                    icon={<Apps />}
                    label={t('Plugins')}
                    className={navClass('/plugins')}
                />
            </Link>
            <Tooltip title={t('Toggle theme')}>
                <IconButton
                    className={classes.navButton}
                    onClick={() => setTheme(paletteMode === 'dark' ? 'light' : 'dark')}>
                    {paletteMode === 'dark' ? <LightMode /> : <DarkMode />}
                </IconButton>
            </Tooltip>
            {compact ? (
                <IconButton
                    id="user-menu-button"
                    title={name}
                    aria-controls={userDropDown ? 'user-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={userDropDown ? 'true' : undefined}
                    onClick={(e) => setAnchorEl(e.currentTarget)}>
                    <Avatar className={classes.userAvatar}>{name.charAt(0).toUpperCase()}</Avatar>
                </IconButton>
            ) : (
                <Button
                    id="user-menu-button"
                    color="inherit"
                    aria-controls={userDropDown ? 'user-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={userDropDown ? 'true' : undefined}
                    startIcon={
                        <Avatar className={classes.userAvatar}>
                            {name.charAt(0).toUpperCase()}
                        </Avatar>
                    }
                    endIcon={<KeyboardArrowDown />}
                    onClick={(e) => setAnchorEl(e.currentTarget)}>
                    {name}
                </Button>
            )}
            <Menu
                id="user-menu"
                anchorEl={anchorEl}
                open={userDropDown}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}>
                <MenuItem component={Link} to="/settings" onClick={() => setAnchorEl(null)}>
                    <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t('Settings')}</ListItemText>
                </MenuItem>
                <MenuItem
                    id="logout"
                    onClick={() => {
                        setAnchorEl(null);
                        logout();
                    }}>
                    <ListItemIcon>
                        <ExitToApp fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t('Logout')}</ListItemText>
                </MenuItem>
            </Menu>
        </div>
    );
};

const ResponsiveButton: React.FC<{
    color?: 'inherit';
    sx?: ButtonProps['sx'];
    className?: string;
    label: string;
    id?: string;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    icon: React.ReactNode;
}> = ({icon, label, ...rest}) => {
    const matches = useMediaQuery('(max-width:1000px)');
    if (matches) {
        return (
            <Tooltip title={label}>
                <IconButton {...rest} aria-label={label}>
                    {icon}
                </IconButton>
            </Tooltip>
        );
    }
    return (
        <Button startIcon={icon} {...rest}>
            {label}
        </Button>
    );
};

export default Header;
