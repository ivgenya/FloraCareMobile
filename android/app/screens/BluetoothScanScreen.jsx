import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {linkDeviceToRoom} from '../api/roomQueries';
import {useBleManager} from '../hook/useBleManager';

const BluetoothScanScreen = ({navigation, route}) => {
  const {scanForDevices, devices} = useBleManager();
  const [isScanning, setIsScanning] = useState(false);
  const {roomId} = route.params;

  useEffect(() => {
    const scanDevices = async () => {
      setIsScanning(true);
      await scanForDevices();
      setIsScanning(false);
    };
    scanDevices();
  }, []);

  const selectDevice = async device => {
    try {
      await linkDeviceToRoom(roomId, device.id, device.name, navigation);
      navigation.goBack();
    } catch (error) {
      console.error('Error linking device to room:', error);
    }
  };

  const renderDevice = ({item}) => (
    <TouchableOpacity
      style={styles.deviceItem}
      onPress={() => selectDevice(item)}>
      <Text style={styles.deviceName}>{item.name || 'Unnamed Device'}</Text>
      <Text style={styles.deviceId}>{item.id}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Выберите Bluetooth устройство</Text>
      {isScanning ? (
        <ActivityIndicator
          size="large"
          color="green"
          style={styles.loadingIndicator}
        />
      ) : (
        <>
          <FlatList
            data={devices}
            keyExtractor={item => item.id}
            renderItem={renderDevice}
            contentContainerStyle={styles.list}
          />
          <TouchableOpacity style={styles.scanButton} onPress={scanForDevices}>
            <Text style={styles.scanButtonText}>Сканировать снова</Text>
          </TouchableOpacity>
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
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  deviceItem: {
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deviceId: {
    fontSize: 12,
    color: '#666',
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  scanButton: {
    backgroundColor: 'rgba(53,77,18, 0.6)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default BluetoothScanScreen;
