import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {fetchUserInfo} from '../api/authQueries';
import {Dimensions} from 'react-native';
import {BarChart} from 'react-native-gifted-charts';
import {useFocusEffect} from '@react-navigation/native';

const AccountScreen = ({navigation}) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const user = await fetchUserInfo();
    setUserInfo(user);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

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

  const data = [
    {value: userInfo?.stats?.roomsCount || 0, label: 'Комнаты', barWidth: 50},
    {value: userInfo?.stats?.plantsCount || 0, label: 'Растения', barWidth: 50},
    {
      value: userInfo?.stats?.devicesCount || 0,
      label: 'Устройства',
      barWidth: 50,
    },
  ];

  const maxValue = Math.max(
    userInfo?.stats?.devicesCount || 0,
    userInfo?.stats?.plantsCount || 0,
    userInfo?.stats?.roomsCount || 0,
  );

  const screenWidth = Dimensions.get('window').width;
  const barWidth = screenWidth * 0.6;

  return (
    <ImageBackground
      source={require('../assets/img/bg_flora.png')}
      style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="green"
            style={styles.loadingIndicator}
          />
        ) : (
          <>
            {userInfo && (
              <View style={styles.profileContainer}>
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
                <Text style={styles.email}>
                  {userInfo.email || 'No email provided'}
                </Text>
              </View>
            )}
            {userInfo?.stats && (
              <View style={styles.statsContainer}>
                <View style={styles.chartContainer}>
                  <BarChart
                    data={data}
                    width={barWidth}
                    maxValue={maxValue + 1}
                    spacing={30}
                    initialSpacing={20}
                    stepValue={1}
                    isAnimated={true}
                    barWidth={20}
                    frontColor={'rgba(53,77,18, 0.6)'}
                  />
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.transparentButton}
              onPress={() => navigation.navigate('Документация')}>
              <Text style={styles.buttonText}>О приложении</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.transparentButton}
              onPress={signOut}>
              <Text style={styles.buttonText}>Выйти</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
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
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
    paddingBottom: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'transparent',
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 60,
    marginBottom: 15,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#888',
    marginBottom: 15,
  },
  statsContainer: {
    width: '90%',
    marginBottom: 20,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  transparentButton: {
    backgroundColor: 'transparent',
    marginBottom: 10,
    width: 300,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'rgba(53,77,18, 0.6)',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default AccountScreen;
