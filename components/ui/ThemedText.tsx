import { Text, type TextProps } from 'react-native';
import { useTheme } from 'react-native-paper';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const theme = useTheme();

  const getTextStyle = () => {
    switch (type) {
      case 'title':
        return {
          fontSize: 24,
          fontWeight: '600' as const,
          color: theme.colors.onSurface,
        };
      case 'defaultSemiBold':
        return {
          fontSize: 16,
          fontWeight: '600' as const,
          color: theme.colors.onSurface,
        };
      case 'subtitle':
        return {
          fontSize: 14,
          fontWeight: '500' as const,
          color: theme.colors.onSurfaceVariant,
        };
      case 'link':
        return {
          fontSize: 16,
          fontWeight: '500' as const,
          color: theme.colors.primary,
          textDecorationLine: 'underline' as const,
        };
      default:
        return {
          fontSize: 16,
          fontWeight: '400' as const,
          color: theme.colors.onSurface,
        };
    }
  };

  return (
    <Text
      style={[getTextStyle(), style]}
      {...rest}
    />
  );
}
