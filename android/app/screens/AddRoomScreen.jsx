import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {addRoom} from '../api/roomQueries';

const AddRoomScreen = ({navigation}) => {
  const [roomName, setRoomName] = useState('');
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [roomImage, setRoomImage] = useState(null);

  const handleAddRoom = async () => {
    setIsSubmitEnabled(true);
    if (!roomName || !roomImage) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      setIsSubmitEnabled(false);
      return;
    }
    try {
      await addRoom(roomName, roomImage);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Ошибка', error.message);
    } finally {
      setIsSubmitEnabled(false);
    }
  };

  const pickImage = () => {
    launchImageLibrary({mediaType: 'photo', includeBase64: true}, response => {
      if (response.didCancel) {
        return;
      } else if (response.errorCode) {
        Alert.alert('Ошибка', 'Ошибка выбора изображения');
      } else {
        setRoomImage(response.assets[0].base64);
      }
    });
  };

  return (
    <ImageBackground
      source={require('../assets/img/bg_flora.png')}
      style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Создание комнаты</Text>
        <TextInput
          style={styles.input}
          placeholder="Название комнаты"
          value={roomName}
          onChangeText={setRoomName}
        />
        <TouchableOpacity style={styles.transparentButton} onPress={pickImage}>
          <Text style={styles.buttonText}>Выбрать изображение</Text>
        </TouchableOpacity>
        {roomImage && (
          <Image
            source={{uri: `data:image/jpeg;base64,${roomImage}`}}
            style={styles.imagePreview}
          />
        )}
        <TouchableOpacity
          onPress={handleAddRoom}
          disabled={isSubmitEnabled}
          style={[styles.transparentButton, isSubmitEnabled && {opacity: 0.5}]}>
          <Text style={styles.buttonText}>Создать</Text>
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
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
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
  imagePreview: {
    width: 100,
    height: 100,
    marginBottom: 15,
    borderRadius: 8,
  },
});

export default AddRoomScreen;
