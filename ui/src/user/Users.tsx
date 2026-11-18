import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import Delete from '@mui/icons-material/DeleteOutlined';
import Edit from '@mui/icons-material/EditOutlined';
import Add from '@mui/icons-material/Add';
import React from 'react';
import ConfirmDialog from '../common/ConfirmDialog';
import DefaultPage from '../common/DefaultPage';
import Button from '@mui/material/Button';
import AddEditDialog from './AddEditUserDialog';
import {IUser} from '../types';
import {useStores} from '../stores';
import {observer} from 'mobx-react-lite';
import {formatDate} from '../common/TimeAgoFormatter';
import {useTranslation} from '../i18n';

interface IRowProps {
    name: string;
    admin: boolean;
    createdAt: string;
    fDelete: VoidFunction;
    fEdit: VoidFunction;
}

const UserRow: React.FC<IRowProps> = ({name, admin, createdAt, fDelete, fEdit}) => {
    const {t} = useTranslation();
    return (
        <TableRow hover>
            <TableCell sx={{fontWeight: 600}}>{name}</TableCell>
            <TableCell>
                <Chip
                    label={admin ? t('Yes') : t('No')}
                    size="small"
                    color={admin ? 'primary' : 'default'}
                    variant={admin ? 'filled' : 'outlined'}
                />
            </TableCell>
            <TableCell title={createdAt} sx={{whiteSpace: 'nowrap'}}>
                {formatDate(createdAt)}
            </TableCell>
            <TableCell align="right" padding="none" style={{paddingRight: 8, whiteSpace: 'nowrap'}}>
                <Tooltip title={t('Edit')}>
                    <IconButton onClick={fEdit} className="edit">
                        <Edit fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('Delete')}>
                    <IconButton onClick={fDelete} className="delete" color="error">
                        <Delete fontSize="small" />
                    </IconButton>
                </Tooltip>
            </TableCell>
        </TableRow>
    );
};

const Users = observer(() => {
    const [deleteUser, setDeleteUser] = React.useState<IUser>();
    const [editUser, setEditUser] = React.useState<IUser>();
    const [createDialog, setCreateDialog] = React.useState(false);
    const {userStore} = useStores();
    const {t} = useTranslation();
    React.useEffect(() => void userStore.refresh(), []);
    const users = userStore.getItems();
    return (
        <DefaultPage
            title={t('Users')}
            description={t('Manage user accounts and administrator rights.')}
            maxWidth={800}
            rightControl={
                <Button
                    id="create-user"
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => setCreateDialog(true)}>
                    {t('Create User')}
                </Button>
            }>
            <Grid size={{xs: 12}}>
                <Paper elevation={1} style={{overflowX: 'auto'}}>
                    <Table id="user-table">
                        <TableHead>
                            <TableRow style={{textAlign: 'center'}}>
                                <TableCell>{t('Username')}</TableCell>
                                <TableCell>{t('Admin')}</TableCell>
                                <TableCell>{t('Created')}</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user: IUser) => (
                                <UserRow
                                    key={user.id}
                                    name={user.name}
                                    admin={user.admin}
                                    createdAt={user.createdAt}
                                    fDelete={() => setDeleteUser(user)}
                                    fEdit={() => setEditUser(user)}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Grid>
            {createDialog && (
                <AddEditDialog fClose={() => setCreateDialog(false)} fOnSubmit={userStore.create} />
            )}
            {editUser && (
                <AddEditDialog
                    fClose={() => setEditUser(undefined)}
                    fOnSubmit={userStore.update.bind(this, editUser.id)}
                    name={editUser.name}
                    admin={editUser.admin}
                    isEdit={true}
                />
            )}
            {deleteUser && (
                <ConfirmDialog
                    title={t('Confirm Delete')}
                    text={t('Delete {name}?', {name: deleteUser.name})}
                    fClose={() => setDeleteUser(undefined)}
                    fOnSubmit={() => userStore.remove(deleteUser.id)}
                />
            )}
        </DefaultPage>
    );
});

export default Users;
