import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Modal,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {BASE_UPLOADS_URL} from '../utils/constants';
import {fetchPlantDetails, addPlantPhoto} from '../api/plantQueries';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PlantDetailsScreen = () => {
  const [plantDetails, setPlantDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const route = useRoute();
  const {plantId} = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const details = await fetchPlantDetails(plantId);
        setPlantDetails(details);
        if (details?.name) {
          navigation.setOptions({
            title: details.name,
          });
        }
      } catch (error) {
        console.error('Error fetching plant details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [plantId]);

  const handleImagePick = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
      },
      response => {
        if (response.errorCode) {
          console.error('ImagePicker Error:', response.errorMessage);
        } else {
          handleAddPhoto(response.assets[0].base64);
        }
      },
    );
  };

  const handleAddPhoto = async imageUriToUpload => {
    if (imageUriToUpload) {
      setIsUploading(true);
      try {
        await addPlantPhoto(plantId, imageUriToUpload);
        const updatedDetails = await fetchPlantDetails(plantId);
        setPlantDetails(updatedDetails);
      } catch (error) {
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleImagePress = imageUri => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="green" />;
  }

  return (
    <View style={styles.container}>
      {plantDetails && (
        <>
          <View style={styles.mainContent}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{plantDetails.name}</Text>
              <Icon name="thermometer" size={30} color="#999" />
              <Text style={styles.temperature}>
                {plantDetails.minTemperature} - {plantDetails.maxTemperature} °C
              </Text>
              <Icon name="water" size={30} color="#999" />
              <Text style={styles.humidity}>
                {plantDetails.minHumidity} - {plantDetails.maxHumidity} %
              </Text>
            </View>
            <Image
              source={{
                uri:
                  BASE_UPLOADS_URL +
                  plantDetails.photos.find(photo => photo.main)?.image,
              }}
              style={styles.plantImage}
            />
          </View>
          <Text style={styles.detailsText}>{plantDetails.description}</Text>
        </>
      )}

      <FlatList
        data={[
          {isAddButton: true},
          ...plantDetails?.photos.filter(photo => !photo.main),
        ]}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => {
          if (item.isAddButton) {
            return (
              <TouchableOpacity
                style={styles.addImageButton}
                onPress={handleImagePick}
                disabled={isUploading}>
                <Text style={styles.addImageText}>+</Text>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              onPress={() => handleImagePress(BASE_UPLOADS_URL + item.image)}>
              <Image
                source={{uri: BASE_UPLOADS_URL + item.image}}
                style={styles.thumbnail}
              />
            </TouchableOpacity>
          );
        }}
        style={styles.thumbnailList}
      />

      {selectedImage && (
        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalBackground}
              onPress={() => setModalVisible(false)}
            />
            <View style={styles.modalContent}>
              <Image source={{uri: selectedImage}} style={styles.fullImage} />
            </View>
          </View>
        </Modal>
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
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  textContainer: {
    flex: 1,
    marginRight: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 25,
  },
  detailsText: {
    fontSize: 18,
    marginBottom: 5,
  },
  humidity: {
    fontSize: 20,
    fontWeight: '600',
    color: '#999',
  },
  temperature: {
    fontSize: 20,
    fontWeight: '600',
    color: '#999',
    marginBottom: 25,
  },
  plantImage: {
    width: 220,
    height: 220,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  thumbnail: {
    width: 100,
    height: 130,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  thumbnailList: {
    marginTop: 20,
  },
  addImageButton: {
    width: 100,
    height: 130,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addImageText: {
    fontSize: 40,
    color: '#888',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderRadius: 10,
    padding: 20,
  },
  fullImage: {
    width: 450,
    height: 600,
    resizeMode: 'contain',
  },
});

export default PlantDetailsScreen;
