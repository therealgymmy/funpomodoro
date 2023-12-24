import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';

const HomePage = () => {
    // const Minute = 60;
    const Minute = 1; // TODO: beyondsora - Use 1 second for testing for now
    const [isRunning, setIsRunning] = useState(false);
    const [timer, setTimer] = useState(15 * Minute); // 15 minutes in seconds
    const [mode, setMode] = useState('work'); // 'work' or 'break'

    const animatedWidth = useRef(new Animated.Value(0)).current;
    const startAnimation = () => {
        Animated.timing(animatedWidth, {
          toValue: 1, // Represents 100% width
          duration: timer * 1000, // Duration of the timer in milliseconds
          useNativeDriver: false,
        }).start();
      };
    const resetAnimation = () => {
        animatedWidth.setValue(0);
    };

    useEffect(() => {
        let interval;
        if (isRunning) {
            startAnimation();
            interval = setInterval(() => {
                setTimer(prevTimer => {
                    if (prevTimer === 1 && mode === 'work') {
                        setMode('break');
                        resetAnimation();
                        return 5 * Minute; // 5 minutes break
                    } else if (prevTimer === 1 && mode === 'break') {
                        setMode('work');
                        resetAnimation();
                        return 15 * Minute; // 15 minutes work
                    }
                    return prevTimer - 1;
                });
            }, 1000);
        } else if (!isRunning && timer !== 0) {
            clearInterval(interval);
            resetAnimation();
        }
        return () => clearInterval(interval);
    }, [isRunning, timer, mode]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Fun Pomodoro</Text>
            </View>
            {!isRunning ? (
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setIsRunning(true)}>
                    <Text style={styles.buttonText}>Start</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setIsRunning(false)}>
                    <Text style={styles.buttonText}>Stop</Text>
                </TouchableOpacity>
            )}
            <Animated.View
                style={[styles.animatedBar, {
                    width: animatedWidth.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['50%', '0%'] // Bar width from 100% to 0%
                    })
                }]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    header: {
        paddingTop: 50,
        paddingBottom: 50,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    button: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        borderRadius: 100,
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
    },
    animatedBar: {
        height: 10,
        backgroundColor: 'blue', // Choose your color
        marginTop: 20,
    },
});

export default HomePage;