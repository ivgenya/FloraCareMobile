import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {login, sendTokenToServer} from '../api/authQueries';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CLIENT_ID} from '../utils/constants';

const LoginScreen = ({navigation}) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    navigation.setOptions({
      headerLeft: null,
    });

    GoogleSignin.configure({
      webClientId: CLIENT_ID,
      offlineAccess: true,
    });
  }, [navigation]);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();
      const isVerified = await sendTokenToServer(user.data.idToken);
      if (isVerified) {
        setIsSignedIn(true);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        navigation.replace('Home');
      } else {
        setIsSignedIn(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        const googleError = error;

        if (googleError.code === statusCodes.SIGN_IN_CANCELLED) {
          console.log('User cancelled the sign-in');
        } else if (googleError.code === statusCodes.IN_PROGRESS) {
          console.log('Sign-in is in progress');
        } else if (
          googleError.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
        ) {
          console.log('Play services are not available');
        } else {
          console.log(googleError.message);
        }
      } else {
        console.error('An unknown error occurred');
      }
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля.');
      return;
    }
    try {
      await login(email, password);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Ошибка', error.message || 'Не удалось зарегистрироваться.');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/img/login_bg.png')}
      style={styles.background}>
      <View style={styles.container}>
        {!isSignedIn && (
          <>
            <Text style={styles.title}>Добро пожаловать!</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity
              onPress={() => handleEmailLogin()}
              style={styles.transparentButton}>
              <Text style={styles.buttonText}>Войти</Text>
            </TouchableOpacity>
            <View style={styles.line} />
            <TouchableOpacity
              onPress={() => signIn()}
              style={styles.googleButton}>
              <View style={styles.googleButtonContent}>
                <Image
                  source={require('../assets/img/google_icon.png')}
                  style={styles.icon}
                />
                <Text style={styles.googleButtonText}>Sign Up with Google</Text>
              </View>
            </TouchableOpacity>
          </>
        )}
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
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 60,
    width: 300,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingLeft: 20,
  },
  transparentButton: {
    backgroundColor: 'rgba(53,77,18, 0.6)',
    color: '#fff',
    marginBottom: 15,
    borderRadius: 10,
    width: 300,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    width: 300,
  },
  googleButton: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  googleButtonText: {
    color: '#777',
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 15,
  },
  icon: {
    width: 20,
    height: 20,
  },
  line: {
    height: 1,
    backgroundColor: '#ccc',
    width: '100%',
    marginVertical: 10,
  },
});

export default LoginScreen;
