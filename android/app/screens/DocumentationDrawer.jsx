import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import DocumentationScreen from '../screens/DocumentationScreen';

const Drawer = createDrawerNavigator();

const DocumentationDrawer = () => {
  return (
    <Drawer.Navigator initialRouteName="Главная">
      <Drawer.Screen
        name="Главная"
        component={DocumentationScreen}
        initialParams={{
          fileUrl:
            'https://raw.githubusercontent.com/ivgenya/FloraCareMobile/main/docs/README.md',
        }}
      />
      <Drawer.Screen
        name="Установка"
        component={DocumentationScreen}
        initialParams={{
          fileUrl:
            'https://raw.githubusercontent.com/ivgenya/FloraCareMobile/main/docs/authorization/authorization.md',
        }}
      />
      <Drawer.Screen
        name="Добавление комнат"
        component={DocumentationScreen}
        initialParams={{
          fileUrl:
            'https://raw.githubusercontent.com/ivgenya/FloraCareMobile/main/docs/creating-your-home/creating-room.md',
        }}
      />
      <Drawer.Screen
        name="Добавление растений"
        component={DocumentationScreen}
        initialParams={{
          fileUrl:
            'https://raw.githubusercontent.com/ivgenya/FloraCareMobile/main/docs/creating-your-home/creating-plants.md',
        }}
      />
      <Drawer.Screen
        name="Добавление устройств"
        component={DocumentationScreen}
        initialParams={{
          fileUrl:
            'https://raw.githubusercontent.com/ivgenya/FloraCareMobile/main/docs/creating-your-home/adding-devices.md',
        }}
      />
    </Drawer.Navigator>
  );
};

export default DocumentationDrawer;
