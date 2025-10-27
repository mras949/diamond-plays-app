import { PropsWithChildren, useState } from 'react';
import { TouchableOpacity } from 'react-native';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { Colors } from '@/constants/Colors';
import { theme as appTheme } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? 'light';

  return (
    <ThemedView>
      <TouchableOpacity
        style={appTheme.components.collapsibleHeading}
        onPress={() => setIsOpen(!isOpen)}
        accessibilityRole="button">
        <IconSymbol
          name={isOpen ? 'chevron.down' : 'chevron.right'}
          size={18}
          color={Colors[theme].text}
        />

        <ThemedText type="link">{title}</ThemedText>
      </TouchableOpacity>
      {isOpen && (
        <ThemedView style={appTheme.components.collapsibleContent}>
          {children}
        </ThemedView>
      )}
    </ThemedView>
  );
}
