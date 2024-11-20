import React, {useState, useCallback, useEffect} from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {debounce} from 'lodash';
import {API_URL} from '../utils/constants';
import {createPlant} from '../api/plantQueries';

const AddPlantScreen = ({navigation, route}) => {
  const {roomId} = route.params;
  const [plant, setPlant] = useState(null);
  const [plantImage, setPlantImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [plants, setPlants] = useState([]);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [filteredPlants, setFilteredPlants] = useState([]);

  const searchPlants = async query => {
    try {
      const response = await fetch(`${API_URL}?query=${query}`);
      const data = await response.json();
      setPlants(data.data);
      setFilteredPlants(data.data);
    } catch (error) {
      console.error('Error fetching plants:', error);
    }
  };

  useEffect(() => {
    searchPlants('');
  }, []);

  const debouncedSearch = useCallback(
    debounce(query => {
      const filtered = plants.filter(plant =>
        plant.name.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredPlants(filtered);
      if (filtered.length === 0) {
        setPlant(null);
      }
    }, 300),
    [plants],
  );

  const handleSearchChange = text => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  const addPlant = async () => {
    if (!plant || !plantImage) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }
    setIsSubmitEnabled(true);
    const plantData = {
      name: plant.name,
      minTemperature: plant.minTemperature,
      maxTemperature: plant.maxTemperature,
      minHumidity: plant.minHumidity,
      maxHumidity: plant.maxHumidity,
      wateringFrequency: plant.wateringFrequency,
      fertilizingFrequency: plant.fertilizingFrequency,
      description: plant.description,
      room: {
        id: roomId,
      },
      photos: [
        {
          image: plantImage,
        },
      ],
      schedules: [],
    };

    try {
      await createPlant(plantData);
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
        setPlantImage(response.assets[0].base64);
      }
    });
  };

  const handleSelectPlant = selectedPlant => {
    setPlant(selectedPlant);
    setSearchQuery(selectedPlant.name);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Поиск растения"
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
        <FlatList
          data={filteredPlants}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.plantItem}
              onPress={() => handleSelectPlant(item)}>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
          style={styles.plantList}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity style={styles.transparentButton} onPress={pickImage}>
          <Text style={styles.buttonText}>Выбрать изображение</Text>
        </TouchableOpacity>

        {plantImage && (
          <Image
            source={{uri: `data:image/jpeg;base64,${plantImage}`}}
            style={styles.imagePreview}
          />
        )}

        <TouchableOpacity
          style={styles.transparentButton}
          onPress={addPlant}
          disabled={isSubmitEnabled}>
          <Text style={styles.buttonText}>Сохранить</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  formContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  input: {
    height: 60,
    width: 300,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 30,
    backgroundColor: '#fff',
    paddingLeft: 20,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginBottom: 15,
    borderRadius: 8,
  },
  plantItem: {
    height: 60,
    width: 300,
    paddingTop: 20,
    borderRadius: 30,
    flex: 1,
    borderWidth: 1,
    paddingLeft: 20,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9f9',
  },
  plantList: {
    maxHeight: 250,
    marginBottom: 20,
    width: 300,
  },
  transparentButton: {
    backgroundColor: 'rgba(53,77,18, 0.6)',
    color: '#fff',
    marginBottom: 15,
    borderRadius: 30,
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
});

export default AddPlantScreen;
