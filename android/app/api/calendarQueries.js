import {BASE_URL} from '../utils/constants';
import {Alert} from 'react-native';
import {handleErrors} from './queryUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchWateringSchedule = async navigation => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      navigation.replace('Вход');
    }

    const response = await fetch(BASE_URL + '/plant/watering-schedule', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await handleErrors(response, navigation);
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
    Alert.alert('Ошибка', `Не удалось загрузить расписание: ${error.message}`);
    return {};
  }
};

export const markWatering = async (date, navigation) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      navigation.replace('Вход');
    }

    if (!date) {
      Alert.alert('Ошибка', 'Дата не указана.');
      throw new Error('Date is required.');
    }

    const response = await fetch(BASE_URL + '/plant/mark-watering', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({date}),
    });
    await handleErrors(response, navigation);
    Alert.alert('Полив успешно отмечен.');
  } catch (error) {
    Alert.alert('Ошибка', `Не удалось отметить полив: ${error.message}`);
  }
};
