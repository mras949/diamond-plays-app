import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#3b82f6', // Blue-500 (Shadcn primary)
    background: '#ffffff', // Zinc-100
    surface: '#ffffff', // White for cards
    text: '#18181b', // Zinc-900
    secondary: '#71717a', // Zinc-500
    error: '#ef4444', // Red-500
    accent: '#10b981', // Emerald-500
  },
  fonts: {
    ...MD3LightTheme.fonts,
    bodyLarge: { fontFamily: 'DMSans-Regular', fontWeight: '400' as const, fontSize: 14 },
    bodyMedium: { fontFamily: 'DMSans-Regular', fontWeight: '400' as const, fontSize: 12 },
    bodySmall: { fontFamily: 'DMSans-Regular', fontWeight: '400' as const, fontSize: 10 },
    labelLarge: { fontFamily: 'DMSans-Medium', fontWeight: '500' as const, fontSize: 12 },
    labelMedium: { fontFamily: 'DMSans-Medium', fontWeight: '500' as const, fontSize: 14 },
    labelSmall: { fontFamily: 'DMSans-Medium', fontWeight: '500' as const, fontSize: 8 },
    headlineLarge: { fontFamily: 'DMSans-Bold', fontWeight: '700' as const, fontSize: 30 },
    headlineMedium: { fontFamily: 'DMSans-Bold', fontWeight: '700' as const, fontSize: 22 },
    headlineSmall: { fontFamily: 'DMSans-Bold', fontWeight: '700' as const, fontSize: 18 },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
  },
  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
  },
  components: {
    // Common layout styles
    container: {
      flex: 1, // theme.colors.background
      backgroundColor: '#ffffff',
    },
    scrollContainer: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    contentContainer: {
      padding: 16, // theme.spacing.md
    },

    // Loading states
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center', // theme.colors.background
      backgroundColor: '#ffffff',
    },

    // Empty states
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24, // theme.spacing.lg
    },
    emptyText: {
      fontSize: 16, // theme.fonts.bodyLarge.fontSize
      fontFamily: 'DMSans-Regular', // theme.fonts.bodyLarge.fontFamily
      color: '#71717a', // theme.colors.secondary
      textAlign: 'center',
    },

    // Game/Accordion styles
    accordion: {
      marginBottom: 16, // theme.spacing.md
    },
    expandedContent: {
      padding: 0, // theme.spacing.md
    },

    // Tab styles
    tabViewContainer: {
      height: 350,
      marginTop: 8, // theme.spacing.sm
      backgroundColor: '#ffffff',
    },
    tabBar: {
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 1,
      borderBottomColor: '#e5e5e5', // theme.colors.outline (assuming default)
      height: 48,
      backgroundColor: '#ffffff',
    },
    tabIndicator: {
      backgroundColor: '#3b82f6', // theme.colors.primary
      height: 2,
    },
    tabView: {
      flex: 1,
    },
    tabContent: {
      flex: 1,
      padding: 0, // theme.spacing.sm
      backgroundColor: '#ffffff',
    },

    // Player list styles
    playerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 8, // theme.spacing.sm
      borderBottomWidth: 1,
      borderBottomColor: '#e5e5e5', // theme.colors.secondary
      backgroundColor: '#ffffff',
    },
    playerInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    battingOrder: {
      width: 30,
      textAlign: 'center',
      fontFamily: 'DMSans-Regular', // theme.fonts.bodyMedium.fontFamily
      fontSize: 12, // theme.fonts.bodyMedium.fontSize
      color: '#71717a', // theme.colors.secondary
    },
    playerName: {
      flex: 1,
      marginLeft: 8, // theme.spacing.sm
      fontFamily: 'DMSans-Regular', // theme.fonts.bodyLarge.fontFamily
      fontSize: 12, // theme.fonts.bodyLarge.fontSize
      color: '#18181b', // theme.colors.text
    },
    playerPosition: {
      width: 50,
      textAlign: 'right',
      fontFamily: 'DMSans-Regular', // theme.fonts.bodyMedium.fontFamily
      fontSize: 12, // theme.fonts.bodyMedium.fontSize
      color: '#71717a', // theme.colors.secondary
    },

    // Date selector
    dateSelectorContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16, // theme.spacing.md
      backgroundColor: '#ffffff', // theme.colors.background
    },
  },
};