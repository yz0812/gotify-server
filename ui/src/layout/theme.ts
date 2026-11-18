import {alpha, createTheme, PaletteMode, Shadows} from '@mui/material';

export type ThemeKey = 'dark' | 'light' | 'system';

export const isThemeKey = (value: string | null): value is ThemeKey =>
    value === 'light' || value === 'dark' || value === 'system';

export const fontFamily = [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"PingFang SC"',
    '"Hiragino Sans GB"',
    '"Microsoft YaHei"',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
].join(',');

const softShadows = (mode: PaletteMode): Shadows => {
    const color = mode === 'dark' ? '0, 0, 0' : '15, 23, 42';
    const strength = mode === 'dark' ? 0.5 : 0.08;
    return [
        'none',
        ...Array.from({length: 24}, (_, i) => {
            const level = i + 1;
            return `0 1px 2px rgba(${color}, ${strength}), 0 ${level}px ${level * 3}px rgba(${color}, ${strength})`;
        }),
    ] as Shadows;
};

export const createAppTheme = (mode: PaletteMode) => {
    const dark = mode === 'dark';
    const primary = dark ? '#818cf8' : '#4f46e5';
    const divider = dark ? 'rgba(148, 163, 184, 0.16)' : 'rgba(15, 23, 42, 0.08)';
    const paper = dark ? '#111827' : '#ffffff';

    return createTheme({
        palette: {
            mode,
            primary: {main: primary, contrastText: '#ffffff'},
            secondary: {main: dark ? '#f472b6' : '#db2777'},
            error: {main: dark ? '#f87171' : '#dc2626'},
            warning: {main: dark ? '#fbbf24' : '#d97706'},
            success: {main: dark ? '#34d399' : '#059669'},
            background: {
                default: dark ? '#0b1120' : '#f5f6fa',
                paper,
            },
            text: dark
                ? {primary: '#e5e7eb', secondary: '#9ca3af'}
                : {primary: '#0f172a', secondary: '#64748b'},
            divider,
        },
        shape: {borderRadius: 10},
        shadows: softShadows(mode),
        typography: {
            fontFamily,
            h4: {fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em'},
            h5: {fontWeight: 600, letterSpacing: '-0.01em'},
            h6: {fontSize: '1.05rem', fontWeight: 600},
            button: {textTransform: 'none', fontWeight: 600},
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        WebkitFontSmoothing: 'antialiased',
                    },
                    '::selection': {
                        background: alpha(primary, 0.25),
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {backgroundImage: 'none'},
                    rounded: {borderRadius: 14},
                    elevation: {border: `1px solid ${divider}`},
                },
            },
            MuiAppBar: {
                defaultProps: {elevation: 0, color: 'inherit'},
                styleOverrides: {
                    root: {
                        border: 'none',
                        borderBottom: `1px solid ${divider}`,
                        backgroundColor: alpha(paper, 0.8),
                        backdropFilter: 'saturate(180%) blur(12px)',
                    },
                },
            },
            MuiDrawer: {
                styleOverrides: {
                    paper: {border: 'none', borderRight: `1px solid ${divider}`},
                },
            },
            MuiButton: {
                defaultProps: {disableElevation: true},
                styleOverrides: {
                    root: {borderRadius: 8, paddingLeft: 16, paddingRight: 16},
                    sizeLarge: {paddingTop: 10, paddingBottom: 10},
                },
            },
            MuiIconButton: {
                styleOverrides: {root: {borderRadius: 8}},
            },
            MuiFab: {
                styleOverrides: {root: {boxShadow: 'none'}},
            },
            MuiTextField: {
                defaultProps: {variant: 'outlined'},
            },
            MuiOutlinedInput: {
                styleOverrides: {root: {borderRadius: 8}},
            },
            MuiDialog: {
                styleOverrides: {
                    paper: {borderRadius: 16, border: `1px solid ${divider}`},
                },
            },
            MuiDialogTitle: {
                styleOverrides: {root: {fontWeight: 600, paddingTop: 20}},
            },
            MuiDialogActions: {
                styleOverrides: {root: {padding: '12px 24px 20px', gap: 4}},
            },
            MuiTableHead: {
                styleOverrides: {
                    root: {
                        '& .MuiTableCell-head': {
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            color: dark ? '#9ca3af' : '#64748b',
                            backgroundColor: dark
                                ? 'rgba(148, 163, 184, 0.06)'
                                : 'rgba(15, 23, 42, 0.025)',
                            whiteSpace: 'nowrap',
                        },
                    },
                },
            },
            MuiTableCell: {
                styleOverrides: {root: {borderBottomColor: divider}},
            },
            MuiTableRow: {
                styleOverrides: {
                    root: {
                        '&:last-child td': {borderBottom: 0},
                        '&.MuiTableRow-hover:hover': {
                            backgroundColor: alpha(primary, dark ? 0.08 : 0.04),
                        },
                    },
                },
            },
            MuiListItemButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        '&.Mui-selected': {
                            backgroundColor: alpha(primary, dark ? 0.18 : 0.1),
                            color: primary,
                            '&:hover': {backgroundColor: alpha(primary, dark ? 0.24 : 0.14)},
                        },
                    },
                },
            },
            MuiMenu: {
                styleOverrides: {
                    paper: {marginTop: 6, minWidth: 180},
                    list: {padding: 6},
                },
            },
            MuiMenuItem: {
                styleOverrides: {root: {borderRadius: 6}},
            },
            MuiTooltip: {
                styleOverrides: {
                    tooltip: {
                        borderRadius: 6,
                        fontSize: '0.75rem',
                        backgroundColor: dark ? '#374151' : '#1e293b',
                    },
                    arrow: {color: dark ? '#374151' : '#1e293b'},
                },
            },
            MuiChip: {
                styleOverrides: {root: {fontWeight: 500}},
            },
        },
    });
};
