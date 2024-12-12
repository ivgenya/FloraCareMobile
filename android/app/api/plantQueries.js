import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../utils/constants';
import {handleErrors} from './queryUtils';
import {Alert} from 'react-native';

export const createPlant = async (plantData, navigation) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      navigation.replace('Вход');
    }

    const response = await fetch(BASE_URL + '/plant/add', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(plantData),
    });
    await handleErrors(response, navigation);
    return await response.json();
  } catch (error) {
    Alert.alert('Ошибка', error.message);
    throw error;
  }
};

export const fetchPlantDetails = async (plantId, navigation) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      navigation.replace('Вход');
    }

    const response = await fetch(BASE_URL + `/plant/${plantId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    await handleErrors(response, navigation);
    return await response.json();
  } catch (error) {
    Alert.alert('Ошибка', `Не удалось получить данные: ${error.message}`);
    throw error;
  }
};

export const addPlantPhoto = async (plantId, imageUri, navigation) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      navigation.replace('Вход');
    }

    const response = await fetch(BASE_URL + '/plant/add-photo', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plantId: plantId,
        image: imageUri,
      }),
    });
    await handleErrors(response, navigation);
    return await response.json();
  } catch (error) {
    Alert.alert('Ошибка', `Не удалось добавить фото: ${error.message}`);
    throw error;
  }
};

export const deletePlant = async (plantId, navigation) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      navigation.replace('Вход');
    }

    const response = await fetch(BASE_URL + `/plant/${plantId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    await handleErrors(response, navigation);
    return response;
  } catch (error) {
    Alert.alert('Ошибка', `Не удалось удалить растение: ${error.message}`);
    throw error;
  }
};
