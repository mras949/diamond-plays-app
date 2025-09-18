import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, ScrollView, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { theme } from '../constants/theme';
import { useGameData } from '../contexts/GameDataContext';

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

  // Scroll today's date into view when component mounts
  useEffect(() => {
    const today = new Date();
    const todayIndex = dateList.findIndex(date => {
      const match = date.toDateString() === today.toDateString();
      return match;
    });

    if (todayIndex !== -1 && dateScrollRef.current) {
      // More accurate calculation accounting for ScrollView padding
      const itemWidth = 70; // Actual width of date item
      const itemMargin = 4; // Margin on each side (marginHorizontal: 4 = 8px total)
      const scrollViewPadding = 8; // paddingHorizontal from dateScrollContent
      const totalItemWidth = itemWidth + (itemMargin * 2); // 70 + 8 = 78px

      // Calculate position to center the item in the viewport
      const screenWidth = Dimensions.get('window').width;
      const centerOffset = screenWidth / 2;
      const itemCenterOffset = itemWidth / 2;

      // Account for ScrollView padding in the calculation
      const scrollPosition = (todayIndex * totalItemWidth) + scrollViewPadding - centerOffset + itemCenterOffset;

      // Use multiple attempts with increasing delays to ensure proper scrolling
      const scrollToPosition = () => {
        dateScrollRef.current?.scrollTo({
          x: Math.max(0, scrollPosition),
          animated: true
        });
      };

      setTimeout(scrollToPosition, 100);
      setTimeout(scrollToPosition, 300);
      setTimeout(scrollToPosition, 600);
    }
  }, [dateList]);

  return (
    <View style={styles.dateSelectorContainer}>
      <ScrollView
        ref={dateScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.dateScrollView}
        contentContainerStyle={styles.dateScrollContent}
      >
        {dateList.map((date, index) => {
          const isSelected = date.toDateString() === selectedDate.toDateString();
          const isDisabled = !isDateSelectable(date);
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dateItem,
                isSelected && styles.dateItemSelected,
                isDisabled && styles.dateItemDisabled,
              ]}
              onPress={() => !isDisabled && setSelectedDate(date)}
              disabled={isDisabled}
            >
              <Text
                style={[
                  styles.dateItemText,
                  isSelected && styles.dateItemTextSelected,
                  isDisabled && styles.dateItemTextDisabled,
                ]}
              >
                {formatDateForDisplay(date)}
              </Text>
              <Text
                style={[
                  styles.dateItemSubText,
                  isSelected && styles.dateItemSubTextSelected,
                  isDisabled && styles.dateItemSubTextDisabled,
                ]}
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

const styles = {
  dateSelectorContainer: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.surface,
  } as ViewStyle,
  dateScrollView: {
    height: 40,
  } as ViewStyle,
  dateScrollContent: {
    paddingHorizontal: 8,
    alignItems: 'center',
  } as ViewStyle,
  dateItem: {
    width: 70,
    height: 40,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  dateItemSelected: {

  } as ViewStyle,
  dateItemDisabled: {
    opacity: 0.5,
  } as ViewStyle,
  dateItemText: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 10,
  } as TextStyle,
  dateItemTextSelected: {
    color: theme.colors.primary,
  } as TextStyle,
  dateItemTextDisabled: {
    color: theme.colors.onSurfaceVariant,
    opacity: 0.5,
  } as TextStyle,
  dateItemSubText: {
    fontSize: 10,
    color: theme.colors.onSurfaceVariant,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 10,
  } as TextStyle,
  dateItemSubTextSelected: {
    color: theme.colors.primary,
    opacity: 0.9,
  } as TextStyle,
  dateItemSubTextDisabled: {
    color: theme.colors.onSurfaceVariant,
    opacity: 0.5,
  } as TextStyle,
};

export default DateSelector;