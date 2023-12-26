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
            <Text style={{color: 'white'}}>Work Interval (minutes):</Text>
            <TextInput
                style={styles.input}
                value={workInterval.toString()}
                onChangeText={setWorkInterval}
                keyboardType='numeric'
            />
            <Text style={{color: 'white'}}>Rest Interval (minutes):</Text>
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
        width: '20%',
        height: 40, // Adjust the height as needed
        margin: 12, // Adjust the margin as needed
        borderWidth: 1, // Optional, if you want a border
        padding: 10, // Adjust the padding as needed
        borderRadius: 20, // This makes the corners rounded
        backgroundColor: '#f2f2f2', // Light gray background color
    },
});

export default SettingsScreen;