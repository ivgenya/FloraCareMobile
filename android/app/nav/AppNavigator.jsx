import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import AccountScreen from '../screens/AccountScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MainScreen from '../screens/MainScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import AddRoomScreen from '../screens/AddRoomScreen';
import ViewRoomScreen from '../screens/ViewRoomScreen';
import AddPlantScreen from '../screens/AddPlantScreen';
import WateringCalenderScreen from '../screens/WateringCalenderScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentationDrawer from '../screens/DocumentationDrawer';
import BluetoothScanScreen from '../screens/BluetoothScanScreen';
import PlantDetailsScreen from '../screens/PlantDetailsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Мой дом"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color}) => {
          let iconName;
          if (route.name === 'Календарь') {
            iconName = focused ? 'calendar-month' : 'calendar-month-outline';
          } else if (route.name === 'Мой дом') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Аккаунт') {
            iconName = focused ? 'account' : 'account-outline';
          }
          return (
            <MaterialCommunityIcons name={iconName} size={30} color={color} />
          );
        },
        tabBarActiveTintColor: 'rgba(53,77,18, 0.6)',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderTopWidth: 0,
          backgroundColor: 'white',
        },
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderTopWidth: 0,
          backgroundColor: 'white',
        },
      })}>
      <Tab.Screen
        name="Календарь"
        component={WateringCalenderScreen}
        options={{
          tabBarLabel: '',
        }}
      />
      <Tab.Screen
        name="Мой дом"
        component={HomeScreen}
        options={{
          tabBarLabel: '',
        }}
      />
      <Tab.Screen
        name="Аккаунт"
        component={AccountScreen}
        options={{
          tabBarLabel: '',
        }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Вход"
        screenOptions={{
          cardStyle: {
            backgroundColor: '#fff',
          },
        }}>
        <Stack.Screen
          name="Вход"
          component={MainScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EmailLoginPage"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="RegistrationPage"
          component={RegistrationScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={HomeTabs}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AddRoomScreen"
          component={AddRoomScreen}
          options={{title: 'Создать комнату'}}
        />
        <Stack.Screen
          name="ViewRoomScreen"
          component={ViewRoomScreen}
          options={({route}) => ({
            title: route.params?.roomName || 'Комната',
            headerShown: true,
          })}
        />
        <Stack.Screen name="Поиск устройств" component={BluetoothScanScreen} />
        <Stack.Screen
          name="AddPlantScreen"
          component={AddPlantScreen}
          options={{title: 'Добавить растение'}}
        />
        <Stack.Screen
          name="Документация"
          component={DocumentationDrawer}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PlantDetailsScreen"
          component={PlantDetailsScreen}
          options={({route}) => ({
            title: route.params?.plantName || 'Растение',
            headerShown: true,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
