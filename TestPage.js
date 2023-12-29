import React, { useState, useEffect } from 'react';
import { Animated, Easing, View, TouchableOpacity, Text } from 'react-native';
import CircularProgress from './CircularProgress';

const TestPage = () => {
    const [animatedValue, setAnimatedValue] = useState(new Animated.Value(0));

    const startAnimation = () => {
        animatedValue.setValue(0);
        Animated.timing(animatedValue, {
            toValue: 100,
            duration: 10000,
            easing: Easing.inOut(Easing.linear),
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress radius={100} animatedValue={animatedValue} />
            <TouchableOpacity
                onPress={startAnimation}
                style={{
                    position: 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    backgroundColor: 'blue',
                }}
            >
                <Text style={{ color: 'white' }}>Press Me</Text>
            </TouchableOpacity>
        </View>
    );
};

export default TestPage;