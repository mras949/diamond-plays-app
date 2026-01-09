import { View, type ViewProps } from 'react-native';
import { useTheme } from 'react-native-paper';

export type ThemedViewProps = ViewProps & {
  type?: 'default' | 'surface' | 'surfaceVariant' | 'background';
};

export function ThemedView({
  style,
  type = 'default',
  ...otherProps
}: ThemedViewProps) {
  const theme = useTheme();

  const getBackgroundColor = () => {
    switch (type) {
      case 'surface':
        return { backgroundColor: theme.colors.surface };
      case 'surfaceVariant':
        return { backgroundColor: theme.colors.surfaceVariant };
      case 'background':
        return { backgroundColor: theme.colors.background };
      default:
        return {};
    }
  };

  return <View style={[getBackgroundColor(), style]} {...otherProps} />;
}
