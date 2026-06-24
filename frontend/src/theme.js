import { createTheme } from '@mui/material'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#D9E021',
      contrastText: '#2B2A29',
    },
    background: {
      default: '#2B2A29',
      paper: '#3a3936',
    },
    text: {
      primary: '#F9F9F9',
      secondary: '#5D5E5D',
    },
  },
  typography: {
    fontFamily: 'Lexend, sans-serif',
    h1: { fontFamily: 'Space Grotesk, sans-serif' },
    h2: { fontFamily: 'Space Grotesk, sans-serif' },
    h3: { fontFamily: 'Space Grotesk, sans-serif' },
    h4: { fontFamily: 'Space Grotesk, sans-serif' },
    h5: { fontFamily: 'Space Grotesk, sans-serif' },
    h6: { fontFamily: 'Space Grotesk, sans-serif' },
    button: { fontFamily: 'Space Grotesk, sans-serif' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          color: '#2B2A29',
          fontWeight: 700,
          '&:hover': {
            backgroundColor: '#c4ca1e',
          },
        },
      },
    },
  },
})

export default theme