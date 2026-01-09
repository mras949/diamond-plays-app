import { DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { Dimensions, StyleSheet } from 'react-native';
import { adaptNavigationTheme, MD3DarkTheme, MD3Theme } from 'react-native-paper';

// Custom theme type that extends MD3Theme with styles
export type CustomTheme = MD3Theme & {
  styles: typeof ThemeStyles;
};

// Dark Theme Configuration
const DarkTheme = {
  ...MD3DarkTheme,
  ...adaptNavigationTheme({
    reactNavigationDark: NavigationDarkTheme,
    materialDark: MD3DarkTheme,
  }),
  colors: {
    ...MD3DarkTheme.colors,
    // Primary colors
    primary: '#3b82f6', // Blue
    primaryContainer: '#1e40af', // Darker blue
    onPrimary: '#ffffff',
    onPrimaryContainer: '#dbeafe',

    // Secondary colors
    secondary: '#64748b', // Slate
    secondaryContainer: '#334155', // Darker slate
    onSecondary: '#ffffff',
    onSecondaryContainer: '#f1f5f9',

    // Tertiary colors
    tertiary: '#f59e0b', // Amber
    tertiaryContainer: '#d97706', // Darker amber
    onTertiary: '#ffffff',
    onTertiaryContainer: '#fef3c7',

    // Error colors
    error: '#ef4444', // Red
    errorContainer: '#dc2626', // Darker red
    onError: '#ffffff',
    onErrorContainer: '#fecaca',

    // Background colors
    background: '#0a0f1c', // Very dark blue-gray
    onBackground: '#f8fafc', // Light text on dark background
    surface: '#1e293b', // Dark blue-gray surface
    onSurface: '#f1f5f9', // Light text on surface
    surfaceVariant: '#334155', // Variant surface
    onSurfaceVariant: '#cbd5e1', // Muted text on surface variant

    // Surface containers
    surfaceDisabled: '#475569',
    onSurfaceDisabled: '#94a3b8',

    // Outline
    outline: '#64748b',
    outlineVariant: '#475569',

    // Inverse colors (for special cases)
    inverseSurface: '#f8fafc',
    inverseOnSurface: '#0f172a',
    inversePrimary: '#1d4ed8',

    // Elevation overlays
    elevation: {
      level0: 'transparent',
      level1: 'rgba(15, 23, 42, 0.05)',
      level2: 'rgba(15, 23, 42, 0.08)',
      level3: 'rgba(15, 23, 42, 0.11)',
      level4: 'rgba(15, 23, 42, 0.12)',
      level5: 'rgba(15, 23, 42, 0.14)',
    },

    // Custom colors for the app
    card: '#1e293b',
    border: '#334155',
    input: '#334155',
    ring: '#3b82f6',
    success: '#10b981', // Emerald
    warning: '#f59e0b', // Amber
    info: '#06b6d4', // Cyan
  },
  fonts: {
    ...MD3DarkTheme.fonts,
    // Use DM Sans font family
    displayLarge: {
      ...MD3DarkTheme.fonts.displayLarge,
      fontFamily: 'DMSans-Bold',
    },
    displayMedium: {
      ...MD3DarkTheme.fonts.displayMedium,
      fontFamily: 'DMSans-Bold',
    },
    displaySmall: {
      ...MD3DarkTheme.fonts.displaySmall,
      fontFamily: 'DMSans-Bold',
    },
    headlineLarge: {
      ...MD3DarkTheme.fonts.headlineLarge,
      fontFamily: 'DMSans-Bold',
    },
    headlineMedium: {
      ...MD3DarkTheme.fonts.headlineMedium,
      fontFamily: 'DMSans-Bold',
    },
    headlineSmall: {
      ...MD3DarkTheme.fonts.headlineSmall,
      fontFamily: 'DMSans-Bold',
    },
    titleLarge: {
      ...MD3DarkTheme.fonts.titleLarge,
      fontFamily: 'DMSans-Bold',
    },
    titleMedium: {
      ...MD3DarkTheme.fonts.titleMedium,
      fontFamily: 'DMSans-Medium',
    },
    titleSmall: {
      ...MD3DarkTheme.fonts.titleSmall,
      fontFamily: 'DMSans-Medium',
    },
    bodyLarge: {
      ...MD3DarkTheme.fonts.bodyLarge,
      fontFamily: 'DMSans-Regular',
    },
    bodyMedium: {
      ...MD3DarkTheme.fonts.bodyMedium,
      fontFamily: 'DMSans-Regular',
    },
    bodySmall: {
      ...MD3DarkTheme.fonts.bodySmall,
      fontFamily: 'DMSans-Regular',
    },
    labelLarge: {
      ...MD3DarkTheme.fonts.labelLarge,
      fontFamily: 'DMSans-Medium',
    },
    labelMedium: {
      ...MD3DarkTheme.fonts.labelMedium,
      fontFamily: 'DMSans-Medium',
    },
    labelSmall: {
      ...MD3DarkTheme.fonts.labelSmall,
      fontFamily: 'DMSans-Regular',
    },
  },
};

// Standardized styles for consistent UI components
const ThemeStyles = {
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Border radius
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
  },

  // Shadows/Elevation
  elevation: {
    sm: {
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    md: {
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    lg: {
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
  },

  // Common component styles
  components: {
    // Screen containers
    screen: {
      flex: 1,
      backgroundColor: DarkTheme.colors.background,
    },

    // Cards
    card: {
      backgroundColor: DarkTheme.colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: DarkTheme.colors.outline,
      padding: 16,
      marginVertical: 4,
      marginHorizontal: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },

    // Buttons
    button: {
      borderRadius: 8,
      marginBottom: 16,
    },

    // Inputs
    input: {
      marginBottom: 16,
    },

    // Text styles
    text: {
      title: {
        fontSize: 32,
        fontWeight: 'bold' as const,
        textAlign: 'center' as const,
        color: DarkTheme.colors.onSurface,
      },
      titlethin: {
        fontSize: 32,
        fontWeight: '100' as const,
        textAlign: 'center' as const,
        color: DarkTheme.colors.onSurface,
      },
      logo: {
        fontSize: 28,
        fontWeight: 'bold' as const,
        textAlign: 'center' as const,
        color: DarkTheme.colors.onSurface,
      },
      logothin: {
        fontSize: 28,
        fontWeight: '100' as const,
        textAlign: 'center' as const,
        color: DarkTheme.colors.onSurface,
      },
      subtitle: {
        fontSize: 24,
        fontWeight: '600' as const,
        textAlign: 'center' as const,
        color: DarkTheme.colors.onSurface,
      },
      body: {
        fontSize: 16,
        fontWeight: '400' as const,
        color: DarkTheme.colors.onSurface,
      },
      caption: {
        fontSize: 14,
        fontWeight: '400' as const,
        color: DarkTheme.colors.onSurfaceVariant,
      },
      error: {
        fontSize: 14,
        fontWeight: '500' as const,
        color: DarkTheme.colors.error,
        textAlign: 'center' as const,
      },
      success: {
        fontSize: 14,
        fontWeight: '500' as const,
        color: DarkTheme.colors.success,
        textAlign: 'center' as const,
      },
    },

    // Layout patterns
    centerContainer: {
      flex: 1,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      padding: 20,
    },

    // Overlays
    overlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      zIndex: 1000,
    },

    // Game-specific styles
    game: {
      teamSection: {
        flex: 1,
        alignItems: 'center' as const,
      },
      teamCity: {
        fontSize: 12,
        fontWeight: '400' as const,
        textAlign: 'center' as const,
        marginBottom: 2,
        color: DarkTheme.colors.onSurfaceVariant,
      },
      teamName: {
        fontSize: 16,
        fontWeight: '600' as const,
        textAlign: 'center' as const,
        marginBottom: 4,
        color: DarkTheme.colors.onSurface,
      },
      playerSelection: {
        fontSize: 12,
        fontWeight: '500' as const,
        textAlign: 'center' as const,
        color: DarkTheme.colors.primary,
      },
      noSelection: {
        fontSize: 12,
        fontWeight: '400' as const,
        textAlign: 'center' as const,
        color: DarkTheme.colors.onSurfaceDisabled,
      },
      status: {
        flex: 1,
        alignItems: 'center' as const,
        paddingHorizontal: 8,
      },
      statusText: {
        fontSize: 14,
        fontWeight: '600' as const,
        textAlign: 'center' as const,
        marginBottom: 2,
        color: DarkTheme.colors.primary,
      },
      timeText: {
        fontSize: 12,
        fontWeight: '400' as const,
        textAlign: 'center' as const,
        color: DarkTheme.colors.onSurfaceVariant,
      },
    },
    // Player list styles
    player: {
      listContainer: {
        flex: 1,
      },
      playerRow: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        padding: 12,
        marginHorizontal: 8,
        marginVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        minHeight: 60,
      },
      playerInfo: {
        flex: 1,
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
      },
      battingOrderContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        marginRight: 12,
      },
      battingOrder: {
        fontSize: 14,
        fontWeight: '600' as const,
      },
      playerDetails: {
        flex: 1,
      },
      playerName: {
        fontSize: 16,
        fontWeight: '500' as const,
        marginBottom: 2,
      },
      playerPosition: {
        fontSize: 12,
        fontWeight: '400' as const,
      },
      selectionIndicator: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        marginLeft: 8,
      },
      checkmark: {
        fontSize: 14,
        fontWeight: '600' as const,
      },
      loadingIndicator: {
        marginLeft: 8,
      },
      centerContainer: {
        flex: 1,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        padding: 20,
      },
      errorText: {
        fontSize: 16,
        fontWeight: '500' as const,
        textAlign: 'center' as const,
        marginBottom: 16,
      },
      retryButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
      },
      retryText: {
        fontSize: 14,
        fontWeight: '600' as const,
      },
      emptyText: {
        fontSize: 16,
        fontWeight: '500' as const,
        textAlign: 'center' as const,
      },
      separator: {
        height: 1,
        marginHorizontal: 8,
      },
    },
    // List styles
    list: {
      container: {
        flex: 1,
      },
      contentContainer: {
        paddingBottom: 20,
      },
      emptyContainer: {
        flex: 1,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        paddingBottom: 100,
      },
      emptyState: {
        alignItems: 'center' as const,
        paddingVertical: 40,
        paddingHorizontal: 20,
      },
      emptyText: {
        fontSize: 16,
        fontWeight: '500' as const,
        textAlign: 'center' as const,
      },
    },

    // Form styles
    form: {
      container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center' as const,
      },
      header: {
        alignItems: 'center' as const,
        marginBottom: 48,
      },
      content: {
        flex: 1,
      },
      link: {
        fontSize: 16,
        textAlign: 'center' as const,
        textDecorationLine: 'underline' as const,
        color: DarkTheme.colors.primary,
      },
      dateSelector: {
        container: {
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: DarkTheme.colors.outline,
        },
        scrollView: {
          height: 60,
        },
        scrollContent: {
          alignItems: 'center' as const,
          paddingHorizontal: 8,
        },
        dateItem: {
          width: 70,
          height: 50,
          marginHorizontal: 4,
          borderRadius: 8,
          alignItems: 'center' as const,
          justifyContent: 'center' as const,
          paddingVertical: 4,
        },
        selectedDateItem: {
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        disabledDateItem: {
          opacity: 0.5,
        },
        dateText: {
          fontSize: 14,
          fontWeight: '600' as const,
          textAlign: 'center' as const,
          marginBottom: 2,
        },
        dayText: {
          fontSize: 12,
          textAlign: 'center' as const,
          opacity: 0.8,
        },
        selectedText: {
          fontWeight: '700' as const,
        },
        disabledText: {
          opacity: 0.5,
        },
      },
    },

    // Modal styles
    modal: {
      container: {
        flex: 1,
        justifyContent: 'flex-end' as const,
      },
      wrapper: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end' as const,
        zIndex: 10,
      },
      content: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 24,
        paddingBottom: 40,
        minHeight: 300,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        zIndex: 2,
      },
      handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        alignSelf: 'center' as const,
        marginBottom: 16,
        backgroundColor: DarkTheme.colors.onSurfaceDisabled,
      },
      blurView: {
        ...StyleSheet.absoluteFillObject,
      },
      backdrop: {
        ...StyleSheet.absoluteFillObject,
      },
      backdropTouchable: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
      },
      keyboardAvoidingView: {
        flex: 1,
      },
      title: {
        fontSize: 24,
        fontWeight: '600' as const,
        textAlign: 'center' as const,
        marginBottom: 24,
      },
      input: {
        marginBottom: 16,
      },
      successText: {
        fontSize: 14,
        fontWeight: '500' as const,
        marginBottom: 16,
        textAlign: 'center' as const,
      },
      errorText: {
        fontSize: 14,
        fontWeight: '500' as const,
        marginBottom: 16,
        textAlign: 'center' as const,
      },
      button: {
        marginTop: 8,
        marginBottom: 16,
        borderRadius: 8,
      },
      switchContainer: {
        alignItems: 'center' as const,
        paddingVertical: 8,
      },
      switchText: {
        fontSize: 14,
        textAlign: 'center' as const,
      },
      switchLink: {
        fontWeight: '600' as const,
      },
    },

    // Navigation styles
    navigation: {
      sidebar: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        bottom: 0,
        width: Dimensions.get('window').width * 0.75,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      header: {
        padding: 20,
        paddingTop: 60,
        borderBottomWidth: 1,
        borderBottomColor: DarkTheme.colors.outline,
      },
      headerText: {
        fontSize: 20,
        fontWeight: '600' as const,
        color: DarkTheme.colors.onSurface,
      },
      content: {
        flex: 1,
        padding: 20,
      },
      menuItem: {
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 12,
        alignItems: 'center' as const,
      },
      menuItemText: {
        fontSize: 16,
        fontWeight: '500' as const,
      },
    },
  },
};

// Enhanced theme with styles
export const theme: CustomTheme = {
  ...DarkTheme,
  styles: ThemeStyles,
};

// Export the theme for use throughout the app
export { DarkTheme };

// Custom hook to use our enhanced theme
export const useCustomTheme = (): CustomTheme => {
  return theme;
};

// Type for theme colors
export type ThemeColors = typeof DarkTheme.colors;

// Type for theme styles
export type ThemeStylesType = typeof ThemeStyles;