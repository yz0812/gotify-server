import {Button, Theme, useMediaQuery, useTheme} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import {makeStyles} from 'tss-react/mui';
import Typography from '@mui/material/Typography';
import {ExpandLess, ExpandMore} from '@mui/icons-material';
import Delete from '@mui/icons-material/DeleteOutlined';
import React from 'react';
import TimeAgo from 'react-timeago';
import Container from '../common/Container';
import {Markdown} from '../common/Markdown';
import * as config from '../config';
import {IMessageExtras} from '../types';
import {contentType, RenderMode} from './extras';
import {timeAgoFormatter} from '../common/TimeAgoFormatter';
import {useTranslation} from '../i18n';

const PREVIEW_LENGTH = 500;

const useStyles = makeStyles()((theme: Theme) => ({
    header: {
        display: 'flex',
        width: '100%',
        alignItems: 'start',
        alignContent: 'center',
        paddingBottom: 12,
        gap: 14,
        wordBreak: 'break-all',
    },
    headerTitle: {
        flex: 1,
        minWidth: 0,
    },
    trash: {
        marginTop: -6,
        marginRight: -8,
        color: theme.palette.text.secondary,
        '&:hover': {
            color: theme.palette.error.main,
        },
    },
    wrapperPadding: {
        marginBottom: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
            marginBottom: theme.spacing(1),
        },
    },
    messageContentWrapper: {
        minWidth: 200,
        width: '100%',
    },
    image: {
        width: 44,
        height: 44,
        borderRadius: 10,
        objectFit: 'cover',
        [theme.breakpoints.down('md')]: {
            width: 30,
            height: 30,
            borderRadius: 8,
        },
    },
    appName: {
        fontSize: 12,
        fontWeight: 500,
        color: theme.palette.text.secondary,
    },
    date: {
        fontSize: 13,
        color: theme.palette.text.secondary,
        whiteSpace: 'nowrap',
        paddingTop: 2,
        [theme.breakpoints.down('md')]: {
            order: 1,
            flexBasis: '100%',
            opacity: 0.7,
        },
    },
    imageWrapper: {
        width: 44,
        height: 44,
        flexShrink: 0,
    },
    plainContent: {
        whiteSpace: 'pre-wrap',
    },
    content: {
        maxHeight: PREVIEW_LENGTH,
        wordBreak: 'break-all',
        overflowY: 'hidden',
        '&.expanded': {
            maxHeight: 'none',
        },
        '& p': {
            margin: 0,
            wordBreak: 'break-word',
        },
        lineHeight: 1.6,
        '& a': {
            color: theme.palette.primary.main,
        },
        '& code': {
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
            fontSize: '0.875em',
        },
        '& pre': {
            overflow: 'auto',
            borderRadius: 8,
            backgroundColor:
                theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            padding: theme.spacing(1),
        },
        '& img': {
            maxWidth: '100%',
        },
    },
}));

interface IProps {
    title: string;
    image?: string;
    date: string;
    content: string;
    priority: number;
    appName: string;
    fDelete: VoidFunction;
    extras?: IMessageExtras;
    expanded: boolean;
    onExpand: (expand: boolean) => void;
}

const priorityColor = (priority: number) => {
    if (priority >= 4 && priority <= 7) {
        return '#f59e0b';
    } else if (priority > 7) {
        return '#ef4444';
    } else {
        return 'transparent';
    }
};

