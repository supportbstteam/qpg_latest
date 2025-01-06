import { responsiveFontSize } from 'react-native-responsive-dimensions';
import {BaseToast, ErrorToast} from 'react-native-toast-message';

export const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={{height: 50, borderLeftWidth: 10, borderLeftColor: 'green'}}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: responsiveFontSize(1.8),
        fontWeight: '400',
      }}
    />
  ),
  error: props => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: responsiveFontSize(2),
      }}
      text2Style={{
        fontSize: responsiveFontSize(1.8),
      }}
    />
  ),
};
