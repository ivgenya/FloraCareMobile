import React, {useEffect} from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  TouchableOpacity,
} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CLIENT_ID} from '../utils/constants';

const MainScreen = ({navigation}) => {
  const getSignedIn = async () => {
    const token = await AsyncStorage.getItem('authToken');
    const googleToken = await AsyncStorage.getItem('googleToken');
    return token || googleToken;
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: null,
    });

    GoogleSignin.configure({
      webClientId: CLIENT_ID,
      offlineAccess: true,
    });

    const checkSignedIn = async () => {
      try {
        const isAuthenticated = await getSignedIn();
        if (isAuthenticated) {
          navigation.replace('Home');
        }
      } catch (error) {
        console.error('Ошибка при проверке авторизации:', error);
      }
    };
    checkSignedIn();
  }, [navigation]);

  return (
    <ImageBackground
      source={require('../assets/img/plant_bg.jpg')}
      style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>FloraCare</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('EmailLoginPage')}
          style={styles.transparentButton}>
          <Text style={styles.buttonText}>Войти</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('RegistrationPage')}
          style={styles.whiteButton}>
          <Text style={styles.linkText}>Создать аккаунт</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 45,
    marginBottom: 40,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  transparentButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    color: '#fff',
    marginBottom: 15,
    borderRadius: 10,
    width: 300,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteButton: {
    color: '#fff',
    marginBottom: 15,
    borderRadius: 20,
    width: 200,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },

  linkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '300',
    textAlign: 'center',
  },
});

export default MainScreen;
