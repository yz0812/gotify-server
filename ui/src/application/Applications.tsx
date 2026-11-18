import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import Key from '@mui/icons-material/KeyOutlined';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Delete from '@mui/icons-material/DeleteOutlined';
import Edit from '@mui/icons-material/EditOutlined';
import CloudUpload from '@mui/icons-material/CloudUploadOutlined';
import DragIndicator from '@mui/icons-material/DragIndicator';
import Add from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {SortableContext, useSortable, verticalListSortingStrategy} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

import ConfirmDialog from '../common/ConfirmDialog';
import DefaultPage from '../common/DefaultPage';
import {AddApplicationDialog} from './AddApplicationDialog';
import * as config from '../config';
import {UpdateApplicationDialog} from './UpdateApplicationDialog';
import {IApplication} from '../types';
import {LastUsedCell} from '../common/LastUsedCell';
import {formatDate} from '../common/TimeAgoFormatter';
import {useStores} from '../stores';
import {observer} from 'mobx-react-lite';
import {makeStyles} from 'tss-react/mui';
import {ButtonBase, Chip, Tooltip, Typography} from '@mui/material';
import {TokenConfirmDialog} from '../common/TokenConfirmDialog';
import {useTranslation} from '../i18n';

const useStyles = makeStyles()((theme) => ({
    imageContainer: {
        borderRadius: 8,
        overflow: 'hidden',
        '& img': {
            display: 'block',
            objectFit: 'cover',
        },
        '&::after': {
            content: '"×"',
            position: 'absolute',
            top: 0,
            left: 0,
            width: 40,
            height: 40,
            background: theme.palette.error.main,
            color: theme.palette.getContrastText(theme.palette.error.main),
            fontSize: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 120ms ease',
        },
        '&:hover::after': {opacity: 1},
    },
}));

const Applications = observer(() => {
    const {appStore} = useStores();
    const {t} = useTranslation();
    const apps = appStore.getItems();
    const [toDeleteApp, setToDeleteApp] = useState<IApplication>();
    const [toDeleteImage, setToDeleteImage] = useState<IApplication>();
    const [toUpdateApp, setToUpdateApp] = useState<IApplication>();
    const [toRegenerateTokenApp, setToRegenerateTokenApp] = useState<IApplication>();
    const [toShowToken, setToShowToken] = useState<string>('');
    const [createDialog, setCreateDialog] = useState<boolean>(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const uploadId = useRef(-1);

    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

    useEffect(() => void appStore.refresh(), []);

    const validExtensions = ['.gif', '.png', '.jpg', '.jpeg'];

    const handleImageUploadClick = (id: number) => {
        uploadId.current = id;
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const onUploadImage = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }
        appStore.uploadImage(uploadId.current, file);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;

        if (over && active.id !== over.id) {
            appStore.reorder(active.id as number, over.id as number);
        }
    };

    return (
        <DefaultPage
            title={t('Applications')}
            description={t('Applications can send messages to Gotify.')}
            rightControl={
                <Button
                    id="create-app"
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => {
                        setCreateDialog(true);
                    }}>
                    {t('Create Application')}
                </Button>
            }
            maxWidth={1100}>
            <Grid size={12}>
                <Paper elevation={1} style={{overflowX: 'auto'}}>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}>
                        <Table id="app-table">
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="none" style={{width: 0}} />
                                    <TableCell padding="checkbox" style={{width: 80}} />
                                    <TableCell>{t('Name')}</TableCell>
                                    <TableCell>{t('Description')}</TableCell>
                                    <TableCell>{t('Priority')}</TableCell>
                                    <TableCell>{t('Last Used')}</TableCell>
                                    <TableCell>{t('Created')}</TableCell>
                                    <TableCell />
                                    <TableCell />
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <SortableContext items={apps} strategy={verticalListSortingStrategy}>
                                <TableBody>
                                    {apps.map((app: IApplication) => (
                                        <Row
                                            key={app.id}
                                            app={app}
                                            fRegenerateToken={() => setToRegenerateTokenApp(app)}
                                            fUpload={() => handleImageUploadClick(app.id)}
                                            fDeleteImage={() => setToDeleteImage(app)}
                                            fDelete={() => setToDeleteApp(app)}
                                            fEdit={() => setToUpdateApp(app)}
                                        />
                                    ))}
                                </TableBody>
                            </SortableContext>
                        </Table>
                    </DndContext>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={validExtensions.join(',')}
                        style={{display: 'none'}}
                        onChange={onUploadImage}
                    />
                </Paper>
            </Grid>
            {toShowToken && (
                <TokenConfirmDialog token={toShowToken} fClose={() => setToShowToken('')} />
            )}
            {createDialog && (
                <AddApplicationDialog
                    fClose={(token) => {
                        setCreateDialog(false);
                        setToShowToken(token ?? '');
                    }}
                    fOnSubmit={appStore.create}
                />
            )}
            {toUpdateApp != null && (
                <UpdateApplicationDialog
                    fClose={() => setToUpdateApp(undefined)}
                    fOnSubmit={(name, description, defaultPriority) =>
                        appStore.update({...toUpdateApp, name, description, defaultPriority})
                    }
                    initialDescription={toUpdateApp?.description}
                    initialName={toUpdateApp?.name}
                    initialDefaultPriority={toUpdateApp?.defaultPriority}
                />
            )}
            {toRegenerateTokenApp != null && (
                <ConfirmDialog
                    title={t('Confirm Token Regeneration')}
                    text={t('Regenerate token for {name}? The current token will be invalidated.', {
                        name: toRegenerateTokenApp.name,
                    })}
                    fClose={() => setToRegenerateTokenApp(undefined)}
                    fOnSubmit={() =>
                        appStore.regenerateToken(toRegenerateTokenApp.id).then((token) => {
                            setToShowToken(token);
                        })
                    }
                    requireElevated
                />
            )}
            {toDeleteApp != null && (
                <ConfirmDialog
                    title={t('Confirm Delete')}
                    text={t('Delete {name}?', {name: toDeleteApp.name})}
                    fClose={() => setToDeleteApp(undefined)}
                    fOnSubmit={() => appStore.remove(toDeleteApp.id)}
                    requireElevated
                />
            )}
            {toDeleteImage != null && (
                <ConfirmDialog
                    title={t('Confirm Delete Image')}
                    text={t('Delete image for {name}?', {name: toDeleteImage.name})}
                    fClose={() => setToDeleteImage(undefined)}
                    fOnSubmit={() => appStore.deleteImage(toDeleteImage.id)}
                />
            )}
        </DefaultPage>
    );
});

