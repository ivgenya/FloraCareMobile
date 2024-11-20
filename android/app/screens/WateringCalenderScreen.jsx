import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, FlatList, TouchableOpacity} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {fetchWateringSchedule, markWatering} from '../api/calendarQueries';

LocaleConfig.locales.ru = {
  monthNames: [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ],
  monthNamesShort: [
    'Янв',
    'Фев',
    'Мар',
    'Апр',
    'Май',
    'Июн',
    'Июл',
    'Авг',
    'Сен',
    'Окт',
    'Ноя',
    'Дек',
  ],
  dayNames: [
    'воскресенье',
    'понедельник',
    'вторник',
    'среда',
    'четверг',
    'пятница',
    'суббота',
  ],
  dayNamesShort: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  today: 'Сегодня',
};
LocaleConfig.defaultLocale = 'ru';

const WateringCalendarScreen = () => {
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [plantsForSelectedDate, setPlantsForSelectedDate] = useState([]);
  const [showWateringButton, setShowWateringButton] = useState(false);

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    const schedule = await fetchWateringSchedule();
    setMarkedDates(schedule);
  };

  const handleDayPress = day => {
    const dateInfo = markedDates[day.dateString];
    setSelectedDate(day.dateString);
    setShowWateringButton(true);

    if (dateInfo && dateInfo.isWatered) {
      setPlantsForSelectedDate([]);
      setShowWateringButton(false);
    } else if (dateInfo && dateInfo.plants) {
      setPlantsForSelectedDate(dateInfo.plants);
    } else {
      setPlantsForSelectedDate([]);
    }
  };

  const handleMarkWatering = async () => {
    try {
      await markWatering(selectedDate);
      setMarkedDates(prevMarkedDates => ({
        ...prevMarkedDates,
        [selectedDate]: {
          ...prevMarkedDates[selectedDate],
          isWatered: true,
        },
      }));

      setPlantsForSelectedDate([]);
      setShowWateringButton(false);
      await loadSchedule();
    } catch (error) {
      console.error('Ошибка при отметке полива:', error);
      alert('Ошибка при отметке полива');
    }
  };

  const getMarkedDateStyle = date => {
    const dateInfo = markedDates[date];
    if (dateInfo?.isWatered) {
      return {
        selected: true,
        selectedColor: 'green',
        selectedTextColor: 'white',
      };
    }
    return {
      selected: true,
      selectedColor: 'blue',
      selectedTextColor: 'white',
    };
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Календарь полива</Text>
      <Calendar
        markingType={'custom'}
        markedDates={Object.keys(markedDates).reduce((acc, date) => {
          acc[date] = getMarkedDateStyle(date);
          return acc;
        }, {})}
        onDayPress={handleDayPress}
        locale={'ru'}
        firstDay={1}
      />

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>
          {selectedDate
            ? `Растения для полива на ${selectedDate}:`
            : 'Выберите дату для полива'}
        </Text>

        {plantsForSelectedDate.length > 0 ? (
          <FlatList
            data={plantsForSelectedDate}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({item}) => (
              <Text style={styles.plantItem}>{item}</Text>
            )}
          />
        ) : (
          <Text style={styles.noPlantsText}>
            {selectedDate && markedDates[selectedDate]?.isWatered
              ? 'Полив уже был отмечен'
              : 'Нет растений для полива'}
          </Text>
        )}
      </View>

      {showWateringButton && !markedDates[selectedDate]?.isWatered && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.transparentButton}
            onPress={handleMarkWatering}>
            <Text style={styles.buttonText}>Отметить полив</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  listContainer: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 3,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  plantItem: {
    fontSize: 14,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  noPlantsText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#999',
  },
  buttonContainer: {
    marginTop: 20,
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

export default WateringCalendarScreen;
