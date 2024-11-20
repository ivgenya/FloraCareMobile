import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../utils/constants';

export const fetchUserRooms = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (token === null) {
      console.log('Token not found');
      throw new Error('Token not found');
    }

    const response = await fetch(BASE_URL + '/room/all', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Ошибка при получении комнат');
    }
    return await response.json();
  } catch (error) {
    throw new Error('Ошибка при подключении к серверу: ' + error.message);
  }
};
export const addRoom = async (roomName, roomImage) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (token === null) {
      console.log('Token not found');
      throw new Error('Token not found');
    }

    const requestBody = {
      name: roomName,
      image: roomImage,
    };

    const response = await fetch(BASE_URL + '/room/add', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Error: ${errorData || 'Unknown error'}`);
    }

    return await response; // Возвращаем ответ от сервера
  } catch (error) {
    console.error('Error creating room:', error);
    throw new Error('Error connecting to the server: ' + error.message);
  }
};

export const fetchRoomDetails = async roomId => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await fetch(BASE_URL + `/room/${roomId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Ошибка при получении данных комнаты');
    }
    return await response.json();
  } catch (error) {
    throw new Error('Ошибка при подключении к серверу: ' + error.message);
  }
};
