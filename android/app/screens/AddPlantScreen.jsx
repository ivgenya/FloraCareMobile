import React, {useState, useCallback, useEffect} from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  FlatList,
  TouchableOpacity,
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

  let debouncedSearch;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  debouncedSearch = useCallback(
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
      await createPlant(plantData, navigation);
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
    setFilteredPlants([]);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.plantItem}
      onPress={() => handleSelectPlant(item)}>
      <Text style={styles.plantText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <>
          <View style={styles.mainContent}>
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
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                style={styles.plantList}
              />
            </View>

            <View style={styles.fixedButtons}>
              <TouchableOpacity
                style={styles.transparentButton}
                onPress={pickImage}>
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
            </View>
          </View>
        </>
      }
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{flexGrow: 1}}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  formContainer: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  input: {
    height: 60,
    width: '90%',
    borderColor: '#ccc',
    borderWidth: 1,
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
  plantItem: {
    height: 60,
    width: '90%',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingLeft: 20,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
    justifyContent: 'flex-start',
    paddingRight: 20,
  },
  plantList: {
    maxHeight: 400,
    height: 400,
    width: '100%',
    alignItems: 'center',
  },
  transparentButton: {
    backgroundColor: 'rgba(53,77,18, 0.6)',
    color: '#fff',
    marginBottom: 15,
    borderRadius: 10,
    width: '90%',
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
  fixedButtons: {
    paddingBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  plantText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingLeft: 10,
  },
});

export default AddPlantScreen;
