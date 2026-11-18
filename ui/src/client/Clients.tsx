import React, {useEffect, useState} from 'react';
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
import Security from '@mui/icons-material/SecurityOutlined';
import Add from '@mui/icons-material/Add';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import ConfirmDialog from '../common/ConfirmDialog';
import DefaultPage from '../common/DefaultPage';
import AddClientDialog from './AddClientDialog';
import UpdateClientDialog from './UpdateClientDialog';
import ElevateClientDialog from './ElevateClientDialog';
import {IClient} from '../types';
import {LastUsedCell} from '../common/LastUsedCell';
import {formatDate} from '../common/TimeAgoFormatter';
import {RemainingTime} from '../common/RemainingTime';
import {observer} from 'mobx-react-lite';
import {useStores} from '../stores';
import {TokenConfirmDialog} from '../common/TokenConfirmDialog';
import {useTranslation} from '../i18n';

const Clients = observer(() => {
    const {clientStore, currentUser} = useStores();
    const {t} = useTranslation();
    const [toDeleteClient, setToDeleteClient] = useState<IClient>();
    const [toUpdateClient, setToUpdateClient] = useState<IClient>();
    const [toElevateClient, setToElevateClient] = useState<IClient>();
    const [createDialog, setCreateDialog] = useState<boolean>(false);
    const [toShowToken, setToShowToken] = useState<string>('');
    const clients = clientStore.getItems();

    useEffect(() => void clientStore.refresh(), []);

    return (
        <DefaultPage
            title={t('Clients')}
            description={t('Clients can receive messages and manage Gotify.')}
            maxWidth={1100}
            rightControl={
                <Button
                    id="create-client"
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => setCreateDialog(true)}>
                    {t('Create Client')}
                </Button>
            }>
            <Grid size={12}>
                <Paper elevation={1} style={{overflowX: 'auto'}}>
                    <Table id="client-table">
                        <TableHead>
                            <TableRow style={{textAlign: 'center'}}>
                                <TableCell>{t('Name')}</TableCell>
                                <TableCell align="right">{t('Elevation ends')}</TableCell>
                                <TableCell align="right">{t('Expires in')}</TableCell>
                                <TableCell>{t('Last Used')}</TableCell>
                                <TableCell>{t('Created')}</TableCell>
                                <TableCell />
                                <TableCell />
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {clients.map((client: IClient) => (
                                <Row
                                    key={client.id}
                                    name={client.name}
                                    createdAt={client.createdAt}
                                    lastUsed={client.lastUsed}
                                    elevatedUntil={client.elevatedUntil}
                                    expiresAt={client.expiresAt}
                                    current={client.id === currentUser.user.clientId}
                                    fEdit={() => setToUpdateClient(client)}
                                    fDelete={() => setToDeleteClient(client)}
                                    fElevate={() => setToElevateClient(client)}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Grid>
            {toShowToken && (
                <TokenConfirmDialog token={toShowToken} fClose={() => setToShowToken('')} />
            )}
            {createDialog && (
                <AddClientDialog
                    fClose={(token) => {
                        setCreateDialog(false);
                        setToShowToken(token ?? '');
                    }}
                    fOnSubmit={clientStore.create}
                />
            )}
            {toUpdateClient != null && (
                <UpdateClientDialog
                    fClose={() => setToUpdateClient(undefined)}
                    fOnSubmit={(name, expiresAfterInactivitySeconds) =>
                        clientStore.update(toUpdateClient.id, name, expiresAfterInactivitySeconds)
                    }
                    initialName={toUpdateClient.name}
                    initialExpiresAfterInactivitySeconds={
                        toUpdateClient.expiresAfterInactivitySeconds
                    }
                />
            )}
            {toDeleteClient != null && (
                <ConfirmDialog
                    title={t('Confirm Delete')}
                    text={t('Delete {name}?', {name: toDeleteClient.name})}
                    fClose={() => setToDeleteClient(undefined)}
                    fOnSubmit={() => clientStore.remove(toDeleteClient.id)}
                    requireElevated
                />
            )}
            {toElevateClient != null && (
                <ElevateClientDialog
                    clientName={toElevateClient.name}
                    clientId={toElevateClient.id}
                    fClose={() => setToElevateClient(undefined)}
                />
            )}
        </DefaultPage>
    );
});

interface IRowProps {
    name: string;
    createdAt: string;
    lastUsed: string | null;
    elevatedUntil?: string;
    expiresAt: string | null;
    current: boolean;
    fEdit: VoidFunction;
    fDelete: VoidFunction;
    fElevate: VoidFunction;
}

const Row = ({
    name,
    createdAt,
    lastUsed,
    elevatedUntil,
    expiresAt,
    current,
    fEdit,
    fDelete,
    fElevate,
}: IRowProps) => {
    const {t} = useTranslation();
    return (
        <TableRow hover selected={current} aria-current={current ? 'true' : undefined}>
            <TableCell>
                <span className="name" style={{fontWeight: 600}}>
                    {name}
                </span>{' '}
                {current ? (
                    <Chip
                        label={t('current')}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ml: 1, height: 20, verticalAlign: 'middle'}}
                    />
                ) : (
                    ''
                )}
            </TableCell>
            <TableCell align="right" title={elevatedUntil}>
                <RemainingTime
                    until={
                        elevatedUntil && Date.parse(elevatedUntil) > Date.now()
                            ? elevatedUntil
                            : undefined
                    }
                />
            </TableCell>
            <TableCell align="right" className="expires-in" title={expiresAt ?? undefined}>
                <RemainingTime until={expiresAt} />
            </TableCell>
            <TableCell>
                <LastUsedCell lastUsed={lastUsed} />
            </TableCell>
            <TableCell title={createdAt} sx={{whiteSpace: 'nowrap'}}>
                {formatDate(createdAt)}
            </TableCell>
            <TableCell align="right" padding="none">
                <Tooltip title={t('Elevate')}>
                    <IconButton onClick={fElevate} className="elevate">
                        <Security fontSize="small" />
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
                <Tooltip title={t('Delete')}>
                    <IconButton onClick={fDelete} className="delete" color="error">
                        <Delete fontSize="small" />
                    </IconButton>
                </Tooltip>
            </TableCell>
        </TableRow>
    );
};

export default Clients;
