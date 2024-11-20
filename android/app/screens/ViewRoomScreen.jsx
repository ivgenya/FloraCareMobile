import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import {fetchRoomDetails} from '../api/roomQueries';
import {BASE_UPLOADS_URL} from '../utils/constants';

const ViewRoomScreen = () => {
  const [roomDetails, setRoomDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const navigation = useNavigation();
  const {roomId} = route.params;

  const refetchRoomDetails = async () => {
    try {
      setLoading(true);
      const details = await fetchRoomDetails(roomId);
      setRoomDetails(details);
      if (details?.name) {
        navigation.setOptions({
          title: details.name,
        });
      }
    } catch (error) {
      console.error('Error fetching room details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetchRoomDetails();
  }, [roomId]);

  useFocusEffect(
    useCallback(() => {
      refetchRoomDetails();
    }, []),
  );

  const DeviceButton = () => {
    if (!roomDetails.device) {
      return (
        <TouchableOpacity
          style={styles.deviceButton}
          onPress={() => navigation.navigate('AddDeviceScreen', {roomId})}>
          <Text style={styles.deviceButtonText}>Добавить устройство</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  const PlantCard = ({plant}) => (
    <View style={styles.plantCard}>
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
    </View>
  );

  const AddPlantCard = () => (
    <TouchableOpacity
      style={styles.plantCard}
      onPress={() => navigation.navigate('AddPlantScreen', {roomId})}>
      <Text style={styles.cardTitle}>+</Text>
    </TouchableOpacity>
  );

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
              <Text style={styles.roomName}>{roomDetails.name}</Text>
              <DeviceButton />
              {roomDetails.device && (
                <>
                  <Text style={styles.roomTempHumidity}>
                    Температура: {roomDetails.temperature} °C
                  </Text>
                  <Text style={styles.roomTempHumidity}>
                    Влажность: {roomDetails.humidity} %
                  </Text>
                </>
              )}

              <FlatList
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
    marginBottom: 10,
  },
  roomTempHumidity: {
    fontSize: 18,
    marginBottom: 5,
  },
  list: {
    flexGrow: 1,
    marginTop: 10,
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
    fontWeight: '600',
    marginBottom: 5,
  },
  addButtonTitle: {
    fontSize: 18,
    fontWeight: '600',
    alignItems: 'center',
  },
  deviceButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
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
});

export default ViewRoomScreen;
