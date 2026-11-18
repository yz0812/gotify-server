import React from 'react';
import {Link} from 'react-router';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Settings from '@mui/icons-material/SettingsOutlined';
import {Switch, IconButton, Tooltip} from '@mui/material';
import DefaultPage from '../common/DefaultPage';
import CopyableSecret from '../common/CopyableSecret';
import {formatDate} from '../common/TimeAgoFormatter';
import {observer} from 'mobx-react-lite';
import {IPlugin} from '../types';
import {useStores} from '../stores';
import {useTranslation} from '../i18n';

const Plugins = observer(() => {
    const {pluginStore} = useStores();
    const {t} = useTranslation();
    React.useEffect(() => void pluginStore.refresh(), []);
    const plugins = pluginStore.getItems();
    return (
        <DefaultPage
            title={t('Plugins')}
            description={t('Manage the plugins installed on this server.')}
            maxWidth={1100}>
            <Grid size={{xs: 12}}>
                <Paper elevation={1} style={{overflowX: 'auto'}}>
                    <Table id="plugin-table">
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('ID')}</TableCell>
                                <TableCell>{t('Enabled')}</TableCell>
                                <TableCell>{t('Name')}</TableCell>
                                <TableCell>{t('Token')}</TableCell>
                                <TableCell>{t('Created')}</TableCell>
                                <TableCell align="right">{t('Details')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {plugins.map((plugin: IPlugin) => (
                                <Row
                                    key={plugin.token}
                                    id={plugin.id}
                                    token={plugin.token}
                                    name={plugin.name}
                                    enabled={plugin.enabled}
                                    createdAt={plugin.createdAt}
                                    fToggleStatus={() =>
                                        pluginStore.changeEnabledState(plugin.id, !plugin.enabled)
                                    }
                                />
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Grid>
        </DefaultPage>
    );
});

interface IRowProps {
    id: number;
    name: string;
    token: string;
    enabled: boolean;
    createdAt: string;
    fToggleStatus: VoidFunction;
}

const Row: React.FC<IRowProps> = observer(
    ({name, id, token, enabled, createdAt, fToggleStatus}) => {
        const {t} = useTranslation();
        return (
            <TableRow hover>
                <TableCell sx={{color: 'text.secondary'}}>{id}</TableCell>
                <TableCell>
                    <Switch
                        checked={enabled}
                        onClick={fToggleStatus}
                        className="switch"
                        data-enabled={enabled}
                    />
                </TableCell>
                <TableCell sx={{fontWeight: 600}}>{name}</TableCell>
                <TableCell>
                    <CopyableSecret value={token} style={{display: 'flex', alignItems: 'center'}} />
                </TableCell>
                <TableCell title={createdAt} sx={{whiteSpace: 'nowrap'}}>
                    {formatDate(createdAt)}
                </TableCell>
                <TableCell align="right" padding="none" style={{paddingRight: 8}}>
                    <Link to={'/plugins/' + id}>
                        <Tooltip title={t('Details')}>
                            <IconButton color="primary">
                                <Settings fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Link>
                </TableCell>
            </TableRow>
        );
    }
);

export default Plugins;
