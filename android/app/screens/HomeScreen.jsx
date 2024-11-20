import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {fetchUserRooms} from '../api/roomQueries';
import {BASE_UPLOADS_URL} from '../utils/constants';

const HomeScreen = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const getRooms = async () => {
    setLoading(true);
    try {
      const userRooms = await fetchUserRooms();
      setRooms(userRooms);
    } catch (error) {
      console.error('Ошибка загрузки комнат:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getRooms();
    }, []),
  );

  const RoomCard = ({room}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ViewRoomScreen', {roomId: room.id})}>
      <Image
        source={{uri: BASE_UPLOADS_URL + room.image}}
        style={styles.cardImage}
      />
      <Text style={styles.cardTitle}>{room.name}</Text>
    </TouchableOpacity>
  );

  const AddRoomCard = () => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('AddRoomScreen')}>
      <Text style={styles.cardTitle}>Добавить новую комнату</Text>
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
        <FlatList
          data={[{id: 'add', name: 'Добавить комнату', image: ''}, ...rooms]}
          keyExtractor={item => item.id}
          numColumns={2}
          renderItem={({item}) =>
            item.id === 'add' ? <AddRoomCard /> : <RoomCard room={item} />
          }
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  list: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    padding: 10,
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    width: '45%',
    aspectRatio: 1,
  },
  cardImage: {
    width: '100%',
    height: '70%',
    borderRadius: 5,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
