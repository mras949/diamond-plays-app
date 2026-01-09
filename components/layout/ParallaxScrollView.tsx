import type { PropsWithChildren, ReactElement } from 'react';
import { ScrollView } from 'react-native';
import Animated, {
    useAnimatedRef,
    useScrollViewOffset
} from 'react-native-reanimated';

import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import { ThemedView } from '@/components/ui/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const bottom = useBottomTabOverflow();


  return (
    <ThemedView>
      <Animated.View>
        {headerImage}
      </Animated.View>
      <ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ top: HEADER_HEIGHT - 10 }}
        bounces={false}
      >
        {children}
      </ScrollView>
    </ThemedView>
  );
}
