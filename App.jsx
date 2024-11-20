import 'react-native-gesture-handler';
import AppNavigator from './android/app/nav/AppNavigator';
import {enableScreens} from 'react-native-screens';

const App = () => {
  enableScreens();
  return <AppNavigator />;
};

export default App;
