import {theme} from 'native-base';

export const solidOutlineVariants = props => {
  const outlineVariant = theme.components.Button.variants.outline;
  const {colorScheme: c, isDisabled} = props;

  const normalColor = isDisabled ? `${c}.500` : `${c}.900`;

  return {
    ...outlineVariant(props),
    borderColor: normalColor,
    _text: {
      color: normalColor,
    },
    _pressed: {
      _text: {color: `${c}.600`},
      borderColor: `${c}.600`,
      bg: 'transparent',
    },
  };
};
