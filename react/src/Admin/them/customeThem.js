import { createTheme } from "@mui/material/styles";

const customTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: '#171717',
    },
    secondary: {
      main: '#a24d24',
    },
    white:{
      main:"#fff"
    },
    orange:{
      main:"#ffdb0f"
    },
    
    background: {
      default: '#f7f3ed',
      paper:"#ffffff"
    },
  },
 
  
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9155FD',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
});

const customerTheme = createTheme({
  palette: {
    mode: "light", // Set the custom color mode name here
    primary: {
      main: '#9155FD',
    },
    secondary: {
      main: '#f48fb1',
    },
    white:{
      main:"#fff"
    },
    orange:{
      main:"#ffdb0f"
    },
    
    background: {
      default: '',
      // paper: '#121019',
      paper:"white"
    },
  },
 
  
});

export {customTheme,darkTheme,customerTheme};
