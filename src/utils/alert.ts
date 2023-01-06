import {Platform, Alert, AlertType} from 'react-native';
import prompt from 'react-native-prompt-android';

export const promptText = (
  title: string,
  content?: string,
  defaultValue = '',
  type: AlertType = 'plain-text',
) =>
  new Promise(resolve => {
    if (Platform.OS === 'android') {
      // @ts-ignore
      prompt(
        title,
        content,
        [
          {text: 'Cancel', onPress: () => resolve(null)},
          {text: 'Ok', onPress: resolve},
        ],
        {defaultValue, type},
      );
    } else {
      Alert.prompt(title, content, resolve, type, defaultValue);
    }
  });

export function confirmAlert(
  title: string,
  message?: string,
  postiveOverrides: any = {},
  negativeOverrides: any = {},
) {
  return new Promise(resolve => {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'Yes',
          style: 'default',
          ...postiveOverrides,
          onPress: () => {
            resolve(true);
          },
        },
        {
          text: 'No',
          style: 'cancel',
          ...negativeOverrides,
          onPress: () => {
            resolve(false);
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () => resolve(false),
      },
    );
  });
}
