import 'react-native-gesture-handler';
import AppNavigator from './android/app/nav/AppNavigator';
import {enableScreens} from 'react-native-screens';
import {useEffect} from 'react';
import {PermissionsAndroid} from 'react-native';

const App = () => {
  enableScreens();
  useEffect(() => {
    const requestBluetoothPermission = async () => {
      try {
        const granted = await PermissionsAndroid.requestMultiple(
          [
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ],
          {
            title: 'Разрешения для Bluetooth',
            message:
              'Для использования Bluetooth и поиска устройств необходимо предоставить разрешения',
            buttonNegative: 'Отказаться',
            buttonPositive: 'Разрешить',
          },
        );

        if (
          granted['android.permission.BLUETOOTH_SCAN'] === 'granted' &&
          granted['android.permission.BLUETOOTH_CONNECT'] === 'granted' &&
          granted['android.permission.ACCESS_FINE_LOCATION'] === 'granted'
        ) {
          console.log('Bluetooth разрешения предоставлены');
        } else {
          console.error('Bluetooth разрешения отклонены');
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestBluetoothPermission();
  }, []);

  return <AppNavigator />;
};

export default App;
