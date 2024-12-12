import AsyncStorage from '@react-native-async-storage/async-storage';

export const handleErrors = async (response, navigation) => {
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      await AsyncStorage.removeItem('authToken');
      navigation.replace('Вход');
      throw new Error('Пользователь не авторизован.');
    } else if (response.status === 500) {
      throw new Error('Произошла ошибка на сервере. Попробуйте позже.');
    } else {
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Произошла неизвестная ошибка.');
    }
  }
};
