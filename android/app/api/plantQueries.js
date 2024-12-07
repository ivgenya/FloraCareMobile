import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../utils/constants';

export const createPlant = async plantData => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token not found');
    }
    const response = await fetch(BASE_URL + '/plant/add', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(plantData),
    });

    if (!response.ok) {
      throw new Error('Не удалось добавить растение');
    }
  } catch (error) {
    throw error;
  }
};

export const fetchPlantDetails = async plantId => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token not found');
    }
    const response = await fetch(BASE_URL + `/plant/${plantId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Не удалось получить данные о растении');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Ошибка при получении данных: ' + error.message);
  }
};

export const addPlantPhoto = async (plantId, imageUri) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token not found');
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
    if (!response.ok) {
      throw new Error('Ошибка при добавлении фото');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Ошибка при добавлении фото: ' + error.message);
  }
};

export const deletePlant = async plantId => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token not found');
    }
    const response = await fetch(BASE_URL + `/plant/${plantId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error deleting plant:', error);
    throw error;
  }
};
