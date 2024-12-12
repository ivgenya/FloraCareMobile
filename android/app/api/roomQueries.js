import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../utils/constants';
import {handleErrors} from './queryUtils';
import {Alert} from 'react-native';

export const fetchUserRooms = async navigation => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      navigation.replace('Вход');
    }

    const response = await fetch(BASE_URL + '/room/all', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await handleErrors(response, navigation);
    return await response.json();
  } catch (error) {
    Alert.alert('Ошибка', `Не удалось загрузить комнаты: ${error.message}`);
    throw error;
  }
};

export const addRoom = async (roomName, roomImage, navigation) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      navigation.replace('Вход');
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
    await handleErrors(response, navigation);
    return response;
  } catch (error) {
    Alert.alert('Ошибка', `Не удалось добавить комнату: ${error.message}`);
    throw error;
  }
};

export const fetchRoomDetails = async (roomId, navigation) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      navigation.replace('Вход');
    }

    const response = await fetch(BASE_URL + `/room/${roomId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await handleErrors(response, navigation);
    return await response.json();
  } catch (error) {
    Alert.alert(
      'Ошибка',
      `Не удалось получить данные комнаты: ${error.message}`,
    );
    throw error;
  }
};

export const deleteRoom = async (roomId, navigation) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      navigation.replace('Вход');
    }
    const response = await fetch(BASE_URL + `/room/${roomId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await handleErrors(response, navigation);
  } catch (error) {
    Alert.alert('Ошибка', `Не удалось удалить комнату: ${error.message}`);
    throw error;
  }
};

export const linkDeviceToRoom = async (
  roomId,
  macAddress,
  name,
  navigation,
) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      navigation.replace('Вход');
    }
    const requestBody = {
      macAddress: macAddress,
      name: name,
    };

    const response = await fetch(BASE_URL + `/room/${roomId}/link-device`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    await handleErrors(response, navigation);
    return response;
  } catch (error) {
    Alert.alert('Ошибка', `Не удалось добавить устройство: ${error.message}`);
    throw error;
  }
};

export const deleteDevice = async (roomId, deviceId, navigation) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      navigation.replace('Вход');
    }

    const response = await fetch(
      BASE_URL + `/room/${roomId}/device/${deviceId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    await handleErrors(response, navigation);
  } catch (error) {
    Alert.alert('Ошибка', `Не удалось удалить устройство: ${error.message}`);
    throw error;
  }
};

export const updateRoomName = async (roomId, newName, navigation) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      navigation.replace('Вход');
    }
    const requestBody = {
      name: newName,
    };
    const response = await fetch(BASE_URL + `/room/${roomId}/update-name`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    await handleErrors(response, navigation);
    return response;
  } catch (error) {
    Alert.alert(
      'Ошибка',
      `Не удалось обновить название комнаты: ${error.message}`,
    );
    throw error;
  }
};
