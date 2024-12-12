import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  deleteDevice,
  fetchRoomDetails,
  updateRoomName,
} from '../api/roomQueries';
import {BASE_UPLOADS_URL} from '../utils/constants';
import {useBleManager} from '../hook/useBleManager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {deletePlant} from '../api/plantQueries';

const ViewRoomScreen = () => {
  const [roomDetails, setRoomDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [temp, setTemp] = useState(null);
  const [humid, setHumid] = useState(null);
  const route = useRoute();
  const navigation = useNavigation();
  const {roomId} = route.params;
  const {
    scanForDevices,
    connectAndMonitorTemperature,
    temperature,
    humidity,
    devices,
  } = useBleManager();

  useEffect(() => {
    const loadTemperatureFromStorage = async () => {
      try {
        const storedTemp = await AsyncStorage.getItem('temperature');
        const storedHumid = await AsyncStorage.getItem('humidity');
        if (storedTemp !== null) {
          setTemp(JSON.parse(storedTemp));
        }
        if (storedHumid !== null) {
          setHumid(JSON.parse(storedHumid));
        }
      } catch (error) {
        console.error('Error loading data from AsyncStorage', error);
      }
    };
    loadTemperatureFromStorage();
  }, []);

  const refetchRoomDetails = async () => {
    try {
      setLoading(true);
      const details = await fetchRoomDetails(roomId, navigation);
      setRoomDetails(details);
      setNewRoomName(details?.name || '');
      if (details?.name) {
        navigation.setOptions({title: details.name});
      }
      if (details?.devices && details.devices.length > 0) {
        await handleDeviceConnection(details.devices[0]);
      }
    } catch (error) {
      console.error('Error fetching room details:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      refetchRoomDetails();
    }, []),
  );

  useEffect(() => {
    refetchRoomDetails();
  }, [roomId]);

  useEffect(() => {
    if (roomDetails?.devices && roomDetails.devices.length > 0) {
      const foundDevice = devices.find(
        device =>
          device.name === roomDetails.devices[0].name &&
          device.id === roomDetails.devices[0].macAddress,
      );

      if (foundDevice) {
        console.log('Device found, connecting...');
        connectAndMonitorTemperature(foundDevice);
      }
    }
  }, [devices, roomDetails]);

  useEffect(() => {
    setTemp(temperature);
    setHumid(humidity);
    const saveDataToStorage = async () => {
      try {
        if (temperature !== null) {
          await AsyncStorage.setItem(
            'temperature',
            JSON.stringify(temperature),
          );
        }
        if (humidity !== null) {
          await AsyncStorage.setItem('humidity', JSON.stringify(humidity));
        }
      } catch (error) {
        console.error('Error saving data to AsyncStorage', error);
      }
    };
    saveDataToStorage();
  }, [temperature, humidity]);

  const handleDeviceConnection = async deviceDetails => {
    try {
      console.log('Starting scan for device:', deviceDetails.name);
      scanForDevices();
    } catch (error) {
      console.error('Error connecting to device:', error);
    }
  };

  const handleDeleteDevice = async () => {
    await deleteDevice(roomId, roomDetails.devices[0].id, navigation);
    await refetchRoomDetails();
  };

  const DeviceSection = () => {
    if (roomDetails?.devices && roomDetails.devices.length > 0) {
      const device = roomDetails.devices[0];
      return (
        <View style={styles.deviceContainer}>
          <View style={styles.deviceInfoContainer}>
            <Text style={styles.deviceText}>{device.name}</Text>
            <Text style={styles.tempHumidityText}>
              {temp ? `${temp} °C` : '--'} | {humid ? `${humid} %` : '--'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleDeleteDevice}
            style={styles.removeDeviceButton}>
            <Icon name="trash-can-outline" size={30} color="#ccc" />
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={styles.deviceButton}
        onPress={() => navigation.navigate('Поиск устройств', {roomId})}>
        <Text style={styles.deviceButtonText}>Привязать устройство</Text>
      </TouchableOpacity>
    );
  };

  const isTemperatureInRange = plant => {
    if (!temperature) {
      return false;
    }
    return (
      temperature >= plant.minTemperature && temperature <= plant.maxTemperature
    );
  };

  const isHumidityInRange = plant => {
    if (!humidity) {
      return false;
    }
    return humidity >= plant.minHumidity && humidity <= plant.maxHumidity;
  };

  const isOutOfRange = plant => {
    const isTemperatureValid = isTemperatureInRange(plant);
    const isHumidityValid = isHumidityInRange(plant);
    return !(isTemperatureValid && isHumidityValid);
  };

  const handleDeletePlant = plantId => {
    Alert.alert(
      'Удалить растение?',
      'Вы уверены, что хотите удалить это растение?',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Удалить',
          onPress: async () => {
            try {
              await deletePlant(plantId, navigation);
              setRoomDetails(prevState => ({
                ...prevState,
                plants: prevState.plants.filter(plant => plant.id !== plantId),
              }));
            } catch (error) {
              console.error('Error deleting plant:', error);
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

  const PlantCard = ({plant}) => {
    const outOfRange = isOutOfRange(plant);
    return (
      <TouchableOpacity
        style={styles.plantCard}
        onPress={() =>
          navigation.navigate('PlantDetailsScreen', {plantId: plant.id})
        }
        onLongPress={() => handleDeletePlant(plant.id)}>
        <View style={styles.plantCardText}>
          <Text style={styles.cardTitle}>{plant.name}</Text>
          <Text>
            Влажность: {plant.minHumidity} - {plant.maxHumidity} %
          </Text>
          <Text>
            Температура: {plant.minTemperature} - {plant.maxTemperature} °C
          </Text>
        </View>
        <Image
          source={{uri: BASE_UPLOADS_URL + plant.photos[0].image}}
          style={styles.plantCardImage}
        />
        {temp && humid && outOfRange && (
          <View style={styles.warningBadge}>
            <Text style={styles.warningText}>!</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const AddPlantCard = () => (
    <TouchableOpacity
      style={styles.plantCard}
      onPress={() =>
        navigation.navigate('AddPlantScreen', {
          roomId,
        })
      }>
      <Text style={styles.cardTitle}>
        <Icon name="plus" size={20} color="#ccc" /> Добавить растение
      </Text>
    </TouchableOpacity>
  );

  const handleUpdateRoomName = async name => {
    if (!name.trim()) {
      Alert.alert('Ошибка', 'Название комнаты не может быть пустым.');
      return;
    }
    try {
      await updateRoomName(roomId, name, navigation);
      setRoomDetails(prevState => ({...prevState, name: name}));
      setIsEditingName(false);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось обновить название комнаты.');
    }
  };

  const RoomName = () => {
    const [localRoomName, setLocalRoomName] = useState(roomDetails?.name);

    const handleBlur = async () => {
      if (localRoomName.trim() !== newRoomName) {
        await handleUpdateRoomName(localRoomName);
      }
      setIsEditingName(false);
    };

    return isEditingName ? (
      <TextInput
        style={styles.roomName}
        value={localRoomName}
        onChangeText={setLocalRoomName}
        onBlur={handleBlur}
        autoFocus
        returnKeyType="done"
      />
    ) : (
      <TouchableOpacity onPress={() => setIsEditingName(true)}>
        <Text style={styles.roomName}>{roomDetails?.name}</Text>
      </TouchableOpacity>
    );
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
          {roomDetails && (
            <>
              <Image
                source={{uri: BASE_UPLOADS_URL + roomDetails.image}}
                style={styles.roomImage}
              />
              <RoomName />
              <DeviceSection />
              <FlatList
                showsVerticalScrollIndicator={false}
                data={[
                  {id: 'add', name: 'Добавить новое растение'},
                  ...roomDetails.plants,
                ]}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) =>
                  item.id === 'add' ? (
                    <AddPlantCard />
                  ) : (
                    <PlantCard plant={item} />
                  )
                }
                contentContainerStyle={styles.list}
                style={{flex: 1}}
              />
            </>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  roomImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  roomName: {
    fontSize: 24,
    fontWeight: '600',
  },
  roomTempHumidity: {
    fontSize: 18,
    marginBottom: 5,
  },
  list: {
    flexGrow: 1,
    paddingBottom: 15,
    marginTop: 10,
    marginBottom: 15,
  },
  plantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  plantCardText: {
    flex: 1,
    marginRight: 10,
  },
  plantCardImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '400',
    marginBottom: 5,
    color: '#999',
  },
  addButtonTitle: {
    fontSize: 18,
    fontWeight: '600',
    alignItems: 'center',
  },
  deviceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  deviceInfoContainer: {
    alignItems: 'left',
  },
  deviceText: {
    fontSize: 18,
    fontWeight: '500',
  },
  tempHumidityText: {
    fontSize: 20,
    color: 'gray',
  },
  removeDeviceButton: {
    padding: 10,
  },
  deviceButton: {
    backgroundColor: 'rgba(53,77,18, 0.6)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  deviceButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#c21519',
    width: 25,
    height: 25,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ViewRoomScreen;
