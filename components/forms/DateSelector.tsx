import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, ScrollView, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useGameData } from '../../contexts/GameDataContext';

const DateSelector: React.FC = () => {
  const { selectedDate, setSelectedDate } = useGameData();

  const dateScrollRef = useRef<ScrollView>(null);
  const currentDateKeyRef = useRef<string>('');

  // Generate dates for horizontal scrolling (7 days before and after selected date)
  const generateDateList = (centerDate: Date) => {
    const dates = [];
    for (let i = -7; i <= 7; i++) {
      const date = new Date(centerDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const [dateList, setDateList] = useState<Date[]>(() => generateDateList(selectedDate));

  // Update dateList only when selectedDate actually changes
  useEffect(() => {
    const newDateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`;
    if (newDateKey !== currentDateKeyRef.current) {
      currentDateKeyRef.current = newDateKey;
      setDateList(generateDateList(selectedDate));
    }
  }, [selectedDate]);

  const formatDateForDisplay = useCallback((date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }, []);

  const isDateSelectable = useCallback((date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate.getTime() <= today.getTime();
  }, []);

  // Scroll selected date into view when component mounts or selectedDate changes
  useEffect(() => {
    const selectedDateIndex = dateList.findIndex(date => {
      const match = date.toDateString() === selectedDate.toDateString();
      return match;
    });

    if (selectedDateIndex !== -1 && dateScrollRef.current) {
      // More accurate calculation accounting for ScrollView padding
      const itemWidth = 70; // Actual width of date item
      const itemMargin = 4; // Margin on each side (marginHorizontal: 4 = 8px total)
      const scrollViewPadding = 8; // paddingHorizontal from dateScrollContent
      const totalItemWidth = itemWidth + (itemMargin * 2); // 70 + 8 = 78px

      // Calculate position to center the item in the viewport
      const screenWidth = Dimensions.get('window').width;
      const centerOffset = screenWidth / 2;
      const itemCenterOffset = itemWidth - (scrollViewPadding*2);

      // Account for ScrollView padding in the calculation
      const scrollPosition = (selectedDateIndex * totalItemWidth) + scrollViewPadding - centerOffset + itemCenterOffset;

      // Use multiple attempts with increasing delays to ensure proper scrolling
      const scrollToPosition = () => {
        dateScrollRef.current?.scrollTo({
          x: Math.max(0, scrollPosition),
          animated: true
        });
      };

      setTimeout(scrollToPosition, 100);
    }
  }, [dateList, selectedDate]);

  return (
    <View className="py-1 px-4 bg-surface">
      <ScrollView
        ref={dateScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        className="h-10"
        contentContainerStyle={{ paddingHorizontal: 8, alignItems: 'center' }}
      >
        {dateList.map((date, index) => {
          const isSelected = date.toDateString() === selectedDate.toDateString();
          const isDisabled = !isDateSelectable(date);
          
          return (
            <TouchableOpacity
              key={index}
              className={`w-18 h-10 mx-1 items-center justify-center ${
                isDisabled ? 'opacity-50' : ''
              }`}
              onPress={() => !isDisabled && setSelectedDate(date)}
              disabled={isDisabled}
            >
              <Text
                className={`text-xs font-semibold text-center leading-2.5 ${
                  isSelected ? 'text-primary' : 'text-onSurfaceVariant'
                } ${isDisabled ? 'opacity-50' : ''}`}
              >
                {formatDateForDisplay(date)}
              </Text>
              <Text
                className={`text-xs text-center mt-0.5 leading-2.5 ${
                  isSelected ? 'text-primary opacity-90' : 'text-onSurfaceVariant opacity-70'
                } ${isDisabled ? 'opacity-50' : ''}`}
              >
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};



export default DateSelector;