import {BleManager} from 'react-native-ble-plx';
import {Buffer} from 'buffer';
import {useState} from 'react';

const TEMPERATURE_SERVICE_UUID = 'ebe0ccb0-7a0a-4b0c-8a1a-6ff2997da3a6';
const TEMPERATURE_CHARACTERISTIC_UUID = 'ebe0ccc1-7a0a-4b0c-8a1a-6ff2997da3a6';

export const useBleManager = () => {
  const [bleManager] = useState(new BleManager());
  const [devices, setDevices] = useState([]);
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);

  const scanForDevices = () => {
    console.log('start use blemanager');
    setDevices([]);
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        return;
      }
      if (device && device.name && device.name === 'LYWSD03MMC') {
        setDevices(prevDevices => {
          if (prevDevices.find(d => d.id === device.id)) {
            return prevDevices;
          }
          return [...prevDevices, device];
        });
      }
    });

    setTimeout(() => {
      console.log('stop ble manager');
      bleManager.stopDeviceScan();
    }, 20000);
  };

  const connectAndMonitorTemperature = async device => {
    try {
      console.log('connection ' + device?.name);
      const connectedDevice = await device.connect();
      await connectedDevice.discoverAllServicesAndCharacteristics();

      const services = await connectedDevice.services();
      const temperatureService = services.find(
        service => service.uuid === TEMPERATURE_SERVICE_UUID,
      );
      if (!temperatureService) {
        console.error('Temperature service not found');
        return;
      }

      const characteristics = await connectedDevice.characteristicsForService(
        temperatureService.uuid,
      );
      const temperatureCharacteristic = characteristics.find(
        char => char.uuid === TEMPERATURE_CHARACTERISTIC_UUID,
      );

      if (!temperatureCharacteristic) {
        console.error('Temperature characteristic not found');
        return;
      }

      const characteristicValue = await temperatureCharacteristic.read();
      try {
        await connectedDevice.cancelConnection();
        console.log('Device disconnected successfully');
      } catch (error) {
        console.error('Error while disconnecting device', error);
      }

      if (characteristicValue?.value) {
        const temperatureValue = parseTemperature(characteristicValue.value);
        const humidityValue = parseHumidity(characteristicValue.value);
        setTemperature(temperatureValue);
        setHumidity(humidityValue);
        console.log(temperatureValue);
        console.log(humidityValue);
      } else {
        console.error('Failed to read characteristic value');
      }
      console.log('Отключение');
    } catch (error) {}
  };

  const parseTemperature = value => {
    const buffer = Buffer.from(value, 'base64');
    const tempData = buffer.readUInt16LE(0);
    return tempData / 100;
  };

  const parseHumidity = value => {
    const buffer = Buffer.from(value, 'base64');
    return buffer.readUInt8(2);
  };

  return {
    devices,
    temperature,
    humidity,
    scanForDevices,
    connectAndMonitorTemperature,
  };
};
