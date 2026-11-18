import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import React, {FC} from 'react';

interface IProps {
    title: string;
    description?: string;
    rightControl?: React.ReactNode;
    maxWidth?: number;
}

const DefaultPage: FC<React.PropsWithChildren<IProps>> = ({
    title,
    description,
    rightControl,
    maxWidth = 700,
    children,
}) => (
    <main style={{margin: '0 auto', maxWidth}}>
        <Grid container spacing={3}>
            <Grid
                size={{xs: 12}}
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    gap: 2,
                }}>
                <Box sx={{flex: 1, minWidth: 240}}>
                    <Typography variant="h4" sx={{wordBreak: 'break-word'}}>
                        {title}
                    </Typography>
                    {description ? (
                        <Typography variant="body2" sx={{color: 'text.secondary', mt: 0.5}}>
                            {description}
                        </Typography>
                    ) : null}
                </Box>
                {rightControl}
            </Grid>
            {children}
        </Grid>
    </main>
);
export default DefaultPage;
