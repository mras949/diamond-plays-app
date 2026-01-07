import { Link, Stack } from 'expo-router';

import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView className="flex-1 justify-center items-center px-6">
        <ThemedText type="title" className="mb-4">This screen does not exist.</ThemedText>
        <Link href="/" className="text-primary font-semibold">
          <ThemedText type="link">Go to home screen!</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}


