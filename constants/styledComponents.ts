import { ScrollView as RNScrollView, Text as RNText, View as RNView } from 'react-native';

// For NativeWind v4, we need to wrap components in a way that respects className
// The Babel preset will handle className conversion, but we need to ensure proper export

export const View = RNView as any;
export const Text = RNText as any;
export const ScrollView = RNScrollView as any;
