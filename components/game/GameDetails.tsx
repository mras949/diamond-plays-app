import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { GameDetailsProps } from '../../constants/interfaces';
import { theme } from '../../constants/theme';

export const GameDetails: React.FC<GameDetailsProps> = ({
    status,
    awayScore,
    homeScore,
    date,
}) => {
    return (
        <View style={styles.container}>
            <Text variant="bodyLarge" style={styles.gameDetails}>Status: {status}</Text>
            <Text variant="bodyLarge" style={styles.gameDetails}>Score: {awayScore} - {homeScore}</Text>
            <Text variant="bodyLarge" style={styles.gameDetails}>
                Date: {new Date(date).toLocaleDateString()}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: theme.spacing.md,
    },
    gameDetails: {
        fontFamily: theme.fonts.bodyLarge.fontFamily,
        fontSize: theme.fonts.bodyLarge.fontSize,
        color: theme.colors.secondary,
        marginBottom: theme.spacing.sm,
    },
});