interface IRowProps {
    app: IApplication;
    fRegenerateToken: VoidFunction;
    fUpload: VoidFunction;
    fDeleteImage: VoidFunction;
    fDelete: VoidFunction;
    fEdit: VoidFunction;
}

const Row = ({app, fRegenerateToken, fDelete, fUpload, fDeleteImage, fEdit}: IRowProps) => {
    const {classes, theme} = useStyles();
    const {t} = useTranslation();
    const isDefaultImage = app.image === 'static/defaultapp.png';

    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
        id: app.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
        backgroundColor: isDragging ? theme.palette.action.hover : 'transparent',
    };

    return (
        <TableRow ref={setNodeRef} style={style} hover>
            <TableCell padding="none" style={{paddingLeft: 8}}>
                <Tooltip title={t('Drag to reorder')} placement="left">
                    <div
                        {...attributes}
                        {...listeners}
                        style={{
                            cursor: 'grab',
                            display: 'flex',
                            alignItems: 'center',
                            touchAction: 'none',
                            color: theme.palette.text.disabled,
                        }}>
                        <DragIndicator fontSize="small" />
                    </div>
                </Tooltip>
            </TableCell>
            <TableCell padding="normal">
                <div style={{display: 'flex', alignItems: 'center', gap: 4}}>
                    <Tooltip title={isDefaultImage ? '' : t('Delete image')} placement="top" arrow>
                        <ButtonBase
                            className={classes.imageContainer}
                            onClick={fDeleteImage}
                            disabled={isDefaultImage}>
                            <img
                                src={config.get('url') + app.image}
                                alt="app logo"
                                width="40"
                                height="40"
                            />
                        </ButtonBase>
                    </Tooltip>
                    <Tooltip title={t('Upload image')}>
                        <IconButton onClick={fUpload} size="small">
                            <CloudUpload fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </div>
            </TableCell>
            <TableCell>
                <Typography variant="body2" sx={{fontWeight: 600}} component="span">
                    {app.name}
                </Typography>
            </TableCell>
            <TableCell sx={{color: 'text.secondary', maxWidth: 280}}>{app.description}</TableCell>
            <TableCell>
                <Chip label={app.defaultPriority} size="small" variant="outlined" />
            </TableCell>
            <TableCell>
                <LastUsedCell lastUsed={app.lastUsed} />
            </TableCell>
            <TableCell title={app.createdAt} sx={{whiteSpace: 'nowrap'}}>
                {formatDate(app.createdAt)}
            </TableCell>
            <TableCell align="right" padding="none">
                <Tooltip title={t('Regenerate token')}>
                    <IconButton onClick={fRegenerateToken} className="regenerate-token">
                        <Key fontSize="small" />
                    </IconButton>
                </Tooltip>
            </TableCell>
            <TableCell align="right" padding="none">
                <Tooltip title={t('Edit')}>
                    <IconButton onClick={fEdit} className="edit">
                        <Edit fontSize="small" />
                    </IconButton>
                </Tooltip>
            </TableCell>
            <TableCell align="right" padding="none" style={{paddingRight: 8}}>
                <Tooltip title={app.internal ? '' : t('Delete')}>
                    <span>
                        <IconButton
                            onClick={fDelete}
                            className="delete"
                            disabled={app.internal}
                            color="error">
                            <Delete fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>
            </TableCell>
        </TableRow>
    );
};

export default Applications;
