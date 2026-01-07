import React from 'react';
import { Animated, Dimensions, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

const { width } = Dimensions.get('window');

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
  onLogout: () => void;
  logoutLoading: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isVisible,
  onClose,
  onLogout,
  logoutLoading,
}) => {
  const slideAnim = React.useRef(new Animated.Value(-width * 0.75)).current;
  const [isRendered, setIsRendered] = React.useState(false);

  React.useEffect(() => {
    if (isVisible) {
      setIsRendered(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width * 0.75,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsRendered(false);
      });
    }
  }, [isVisible, slideAnim]);

  if (!isRendered) return null;

  return (
    <>
      {/* Backdrop */}
      <TouchableOpacity
        className="absolute inset-0 bg-black bg-opacity-50"
        activeOpacity={1}
        onPress={onClose}
      />

      {/* Sidebar */}
      <Animated.View className="absolute left-0 top-0 bottom-0 w-3/4 bg-surface border-r border-outline" style={{ transform: [{ translateX: slideAnim }] }}>
        <View className="p-4 border-b border-outline">
          <Text className="text-lg font-bold text-text">Menu</Text>
        </View>

        <View className="flex-1 p-4">
          <TouchableOpacity
            className="py-3 px-4 rounded-md bg-error"
            onPress={onLogout}
            disabled={logoutLoading}
          >
            <Text className={`text-white font-semibold ${logoutLoading ? 'opacity-50' : ''}`}>
              {logoutLoading ? 'Logging out...' : 'Logout'}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
};