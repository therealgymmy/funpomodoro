import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { Audio } from 'expo-av';

const HomePage = () => {
    // const Minute = 60;
    const Minute = 1; // TODO: beyondsora - Use 1 second for testing for now
    const RestMinutes = 2;
    const WorkMinutes = 3;
    const [isRunning, setIsRunning] = useState(false);
    const [timer, setTimer] = useState(WorkMinutes * Minute);
    const [mode, setMode] = useState('work'); // 'work' or 'break'
    const backgroundColorAnim = useRef(new Animated.Value(0)).current;
    const backgroundColorInterpolate = backgroundColorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(51, 51, 51, 1)', 'rgba(255, 255, 0, 1)'],
    });

    const flashBackground = () => {
        timeDurationMs = 100;
        backgroundColorAnim.setValue(0);
        Animated.sequence([
            Animated.timing(backgroundColorAnim, {
                toValue: 1,
                duration: timeDurationMs,
                useNativeDriver: false,
            }),
            Animated.timing(backgroundColorAnim, {
                toValue: 0,
                duration: timeDurationMs,
                useNativeDriver: false,
            }),
            Animated.timing(backgroundColorAnim, {
                toValue: 1,
                duration: timeDurationMs,
                useNativeDriver: false,
            }),
            Animated.timing(backgroundColorAnim, {
                toValue: 0,
                duration: timeDurationMs,
                useNativeDriver: false,
            }),
            Animated.timing(backgroundColorAnim, {
                toValue: 1,
                duration: timeDurationMs,
                useNativeDriver: false,
            }),
            Animated.timing(backgroundColorAnim, {
                toValue: 0,
                duration: timeDurationMs,
                useNativeDriver: false,
            }),
        ]).start();
    };

    const animatedWidth = useRef(new Animated.Value(0)).current;
    const startAnimation = () => {
        Animated.timing(animatedWidth, {
          toValue: mode === 'work' ? 1 : 0,
          duration: timer * 1000, // Duration of the timer in milliseconds
          useNativeDriver: false,
          easing: Easing.linear, // or Easing.inOut(Easing.ease) for a smoother effect
        }).start();
      };
    const resetAnimation = () => {
        animatedWidth.setValue(0);
    };

    useEffect(() => {
        const playSound = async () => {
            try {
                console.log('play sound');
                const soundObject = new Audio.Sound();
                await soundObject.loadAsync(require('./assets/notifications-sound.mp3'));
                await soundObject.playAsync();
                // Remember to unload the sound from memory after it's played
                await soundObject.unloadAsync();
            } catch (error) {
                console.log(error);
            }
        };

        let interval;
        if (isRunning) {
            startAnimation();
            interval = setInterval(() => {
                setTimer(prevTimer => {
                    if (prevTimer === 1 && mode === 'work') {
                        playSound();
                        flashBackground();
                        setMode('break');
                        return RestMinutes * Minute;
                    } else if (prevTimer === 1 && mode === 'break') {
                        playSound();
                        flashBackground();
                        setMode('work');
                        return WorkMinutes * Minute;
                    }
                    return prevTimer - 1;
                });
            }, 1000);
        } else if (!isRunning && timer !== 0) {
            clearInterval(interval);
            setTimer(WorkMinutes * Minute);
            setMode('work');
            resetAnimation();
        }
        return () => clearInterval(interval);
    }, [isRunning, timer, mode]);

    // return (
    //     <View style={styles.container}>
    //         <View style={styles.header}>
    //             <Text style={styles.title}>Fun Pomodoro</Text>
    //         </View>
    //         <TouchableOpacity
    //             style={isRunning ? styles.stopButton : styles.startButton}
    //             onPress={() => setIsRunning(!isRunning)}>
    //             <Text style={styles.buttonText}>{isRunning ? 'Stop' : 'Start'}</Text>
    //         </TouchableOpacity>
    //         <View style={styles.barContainer}>
    //             <Animated.View
    //                 style={[styles.animatedBar, {
    //                     width: animatedWidth.interpolate({
    //                         inputRange: [0, 1],
    //                         outputRange: ['0%', '100%']
    //                     })
    //                 }]}
    //             />
    //         </View>
    //     </View>
    // );
    return (
        <Animated.View style={[styles.container, { backgroundColor: backgroundColorInterpolate }]}>
            <View style={styles.header}>
                <Text style={styles.title}>Fun Pomodoro</Text>
            </View>
            <TouchableOpacity
                style={isRunning ? styles.stopButton : styles.startButton}
                onPress={() => setIsRunning(!isRunning)}>
                <Text style={styles.buttonText}>{isRunning ? 'Stop' : 'Start'}</Text>
            </TouchableOpacity>
            <View style={styles.barContainer}>
                <Animated.View
                    style={[styles.animatedBar, {
                        width: animatedWidth.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%']
                        })
                    }]}
                />
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#333333',
    },
    header: {
        paddingTop: 50,
        paddingBottom: 50,
        backgroundColor: 'transparent',
        alignItems: 'center',
        borderRadius: 30,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#F0F0F0',
    },
    startButton: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4CAF50', // Green color for start
        borderRadius: 100,
        margin: 50,
    },
    stopButton: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FF0000', // Red color for stop
        borderRadius: 100,
        margin: 50,
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
    },
    barContainer: {
        height: 30,
        width: '80%', // Adjust to your preferred width
        backgroundColor: '#E0E0E0', // A lighter color for the static frame
        borderColor: 'white',
        borderRadius: 30,
        borderWidth: 5,
        marginTop: 20,
        overflow: 'hidden', // Ensures the animated bar doesn't overflow
    },
    animatedBar: {
        height: '100%', // Same height as the container
        backgroundColor: 'blue', // Choose your color
        borderRadius: 30, // Adjust for desired roundness
    },
});

export default HomePage;