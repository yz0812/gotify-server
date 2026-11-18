import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React from 'react';
import {useParams} from 'react-router';
import DefaultPage from '../common/DefaultPage';
import Button from '@mui/material/Button';
import Message from './Message';
import {observer} from 'mobx-react-lite';
import {IMessage} from '../types';
import ConfirmDialog from '../common/ConfirmDialog';
import LoadingSpinner from '../common/LoadingSpinner';
import {useStores} from '../stores';
import {Virtuoso} from 'react-virtuoso';
import {PushMessageDialog} from './PushMessageDialog';
import {enqueueSnackbar} from 'notistack';
import Send from '@mui/icons-material/Send';
import Refresh from '@mui/icons-material/Refresh';
import DeleteSweep from '@mui/icons-material/DeleteSweepOutlined';
import Inbox from '@mui/icons-material/InboxOutlined';
import Box from '@mui/material/Box';
import {useTranslation} from '../i18n';
import {useScrollContainer} from '../common/ScrollContainer';

const UndoAutoHideMs = 5000;

const Messages = observer(() => {
    const {id} = useParams<{id: string}>();
    const appId = id == null ? -1 : parseInt(id as string, 10);

    const [deleteAll, setDeleteAll] = React.useState(false);
    const [pushMessageOpen, setPushMessageOpen] = React.useState(false);
    const [isLoadingMore, setLoadingMore] = React.useState(false);
    const {messagesStore, appStore} = useStores();
    const {t} = useTranslation();
    const scrollContainer = useScrollContainer();
    const messages = messagesStore.get(appId);
    const hasMore = messagesStore.canLoadMore(appId);
    const name = appStore.getName(appId);
    const hasMessages = messages.length !== 0;
    const expandedState = React.useRef<Record<number, boolean>>({});
    const app = appId === -1 ? undefined : appStore.getByIDOrUndefined(appId);

    const deleteMessage = (message: IMessage) => {
        const key = enqueueSnackbar({
            message: t('Message deleted'),
            variant: 'info',
            action: () => (
                <Button
                    color="inherit"
                    size="small"
                    onClick={() => messagesStore.cancelPendingDelete(message)}>
                    {t('Undo')}
                </Button>
            ),
            disableWindowBlurListener: true,
            transitionDuration: {enter: 0, exit: 0},
            autoHideDuration: UndoAutoHideMs,
            onExited: () => messagesStore.removeSingle(message),
        });
        messagesStore.addPendingDelete({message, key});
    };

    React.useEffect(() => {
        if (!messagesStore.loaded(appId)) {
            messagesStore.loadMore(appId);
        }
    }, [appId]);

    const renderMessage = (_index: number, message: IMessage) => (
        <Message
            key={message.id}
            fDelete={() => deleteMessage(message)}
            onExpand={(expanded) => (expandedState.current[message.id] = expanded)}
            title={message.title}
            date={message.date}
            appName={appStore.getName(message.appid)}
            expanded={expandedState.current[message.id] ?? false}
            content={message.message}
            image={message.image}
            extras={message.extras}
            priority={message.priority}
        />
    );

    const checkIfLoadMore = () => {
        if (!isLoadingMore && messagesStore.canLoadMore(appId)) {
            setLoadingMore(true);
            messagesStore.loadMore(appId).then(() => setLoadingMore(false));
        }
    };

    const messageFooter = () => {
        if (hasMore) {
            return <LoadingSpinner />;
        }
        if (hasMessages) {
            return label(t("You've reached the end"));
        }
        return null;
    };

    const renderMessages = () => (
        <Virtuoso
            id="messages"
            style={{width: '100%'}}
            customScrollParent={scrollContainer ?? undefined}
            totalCount={messages.length}
            endReached={checkIfLoadMore}
            data={messages}
            itemContent={renderMessage}
            components={{
                Footer: messageFooter,
                EmptyPlaceholder: () => (
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 8,
                            color: 'text.secondary',
                            border: 1,
                            borderColor: 'divider',
                            borderStyle: 'dashed',
                            borderRadius: 3,
                        }}>
                        <Inbox sx={{fontSize: 48, opacity: 0.5}} />
                        <Typography variant="body2" component="div">
                            {t('No messages')}
                        </Typography>
                    </Box>
                ),
            }}
        />
    );
    const label = (text: string) => (
        <Grid size={{xs: 12}}>
            <Typography
                variant="caption"
                component="div"
                sx={{py: 2, color: 'text.secondary'}}
                align="center">
                {text}
            </Typography>
        </Grid>
    );
    return (
        <DefaultPage
            title={name}
            rightControl={
                <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                    {app && (
                        <Button
                            id="push-message"
                            variant="contained"
                            color="primary"
                            startIcon={<Send />}
                            onClick={() => setPushMessageOpen(true)}>
                            {t('Push Message')}
                        </Button>
                    )}
                    <Button
                        id="refresh-all"
                        variant="outlined"
                        color="primary"
                        startIcon={<Refresh />}
                        onClick={() => messagesStore.refreshByApp(appId)}>
                        {t('Refresh')}
                    </Button>
                    <Button
                        id="delete-all"
                        variant="outlined"
                        disabled={!hasMessages}
                        color="error"
                        startIcon={<DeleteSweep />}
                        onClick={() => {
                            setDeleteAll(true);
                        }}>
                        {t('Delete All')}
                    </Button>
                </Box>
            }>
            {!messagesStore.loaded(appId) || !scrollContainer ? (
                <LoadingSpinner />
            ) : (
                renderMessages()
            )}

            {deleteAll && (
                <ConfirmDialog
                    title={t('Confirm Delete')}
                    text={t('Delete all messages?')}
                    fClose={() => setDeleteAll(false)}
                    fOnSubmit={() => messagesStore.removeByApp(appId)}
                />
            )}
            {pushMessageOpen && app && (
                <PushMessageDialog
                    appName={app.name}
                    defaultPriority={app.defaultPriority}
                    fClose={() => setPushMessageOpen(false)}
                    fOnSubmit={(message, title, priority) =>
                        messagesStore.sendMessage(app.id, message, title, priority)
                    }
                />
            )}
        </DefaultPage>
    );
});

export default Messages;
