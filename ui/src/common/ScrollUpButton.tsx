import Fab from '@mui/material/Fab';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import React from 'react';
import {useTranslation} from '../i18n';

const ScrollUpButton = () => {
    const [state, setState] = React.useState({display: 'none', opacity: 0});
    const {t} = useTranslation();
    React.useEffect(() => {
        const scrollHandler = () => {
            const currentScrollPos = Math.max(window.pageYOffset - 1000, 0);
            const opacity = Math.min(currentScrollPos / 1000, 1);
            const nextState = {display: currentScrollPos > 0 ? 'inherit' : 'none', opacity};
            if (state.display !== nextState.display || state.opacity !== nextState.opacity) {
                setState(nextState);
            }
        };
        window.addEventListener('scroll', scrollHandler);
        return () => window.removeEventListener('scroll', scrollHandler);
    }, []);

    return (
        <Fab
            color="primary"
            size="medium"
            aria-label={t('Scroll to top')}
            style={{
                position: 'fixed',
                bottom: '30px',
                right: '30px',
                zIndex: 100000,
                display: state.display,
                opacity: state.opacity,
            }}
            onClick={() => window.scrollTo(0, 0)}>
            <KeyboardArrowUp />
        </Fab>
    );
};

export default ScrollUpButton;
