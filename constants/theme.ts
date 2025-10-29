import { Platform, StyleSheet, TextStyle, ViewStyle } from 'react-native';
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
      padding: 8, // theme.spacing.md
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

    // Sidebar styles
    sidebar: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      backgroundColor: '#ffffff', // theme.colors.surface
      zIndex: 2001,
      paddingTop: 50, // Account for status bar
    } as ViewStyle,
    sidebarBackdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 2000,
    } as ViewStyle,
    sidebarHeader: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#e5e5e5', // theme.colors.outline
    } as ViewStyle,
    sidebarTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#18181b', // theme.colors.onSurface
    } as TextStyle,
    sidebarMenuItems: {
      flex: 1,
      padding: 10,
    } as ViewStyle,
    sidebarMenuItem: {
      padding: 15,
      borderRadius: 8,
      backgroundColor: '#f8f9fa', // theme.colors.surfaceVariant
      marginBottom: 10,
    } as ViewStyle,
    sidebarMenuText: {
      fontSize: 16,
      color: '#18181b', // theme.colors.onSurface
    } as TextStyle,
    sidebarMenuTextDisabled: {
      color: '#9ca3af', // theme.colors.onSurfaceDisabled
    } as TextStyle,

    // Modal styles
    modalContainer: {
      flex: 1,
      backgroundColor: 'transparent',
    } as ViewStyle,
    modalBackdrop: {
      ...StyleSheet.absoluteFillObject,
    } as ViewStyle,
    modalWrapper: {
      flex: 1,
      justifyContent: 'flex-end',
    } as ViewStyle,
    modalContent: {
      backgroundColor: '#ffffff',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 24,
      paddingBottom: Platform.OS === 'ios' ? 40 : 24,
      maxHeight: '100%',
      width: '100%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
    } as ViewStyle,
    modalHandleContainer: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      alignItems: 'center',
      marginBottom: 10,
    } as ViewStyle,
    modalHandle: {
      width: 40,
      height: 4,
      backgroundColor: '#e0e0e0',
      borderRadius: 2,
      alignSelf: 'center',
    } as ViewStyle,
    modalTitle: {
      fontSize: 24,
      fontWeight: '200',
      color: '#000000',
      textAlign: 'center',
      marginBottom: 20,
    } as TextStyle,
    modalInput: {
      fontSize: 14,
      marginBottom: 10,
      backgroundColor: '#ffffff',
    } as TextStyle,
    modalError: {
      color: '#ef4444', // theme.colors.error
      textAlign: 'center',
      marginBottom: 15,
      fontSize: 14,
    } as TextStyle,
    modalSuccessText: {
      color: '#10b981', // theme.colors.accent
      textAlign: 'center',
      fontSize: 14,
      marginBottom: 10,
      fontWeight: '500',
    } as TextStyle,
    modalValidationError: {
      color: '#f97316', // Orange for validation errors
    } as TextStyle,
    modalServerError: {
      color: '#ef4444', // theme.colors.error
    } as TextStyle,
    modalButton: {
      marginVertical: 10,
      backgroundColor: '#3b82f6', // theme.colors.primary
    } as ViewStyle,
    modalSwitchContainer: {
      alignItems: 'center',
      marginTop: 15,
    } as ViewStyle,
    modalSwitchText: {
      color: '#6b7280',
      fontSize: 14,
    } as TextStyle,
    modalSwitchLink: {
      color: '#3b82f6', // theme.colors.primary
      fontWeight: '600',
    } as TextStyle,

    // Collapsible styles
    collapsibleHeading: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    } as ViewStyle,
    collapsibleContent: {
      marginTop: 6,
      marginLeft: 24,
    } as ViewStyle,

    // HelloWave styles
    helloWaveText: {
      fontSize: 28,
      lineHeight: 32,
      marginTop: -6,
    } as TextStyle,

    // ParallaxScrollView styles
    parallaxContainer: {
      flex: 1,
    } as ViewStyle,
    parallaxHeader: {
      height: 250, // HEADER_HEIGHT
      overflow: 'hidden',
    } as ViewStyle,
    parallaxContent: {
      flex: 1,
      padding: 32,
      gap: 16,
      overflow: 'hidden',
    } as ViewStyle,

    // Enhanced text styles (building on existing)
    textDefault: {
      fontSize: 16,
      lineHeight: 24,
    } as TextStyle,
    textDefaultSemiBold: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600',
    } as TextStyle,
    textTitle: {
      fontSize: 32,
      fontWeight: 'bold',
      lineHeight: 32,
    } as TextStyle,
    textSubtitle: {
      fontSize: 20,
      fontWeight: 'bold',
    } as TextStyle,
    textLink: {
      lineHeight: 30,
      fontSize: 16,
      color: '#0a7ea4',
    } as TextStyle,

    // GameAccordion styles
    gameAccordionContainer: {
      marginVertical: 4,
      backgroundColor: '#ffffff', // theme.colors.surface
      borderRadius: 8,
      overflow: 'hidden',
    } as ViewStyle,
    gameAccordionTrigger: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: '#ffffff', // theme.colors.surface
    } as ViewStyle,
    gameAccordionTriggerExpanded: {
      borderBottomWidth: 0,
    } as ViewStyle,
    gameAccordionTriggerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
    } as ViewStyle,
    gameAccordionHomeTeamSection: {
      width: '40%',
      alignItems: 'flex-end',
    } as ViewStyle,
    gameAccordionAwayTeamSection: {
      width: '40%',
      alignItems: 'flex-start',
    } as ViewStyle,
    gameAccordionCenterSection: {
      width: '20%',
      alignItems: 'center',
      gap: 0,
    } as ViewStyle,
    gameAccordionTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    } as ViewStyle,
    gameAccordionVsText: {
      fontSize: 14,
      fontWeight: '400',
      color: '#49454f', // theme.colors.onSurfaceVariant
      opacity: 0.8,
    } as TextStyle,
    gameAccordionStatusRow: {
      flexDirection: 'column',
      alignItems: 'center',
      gap: 1,
    } as ViewStyle,
    gameAccordionTeamCity: {
      fontSize: 10,
      fontWeight: '300',
      color: '#1c1b1f', // theme.colors.onSurface
      textAlign: 'center',
      lineHeight: 14,
      letterSpacing: -0.5,
    } as TextStyle,
    gameAccordionTeamName: {
      fontSize: 14,
      fontWeight: '800',
      color: '#1c1b1f', // theme.colors.onSurface
      textAlign: 'center',
      lineHeight: 16,
      letterSpacing: -0.2,
    } as TextStyle,
    gameAccordionSelectedPlayer: {
      fontSize: 10,
      fontWeight: '400',
      color: '#3b82f6', // theme.colors.primary
      textAlign: 'center',
      letterSpacing: -0.2,
    } as TextStyle,
    gameAccordionNoSelection: {
      fontSize: 10,
      fontWeight: '400',
      color: '#6b7280', // theme.colors.secondary
      textAlign: 'center',
      letterSpacing: -0.2,
    } as TextStyle,
    gameAccordionGameStatus: {
      fontSize: 8,
      fontWeight: '500',
      color: '#1c1b1f', // theme.colors.text
      textTransform: 'capitalize',
      textAlign: 'center',
      padding: 0,
      margin: 0,
      lineHeight: 12,
      letterSpacing: -0.5,
    } as TextStyle,
    gameAccordionGameDateTime: {
      fontSize: 10,
      fontWeight: '800',
      color: '#49454f', // theme.colors.onSurfaceVariant
      textAlign: 'center',
      padding: 0,
      margin: 0,
      lineHeight: 12,
      letterSpacing: -0.5,
    } as TextStyle,
    gameAccordionCustomTabBar: {
      flexDirection: 'row',
      height: 48,
      backgroundColor: '#ffffff',
      borderBottomWidth: 1,
      borderBottomColor: '#e5e5e5',
    } as ViewStyle,
    gameAccordionTabLabel: {
      fontSize: 12,
      fontWeight: '500',
      textTransform: 'capitalize',
      color: '#71717a', // Default color for inactive tabs
    } as TextStyle,
    gameAccordionTabItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      position: 'relative',
      minHeight: 36,
    } as ViewStyle,
    gameAccordionTabIndicatorActive: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 2,
      backgroundColor: '#3b82f6', // theme.colors.primary
    } as ViewStyle,

    // PlayerList styles
    playerListErrorContainer: {
      backgroundColor: '#fff3f3',
      borderColor: '#f5c6cb',
      borderWidth: 1,
      borderRadius: 4,
      padding: 16,
    } as ViewStyle,
    playerListErrorText: {
      color: '#721c24',
      fontSize: 14,
      textAlign: 'center',
    } as TextStyle,
    playerListRowSelected: {
      backgroundColor: '#e0f2fe', // Light blue background for selected players
      borderBottomColor: '#3b82f6', // theme.colors.primary
    } as ViewStyle,
    playerListRowSaving: {
      opacity: 0.7,
    } as ViewStyle,
    playerListTextSelected: {
      color: '#3b82f6', // theme.colors.primary
      fontWeight: '600',
    } as TextStyle,
    playerListSelectionIndicator: {
      marginLeft: 8,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: '#3b82f6', // theme.colors.primary
      justifyContent: 'center',
      alignItems: 'center',
    } as ViewStyle,
    playerListCheckmark: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: 'bold',
    } as TextStyle,
    playerListSavingIndicator: {
      position: 'absolute',
      right: 8,
    } as ViewStyle,
    playerListRetryButton: {
      marginTop: 8,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 4,
      backgroundColor: '#3b82f6', // theme.colors.primary
      alignItems: 'center',
    } as ViewStyle,
    playerListRetryText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '500',
    } as TextStyle,

    // App-level screen styles
    // Home screen styles
    homeErrorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
      backgroundColor: '#ffffff', // theme.colors.background
    } as ViewStyle,
    homeErrorTitle: {
      color: '#ef4444', // theme.colors.error
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
    } as TextStyle,
    homeErrorMessage: {
      color: '#1c1b1f', // theme.colors.onSurface
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 24,
    } as TextStyle,
    homeErrorHint: {
      color: '#49454f', // theme.colors.onSurfaceVariant
      fontSize: 14,
      textAlign: 'center',
      paddingHorizontal: 16,
    } as TextStyle,
    homeLoadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    } as ViewStyle,
    homeErrorOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      zIndex: 1000,
    } as ViewStyle,
    homeErrorText: {
      color: '#ef4444', // theme.colors.error
      fontSize: 16,
      textAlign: 'center',
    } as TextStyle,

    // Login screen styles
    loginContainer: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#ffffff',
    } as ViewStyle,
    loginTitle: {
      fontSize: 24,
      fontWeight: '200',
      color: '#000000',
      textAlign: 'center',
      marginBottom: 20,
    } as TextStyle,
    loginInput: {
      fontSize: 14,
      marginBottom: 15,
      backgroundColor: '#ffffff',
    } as TextStyle,
    loginError: {
      color: '#ef4444', // theme.colors.error
      textAlign: 'center',
      marginBottom: 15,
    } as TextStyle,
    loginButton: {
      marginVertical: 10,
      backgroundColor: '#3b82f6', // theme.colors.primary
    } as ViewStyle,
    loginLink: {
      color: '#3b82f6', // theme.colors.primary
      textAlign: 'center',
      marginTop: 15,
    } as TextStyle,

    // Register screen styles
    registerContainer: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#ffffff',
    } as ViewStyle,
    registerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#000000',
      textAlign: 'center',
      marginBottom: 20,
    } as TextStyle,
    registerInput: {
      marginBottom: 15,
      backgroundColor: '#f9f9f9',
    } as TextStyle,
    registerError: {
      color: '#ef4444', // theme.colors.error
      textAlign: 'center',
      marginBottom: 15,
    } as TextStyle,
    registerButton: {
      marginVertical: 10,
      backgroundColor: '#3b82f6', // theme.colors.primary
    } as ViewStyle,
    registerLink: {
      color: '#3b82f6', // theme.colors.primary
      textAlign: 'center',
      marginTop: 15,
    } as TextStyle,

    // Not found screen styles
    notFoundContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    } as ViewStyle,
    notFoundLink: {
      marginTop: 15,
      paddingVertical: 15,
    } as TextStyle,

    // Layout loading styles
    layoutLoadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f4f4f5',
    } as ViewStyle,
  },
};