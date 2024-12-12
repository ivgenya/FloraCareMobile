import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
  ImageBackground,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {fetchUserRooms, deleteRoom} from '../api/roomQueries';
import {BASE_UPLOADS_URL} from '../utils/constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const getRooms = async () => {
    setLoading(true);
    try {
      const userRooms = await fetchUserRooms(navigation);
      setRooms(userRooms);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getRooms();
    }, []),
  );

  const handleDeleteRoom = roomId => {
    Alert.alert(
      'Удалить комнату?',
      'Вы уверены, что хотите удалить эту комнату?',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Удалить',
          onPress: async () => {
            try {
              await deleteRoom(roomId, navigation);
              setRooms(rooms.filter(room => room.id !== roomId));
            } catch (error) {
              console.error('Ошибка удаления комнаты:', error);
            }
          },
        },
      ],
    );
  };

  const RoomCard = ({room}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ViewRoomScreen', {roomId: room.id})}
      onLongPress={() => handleDeleteRoom(room.id)}>
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
      <View style={styles.addRoomContent}>
        <Text style={styles.cardTitle}>Добавить комнату</Text>
        <Icon name="sofa-single-outline" size={40} color="#999" />
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../assets/img/bg_flora.png')}
      style={styles.background}>
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
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingVertical: 10,
    paddingLeft: 20,
    backgroundColor: 'transparent',
  },
  list: {
    justifyContent: 'space-between',
  },
  centerAddRoom: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
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
    textAlign: 'center',
    marginBottom: 10,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addRoomContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});

export default HomeScreen;
