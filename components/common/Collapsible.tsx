import { PropsWithChildren, useState } from 'react';
import { TouchableOpacity } from 'react-native';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ThemedView>
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        accessibilityRole="button">
        <IconSymbol
          name={isOpen ? 'chevron.down' : 'chevron.right'}
          size={18}
          color="#3b82f6"
        />

        <ThemedText type="link">{title}</ThemedText>
      </TouchableOpacity>
      {isOpen && (
        <ThemedView>
          {children}
        </ThemedView>
      )}
    </ThemedView>
  );
}
