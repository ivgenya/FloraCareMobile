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

export const deleteRoom = async roomId => {
  const token = await AsyncStorage.getItem('authToken');
  if (!token) {
    throw new Error('Token not found');
  }
  const response = await fetch(BASE_URL + `/room/${roomId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Ошибка удаления комнаты');
  }
};

export const linkDeviceToRoom = async (roomId, macAddress, name) => {
  const token = await AsyncStorage.getItem('authToken');
  if (!token) {
    throw new Error('Token not found');
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

  if (!response.ok) {
    throw new Error('Failed to link device to room');
  }

  return response.json();
};

export const deleteDevice = async (roomId, deviceId) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token not found');
    }
    const response = await fetch(
      BASE_URL + `/room/${roomId}/device/${deviceId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Error deleting device:', error);
  }
};

export const updateRoomName = async (roomId, newName) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token not found');
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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update room name');
    }
  } catch (error) {
    console.error('Error in updateRoomName:', error);
    throw error;
  }
};
