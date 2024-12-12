import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../utils/constants';
import {Alert} from 'react-native';
import {handleErrors} from './queryUtils';

export const sendTokenToServer = async (idToken, navigation) => {
  try {
    const response = await fetch(BASE_URL + '/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({token: idToken}),
    });

    await handleErrors(response, navigation);
    const data = await response.json();
    await AsyncStorage.setItem('googleToken', idToken);
    await AsyncStorage.setItem('authToken', data.authToken);
    return true;
  } catch (error) {
    Alert.alert(
      'Ошибка',
      `Не удалось выполнить аутентификацию: ${error.message}`,
    );
    return false;
  }
};

export const register = async (username, email, password, navigation) => {
  try {
    const response = await fetch(BASE_URL + '/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username, email, password}),
    });

    await handleErrors(response, navigation);

    const data = await response.json();
    await AsyncStorage.setItem('authToken', data.authToken);
    return data;
  } catch (error) {
    Alert.alert(
      'Ошибка регистрации',
      error.message || 'Не удалось зарегистрироваться',
    );
    throw error;
  }
};

export const login = async (email, password, navigation) => {
  try {
    const response = await fetch(BASE_URL + '/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email, password}),
    });

    await handleErrors(response, navigation);

    const data = await response.json();
    await AsyncStorage.setItem('authToken', data.authToken);
    return true;
  } catch (error) {
    Alert.alert('Ошибка входа', error.message || 'Не удалось войти в систему');
    throw error;
  }
};

export const fetchUserInfo = async navigation => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      navigation.replace('Вход');
    }

    const response = await fetch(BASE_URL + '/user/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    await handleErrors(response, navigation);
    return await response.json();
  } catch (error) {
    Alert.alert('Ошибка', `Не удалось получить информацию: ${error.message}`);
    throw error;
  }
};
