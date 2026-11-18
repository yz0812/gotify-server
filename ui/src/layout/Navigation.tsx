import Divider from '@mui/material/Divider';
import Drawer, {DrawerProps} from '@mui/material/Drawer';
import {Theme} from '@mui/material/styles';
import React from 'react';
import {Link, useLocation} from 'react-router';
import {observer} from 'mobx-react-lite';
import {mayAllowPermission, requestPermission} from '../snack/browserNotification';
import {
    Box,
    Button,
    IconButton,
    Typography,
    ListItemText,
    ListItemAvatar,
    ListItemIcon,
    Avatar,
    ListItemButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Inbox from '@mui/icons-material/InboxOutlined';
import NotificationsActive from '@mui/icons-material/NotificationsActiveOutlined';
import {makeStyles} from 'tss-react/mui';
import {useStores} from '../stores';
import {useTranslation} from '../i18n';

const drawerWidth = 260;

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        height: '100%',
    },
    drawerPaper: {
        position: 'relative',
        width: drawerWidth,
        height: '100%',
        padding: theme.spacing(0, 1.5),
    },
    link: {
        color: 'inherit',
        textDecoration: 'none',
        display: 'block',
        marginBottom: 2,
    },
    sectionTitle: {
        display: 'block',
        padding: theme.spacing(2, 1.5, 1),
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: theme.palette.text.secondary,
    },
    appAvatar: {
        width: 28,
        height: 28,
        borderRadius: 6,
    },
    itemText: {
        '& .MuiListItemText-primary': {
            fontSize: 14,
            fontWeight: 500,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        },
    },
}));

interface IProps {
    loggedIn: boolean;
    navOpen: boolean;
    setNavOpen: (open: boolean) => void;
}

const Navigation = observer(({loggedIn, navOpen, setNavOpen}: IProps) => {
    const [showRequestNotification, setShowRequestNotification] =
        React.useState(mayAllowPermission);
    const {classes} = useStyles();
    const {t} = useTranslation();
    const {pathname} = useLocation();
    const {appStore} = useStores();
    const apps = appStore.getItems();

    const userApps =
        apps.length === 0
            ? null
            : apps.map((app) => (
                  <Link
                      onClick={() => setNavOpen(false)}
                      className={`${classes.link} item`}
                      to={'/messages/' + app.id}
                      key={app.id}>
                      <ListItemButton selected={pathname === '/messages/' + app.id}>
                          <ListItemAvatar style={{minWidth: 40}}>
                              <Avatar
                                  className={classes.appAvatar}
                                  src={app.image}
                                  variant="rounded"
                              />
                          </ListItemAvatar>
                          <ListItemText primary={app.name} className={classes.itemText} />
                      </ListItemButton>
                  </Link>
              ));

    const placeholderItems = [
        <ListItemButton disabled key={-1}>
            <ListItemText primary={t('Some Server')} className={classes.itemText} />
        </ListItemButton>,
        <ListItemButton disabled key={-2}>
            <ListItemText primary={t('A Raspberry PI')} className={classes.itemText} />
        </ListItemButton>,
    ];

    return (
        <ResponsiveDrawer
            classes={{root: classes.root, paper: classes.drawerPaper}}
            navOpen={navOpen}
            setNavOpen={setNavOpen}
            id="message-navigation">
            <Box sx={{height: 12}} />
            <Link className={classes.link} to="/" onClick={() => setNavOpen(false)}>
                <ListItemButton disabled={!loggedIn} className="all" selected={pathname === '/'}>
                    <ListItemIcon style={{minWidth: 40}}>
                        <Inbox />
                    </ListItemIcon>
                    <ListItemText primary={t('All Messages')} className={classes.itemText} />
                </ListItemButton>
            </Link>
            <Typography component="span" className={classes.sectionTitle}>
                {t('Applications')}
            </Typography>
            <div>{loggedIn ? userApps : placeholderItems}</div>
            {showRequestNotification ? (
                <>
                    <Divider sx={{my: 1.5}} />
                    <Box sx={{px: 0.5, pb: 2}}>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<NotificationsActive />}
                            onClick={() => {
                                requestPermission();
                                setShowRequestNotification(false);
                            }}>
                            {t('Enable Notifications')}
                        </Button>
                    </Box>
                </>
            ) : null}
        </ResponsiveDrawer>
    );
});

const ResponsiveDrawer: React.FC<
    DrawerProps & {navOpen: boolean; setNavOpen: (open: boolean) => void}
> = ({navOpen, setNavOpen, children, ...rest}) => {
    const {t} = useTranslation();
    return (
        <>
            <Drawer
                sx={{display: {sm: 'none', xs: 'block'}}}
                variant="temporary"
                open={navOpen}
                onClose={() => setNavOpen(false)}
                {...rest}>
                <Box sx={{display: 'flex', justifyContent: 'flex-end', pt: 1}}>
                    <IconButton
                        onClick={() => setNavOpen(false)}
                        aria-label={t('Close navigation')}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                {children}
            </Drawer>
            <Drawer sx={{display: {xs: 'none', sm: 'block'}}} variant="permanent" {...rest}>
                {children}
            </Drawer>
        </>
    );
};

export default Navigation;
