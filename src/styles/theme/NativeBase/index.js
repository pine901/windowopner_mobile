import {extendTheme} from 'native-base';
import {solidOutlineVariants} from './Button';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    // Add new color
    primary: {
      50: '#E3F2F9',
      100: '#C5E4F3',
      200: '#A2D4EC',
      300: '#7AC1E4',
      400: '#47A9DA',
      500: '#0088CC',
      600: '#007AB8',
      700: '#006BA1',
      800: '#005885',
      900: '#003F5E',
    },
  },
/*  fontConfig: {
    Inter: {
      100: {
        normal: 'Inter-Thin',
        italic: 'Inter-Thin',
      },
      200: {
        normal: 'Inter-ExtraLight',
        italic: 'Inter-ExtraLight',
      },
      300: {
        normal: 'Inter-Light',
        italic: 'Inter-Light',
      },
      400: {
        normal: 'Inter-Regular',
        italic: 'Inter-Regular',
      },
      500: {
        normal: 'Inter-Medium',
        italic: 'Inter-Medium',
      },
      600: {
        normal: 'Inter-SemiBold',
        italic: 'Inter-SemiBold',
      },
      // Add more variants
      700: {
        normal: 'Inter-Bold',
        italic: 'Inter-Bold',
      },
      800: {
        normal: 'Inter-ExtraBold',
        italic: 'Inter-ExtraBold',
      },
      900: {
        normal: 'Inter-Black',
        italic: 'Inter-Black',
      },
    },
  },

  // Make sure values below matches any of the keys in `fontConfig`
  fonts: {
    heading: 'Inter',
    body: 'Inter',
    mono: 'Inter',
  },*/

  components: {
    Button: {
      variants: {
        solidOutline: solidOutlineVariants,
      },
    },
    Checkbox: {
      baseStyle: {
        borderWidth: 1,
        _text: {
          color: '#8b8b8b',
          fontStyle: 'italic',
          ml: 1
        },
        _light: {
          _text: {
            color: '#8b8b8b'
          }
        }
      },
    }
  },
});

export default theme;
