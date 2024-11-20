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
