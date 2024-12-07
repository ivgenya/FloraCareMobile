import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../utils/constants';

export const sendTokenToServer = async idToken => {
  try {
    const response = await fetch(BASE_URL + '/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({token: idToken}),
    });
    const data = await response.json();

    if (response.ok) {
      await AsyncStorage.setItem('googleToken', idToken);
      await AsyncStorage.setItem('authToken', data.authToken);
      return true;
    } else {
      console.error('Authentication failed:', data);
      return false;
    }
  } catch (error) {
    console.error('Error sending token to server:', error);
    return false;
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await fetch(BASE_URL + '/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username, email, password}),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    await AsyncStorage.setItem('authToken', data.authToken);
    return data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await fetch(BASE_URL + '/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email, password}),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    await AsyncStorage.setItem('authToken', data.authToken);
    return true;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const fetchUserInfo = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (token === null) {
      throw new Error('Token not found');
    }
    const response = await fetch(BASE_URL + '/user/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error fetching user info');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
};
