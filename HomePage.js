import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { Audio } from 'expo-av';
import { useTimer, useTestMode } from './TimerContext';
import CircularProgress from './CircularProgress';

const HomePage = ({ route, navigation }) => {
    const { workInterval, setWorkInterval, restInterval, setRestInterval } = useTimer();
    console.log('workInterval=', workInterval, ', restInterval=', restInterval);

    const { testEnabled, setTestEnabled } = useTestMode();
    console.log('testMode=', testEnabled);

    const Minute = testEnabled === false ? 60 : 1;
    const [isRunning, setIsRunning] = useState(false);
    const [timer, setTimer] = useState(workInterval * Minute);
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

    const timerProgress = useRef(new Animated.Value(0)).current;
    const startAnimation = () => {
        Animated.timing(timerProgress, {
          toValue: mode === 'work' ? 1 : 0,
          duration: timer * 1000, // Duration of the timer in milliseconds
          useNativeDriver: false,
          easing: Easing.linear, // or Easing.inOut(Easing.ease) for a smoother effect
        }).start();
      };
    const resetAnimation = () => {
        timerProgress.setValue(0);
    };

    const playSound = async () => {
        try {
            console.log('play sound');
            const { sound } = await Audio.Sound.createAsync(require('./assets/notifications-sound.mp3'));
            sound.setStatusAsync({ shouldPlay: true, onPlaybackStatusUpdate: status => {
                if (status.didJustFinish) {
                    sound.unloadAsync();
                }
            }});
            await sound.playAsync();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        let interval;
        if (isRunning) {
            activateKeepAwakeAsync();
            startAnimation();
            interval = setInterval(() => {
                setTimer(prevTimer => {
                    if (prevTimer === 1 && mode === 'work') {
                        flashBackground();
                        playSound().then(() => { setMode('break') })
                        // setMode('break');
                        return restInterval * Minute;
                    } else if (prevTimer === 1 && mode === 'break') {
                        flashBackground();
                        playSound().then(() => { setMode('work') })
                        // setMode('work');
                        return workInterval * Minute;
                    }
                    return prevTimer - 1;
                });
            }, 1000);
        } else if (!isRunning) {
            deactivateKeepAwake();
            clearInterval(interval);
            setTimer(workInterval * Minute);
            setMode('work');
            resetAnimation();
        }
        return () => clearInterval(interval);
    }, [isRunning, timer, workInterval, restInterval, testEnabled]);

    return (
        <Animated.View style={[styles.container, { backgroundColor: backgroundColorInterpolate }]}>
            <View style={styles.header}>
                <Text style={styles.title}>Fun Pomodoro</Text>
            </View>
            <View style={styles.body}>
                <CircularProgress radius={110} animatedValue={timerProgress} />
                <TouchableOpacity
                    style={isRunning ? styles.stopButton : styles.startButton}
                    onPress={() => setIsRunning(!isRunning)}>
                    <Text style={styles.buttonText}>{isRunning ? 'Stop' : 'Start'}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.footer}>
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
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderRadius: 30,
    },
    body: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        flex: 2,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#F0F0F0',
    },
    startButton: {
        position: 'absolute',
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4CAF50', // Green color for start
        borderRadius: 100,
    },
    stopButton: {
        position: 'absolute',
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FF0000', // Red color for stop
        borderRadius: 100,
    },
    buttonText: {
        color: 'white',
        fontSize: 30,
    },
});

export default HomePage;