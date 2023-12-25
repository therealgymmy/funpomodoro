import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useTimer } from './TimerContext';

const SettingsScreen = ({ route, navigation }) => {
    const { workInterval, setWorkInterval, restInterval, setRestInterval } = useTimer();
    console.log('workInterval=', workInterval, ', restInterval=', restInterval);

    const saveSettings = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text>Work Interval (minutes):</Text>
            <TextInput
                style={styles.input}
                value={workInterval.toString()}
                onChangeText={setWorkInterval}
                keyboardType='numeric'
            />
            <Text>Rest Interval (minutes):</Text>
            <TextInput
                style={styles.input}
                value={restInterval.toString()}
                onChangeText={setRestInterval}
                keyboardType='numeric'
            />
            <Button title="Save Settings" onPress={saveSettings} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#333333',
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        width: '100%',
        padding: 10,
        marginVertical: 10,
    },
});

export default SettingsScreen;