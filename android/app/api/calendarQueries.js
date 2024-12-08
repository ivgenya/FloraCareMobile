import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../utils/constants';
import {Alert} from 'react-native';

export const fetchWateringSchedule = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (token === null) {
      throw new Error('Token not found');
    }

    const response = await fetch(BASE_URL + '/plant/watering-schedule', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const formattedDates = {};
    for (const [date, plants] of Object.entries(data)) {
      formattedDates[date] = {
        marked: true,
        dotColor: 'blue',
        plants: plants,
        customStyles: {
          container: {
            backgroundColor: '#d1f0ff',
          },
          text: {
            color: '#000',
            fontWeight: 'bold',
          },
        },
      };
    }
    return formattedDates;
  } catch (error) {
    console.error('Error fetching watering schedule:', error);
    return {};
  }
};

export const markWatering = async date => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (token === null) {
      throw new Error('Token not found');
    }

    const response = await fetch(BASE_URL + '/plant/mark-watering', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({date: date}),
    });

    if (response.ok) {
      Alert.alert('Отметка полива', 'Полив успешно отмечен');
    } else {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
    }
  } catch (error) {
    console.error(error);
  }
};