const Message = ({
    fDelete,
    title,
    date,
    image,
    priority,
    content,
    extras,
    appName,
    onExpand,
    expanded: initialExpanded,
}: IProps) => {
    const theme = useTheme();
    const contentRef = React.useRef<HTMLDivElement | null>(null);
    const {classes} = useStyles();
    const {t} = useTranslation();
    const [expanded, setExpanded] = React.useState(initialExpanded);
    const [isOverflowing, setOverflowing] = React.useState(false);
    const smallHeader = useMediaQuery(theme.breakpoints.down('md'));

    const refreshOverflowing = React.useCallback(() => {
        const ref = contentRef.current;
        if (!ref) {
            return;
        }
        setOverflowing((overflowing) => overflowing || ref.scrollHeight > ref.clientHeight);
    }, [contentRef, setOverflowing]);

    const onContentRef = React.useCallback(
        (ref: HTMLDivElement | null) => {
            contentRef.current = ref;
            refreshOverflowing();
        },
        [contentRef, refreshOverflowing]
    );

    React.useEffect(() => void onExpand(expanded), [expanded]);

    const togglePreviewHeight = () => setExpanded((b) => !b);

    const renderContent = () => {
        switch (contentType(extras)) {
            case RenderMode.Markdown:
                return <Markdown onImageLoaded={refreshOverflowing}>{content}</Markdown>;
            case RenderMode.Plain:
            default:
                return <span className={classes.plainContent}>{content}</span>;
        }
    };
    return (
        <div className={`${classes.wrapperPadding} message`}>
            <Container
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    boxShadow: `inset 4px 0 0 ${priorityColor(priority)}`,
                }}>
                {smallHeader ? (
                    <HeaderSmall
                        fDelete={fDelete}
                        title={title}
                        appName={appName}
                        image={image}
                        date={date}
                    />
                ) : (
                    <HeaderWide
                        fDelete={fDelete}
                        title={title}
                        appName={appName}
                        image={image}
                        date={date}
                    />
                )}

                <div className={classes.messageContentWrapper}>
                    <Typography
                        component="div"
                        ref={onContentRef}
                        className={`${classes.content} content ${
                            isOverflowing && expanded ? 'expanded' : ''
                        }`}>
                        {renderContent()}
                    </Typography>
                </div>
                {isOverflowing && (
                    <Button
                        style={{marginTop: 12}}
                        onClick={togglePreviewHeight}
                        variant="text"
                        color="primary"
                        fullWidth={true}
                        startIcon={expanded ? <ExpandLess /> : <ExpandMore />}>
                        {expanded ? t('Read Less') : t('Read More')}
                    </Button>
                )}
            </Container>
        </div>
    );
};

const HeaderWide = ({
    appName,
    image,
    date,
    fDelete,
    title,
}: Pick<IProps, 'appName' | 'image' | 'fDelete' | 'date' | 'title'>) => {
    const {classes} = useStyles();
    // re-render on language change so the relative date is localized
    useTranslation();

    return (
        <div className={classes.header}>
            <div className={classes.imageWrapper}>
                {image !== null ? (
                    <img
                        src={config.get('url') + image}
                        alt={`${appName} logo`}
                        width="44"
                        height="44"
                        className={classes.image}
                    />
                ) : null}
            </div>
            <div className={classes.headerTitle}>
                <Typography
                    className="title"
                    variant="h6"
                    sx={{lineHeight: 1.3, fontSize: '1.1rem'}}>
                    {title}
                </Typography>
                <Typography variant="subtitle1" className={classes.appName}>
                    {appName}
                </Typography>
            </div>
            <Typography variant="body1" className={classes.date}>
                <TimeAgo date={date} formatter={timeAgoFormatter('narrow')} />
            </Typography>
            <IconButton onClick={fDelete} className={`${classes.trash} delete`} size="small">
                <Delete fontSize="small" />
            </IconButton>
        </div>
    );
};
const HeaderSmall = ({
    appName,
    image,
    date,
    fDelete,
    title,
}: Pick<IProps, 'appName' | 'image' | 'fDelete' | 'date' | 'title'>) => {
    const {classes} = useStyles();
    // re-render on language change so the relative date is localized
    useTranslation();

    return (
        <div className={classes.header}>
            <div className={classes.headerTitle}>
                <Typography
                    className="title"
                    variant="h6"
                    sx={{lineHeight: 1.3, fontSize: '1.1rem'}}>
                    {title}
                </Typography>
                <Typography variant="subtitle1" className={classes.appName}>
                    {appName}
                </Typography>
                <Typography variant="body1" className={classes.date}>
                    <TimeAgo date={date} formatter={timeAgoFormatter('long')} />
                </Typography>
            </div>
            <div style={{display: 'flex', alignItems: 'end', flexDirection: 'column'}}>
                <IconButton onClick={fDelete} className={`${classes.trash} delete`} size="small">
                    <Delete fontSize="small" />
                </IconButton>
                <div style={{width: 30, height: 30}}>
                    {image !== null ? (
                        <img
                            src={config.get('url') + image}
                            alt={`${appName} logo`}
                            className={classes.image}
                        />
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default Message;
