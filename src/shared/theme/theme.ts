import { createTheme } from '@mui/material/styles';
import { designTokens } from './designTokens';

declare module '@mui/material/styles' {
  interface Theme {
    designTokens: typeof designTokens;
    status: {
      danger: string;
    };
  }

  interface ThemeOptions {
    designTokens?: typeof designTokens;
    status?: {
      danger?: string;
    };
  }

  interface Palette {
    semantic: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  }

  interface PaletteOptions {
    semantic?: {
      success?: string;
      warning?: string;
      error?: string;
      info?: string;
    };
  }

  interface Components {
    MuiDataGrid?: {
      styleOverrides?: any;
    };
  }
}

// Modern flight search theme with comprehensive design tokens
export const theme = createTheme({
  designTokens,
  palette: {
    mode: 'light',
    primary: {
      main: designTokens.colors.primary.main,
      light: designTokens.colors.primary.light,
      dark: designTokens.colors.primary.dark,
      contrastText: '#ffffff',
    },
    secondary: {
      main: designTokens.colors.secondary.main,
      light: designTokens.colors.secondary.light,
      dark: designTokens.colors.secondary.dark,
      contrastText: '#ffffff',
    },
    background: {
      default: designTokens.colors.neutral[50],
      paper: '#ffffff',
    },
    text: {
      primary: designTokens.colors.neutral[900],
      secondary: designTokens.colors.neutral[600],
      disabled: designTokens.colors.neutral[400],
    },
    semantic: {
      success: designTokens.colors.semantic.success,
      warning: designTokens.colors.semantic.warning,
      error: designTokens.colors.semantic.error,
      info: designTokens.colors.semantic.info,
    },
    grey: {
      50: designTokens.colors.neutral[50],
      100: designTokens.colors.neutral[100],
      200: designTokens.colors.neutral[200],
      300: designTokens.colors.neutral[300],
      400: designTokens.colors.neutral[400],
      500: designTokens.colors.neutral[500],
      600: designTokens.colors.neutral[600],
      700: designTokens.colors.neutral[700],
      800: designTokens.colors.neutral[800],
      900: designTokens.colors.neutral[900],
    },
  },
  typography: {
    fontFamily: designTokens.typography.fontFamily,
    h1: {
      fontWeight: designTokens.typography.fontWeights.bold,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: designTokens.typography.fontWeights.semibold,
      fontSize: '2rem',
      lineHeight: 1.25,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontWeight: designTokens.typography.fontWeights.semibold,
      fontSize: '1.5rem',
      lineHeight: 1.3,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontWeight: designTokens.typography.fontWeights.semibold,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: designTokens.typography.fontWeights.medium,
      fontSize: '1.125rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: designTokens.typography.fontWeights.medium,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    subtitle1: {
      fontWeight: designTokens.typography.fontWeights.medium,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    subtitle2: {
      fontWeight: designTokens.typography.fontWeights.medium,
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    body1: {
      fontWeight: designTokens.typography.fontWeights.regular,
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontWeight: designTokens.typography.fontWeights.regular,
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    caption: {
      fontWeight: designTokens.typography.fontWeights.regular,
      fontSize: '0.75rem',
      lineHeight: 1.4,
    },
    button: {
      fontWeight: designTokens.typography.fontWeights.medium,
      fontSize: '0.875rem',
      lineHeight: 1.5,
      textTransform: 'none',
      letterSpacing: '0.025em',
    },
  },
  shape: {
    borderRadius: designTokens.borderRadius.md,
  },
  spacing: designTokens.spacing.unit,
  breakpoints: {
    values: designTokens.breakpoints,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: designTokens.elevation.card,
          border: `1px solid ${designTokens.colors.neutral[200]}`,
          borderRadius: designTokens.borderRadius.lg,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: designTokens.elevation.hover,
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: designTokens.elevation.card,
          border: `1px solid ${designTokens.colors.neutral[200]}`,
          borderRadius: designTokens.borderRadius.md,
        },
        elevation1: {
          boxShadow: designTokens.elevation.card,
        },
        elevation2: {
          boxShadow: designTokens.elevation.hover,
        },
        elevation4: {
          boxShadow: designTokens.elevation.modal,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.md,
          padding: `${designTokens.spacing.sm + 2}px ${designTokens.spacing.lg}px`,
          fontSize: '0.875rem',
          fontWeight: designTokens.typography.fontWeights.medium,
          textTransform: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:focus-visible': {
            outline: `2px solid ${designTokens.colors.primary.main}`,
            outlineOffset: '2px',
          },
        },
        contained: {
          boxShadow: designTokens.elevation.card,
          '&:hover': {
            boxShadow: designTokens.elevation.hover,
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
            backgroundColor: `${designTokens.colors.primary.main}08`,
          },
        },
        text: {
          '&:hover': {
            backgroundColor: `${designTokens.colors.primary.main}08`,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: designTokens.borderRadius.md,
            backgroundColor: '#ffffff',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '& fieldset': {
              borderColor: designTokens.colors.neutral[300],
              borderWidth: '1.5px',
            },
            '&:hover fieldset': {
              borderColor: designTokens.colors.primary.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: designTokens.colors.primary.main,
              borderWidth: '2px',
            },
            '&.Mui-error fieldset': {
              borderColor: designTokens.colors.semantic.error,
            },
          },
          '& .MuiInputLabel-root': {
            fontWeight: designTokens.typography.fontWeights.medium,
            '&.Mui-focused': {
              color: designTokens.colors.primary.main,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.sm,
          fontSize: '0.75rem',
          fontWeight: designTokens.typography.fontWeights.medium,
          height: 32,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        filled: {
          backgroundColor: designTokens.colors.primary[100],
          color: designTokens.colors.primary[700],
          '&:hover': {
            backgroundColor: designTokens.colors.primary[200],
          },
          '& .MuiChip-deleteIcon': {
            color: designTokens.colors.primary[600],
            '&:hover': {
              color: designTokens.colors.primary[800],
            },
          },
        },
        outlined: {
          borderColor: designTokens.colors.neutral[300],
          '&:hover': {
            backgroundColor: designTokens.colors.neutral[50],
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: designTokens.elevation.card,
          borderBottom: `1px solid ${designTokens.colors.neutral[200]}`,
          backgroundColor: '#ffffff',
          color: designTokens.colors.neutral[900],
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          borderRadius: designTokens.borderRadius.lg,
          backgroundColor: '#ffffff',
          boxShadow: designTokens.elevation.card,
          '& .MuiDataGrid-cell': {
            borderBottom: `1px solid ${designTokens.colors.neutral[200]}`,
            padding: `${designTokens.spacing.md}px`,
            fontSize: '0.875rem',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: designTokens.colors.neutral[50],
            borderBottom: `2px solid ${designTokens.colors.neutral[200]}`,
            borderRadius: `${designTokens.borderRadius.lg}px ${designTokens.borderRadius.lg}px 0 0`,
            fontWeight: designTokens.typography.fontWeights.semibold,
            fontSize: '0.875rem',
            color: designTokens.colors.neutral[700],
          },
          '& .MuiDataGrid-row': {
            transition: 'background-color 0.15s ease',
            '&:hover': {
              backgroundColor: designTokens.colors.neutral[50],
            },
            '&.Mui-selected': {
              backgroundColor: `${designTokens.colors.primary.main}08`,
              '&:hover': {
                backgroundColor: `${designTokens.colors.primary.main}12`,
              },
            },
          },
          '& .MuiDataGrid-columnSeparator': {
            display: 'none',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: designTokens.colors.neutral[800],
          color: '#ffffff',
          fontSize: '0.75rem',
          fontWeight: designTokens.typography.fontWeights.medium,
          borderRadius: designTokens.borderRadius.sm,
          boxShadow: designTokens.elevation.tooltip,
          padding: `${designTokens.spacing.xs}px ${designTokens.spacing.sm}px`,
        },
        arrow: {
          color: designTokens.colors.neutral[800],
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: designTokens.borderRadius.xl,
          boxShadow: designTokens.elevation.modal,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
          boxShadow: designTokens.elevation.modal,
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          '& .MuiFormControlLabel-label': {
            fontSize: '0.875rem',
            fontWeight: designTokens.typography.fontWeights.regular,
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.sm,
          '&:hover': {
            backgroundColor: `${designTokens.colors.primary.main}08`,
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          '& .MuiSlider-thumb': {
            boxShadow: designTokens.elevation.card,
            '&:hover': {
              boxShadow: designTokens.elevation.hover,
            },
          },
        },
      },
    },
  },
  status: {
    danger: designTokens.colors.semantic.error,
  },
});