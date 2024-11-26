import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {fetchUserInfo} from '../api/authQueries';

const AccountScreen = ({navigation}) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const user = await fetchUserInfo();
      setUserInfo(user);
    };
    fetchData();
    setLoading(false);
  }, []);

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('googleToken');
      await AsyncStorage.removeItem('user');
      navigation.replace('Вход');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="green"
          style={styles.loadingIndicator}
        />
      ) : (
        <>
          {userInfo && (
            <View style={styles.container}>
              <Image
                source={
                  userInfo.avatarUrl
                    ? {uri: userInfo.avatarUrl}
                    : require('../assets/img/no_avatar.jpg')
                }
                style={styles.profileImage}
              />
              <Text style={styles.greeting}>
                {userInfo.username || 'Username'}
              </Text>
              <Text>{userInfo.email || 'No email provided'}</Text>
              <Button title="Sign out" onPress={signOut} />
            </View>
          )}
        </>
      )}
      <TouchableOpacity
        style={styles.transparentButton}
        onPress={() => navigation.navigate('Документация')}>
        <Text style={styles.buttonText}>Открыть документацию</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  transparentButton: {
    backgroundColor: 'transparent',
    color: '#666',
    marginBottom: 15,
    width: 300,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#666',
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
});

export default AccountScreen;
