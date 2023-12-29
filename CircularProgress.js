import { Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircularProgress = ({ radius, animatedValue }) => {
    // Interpolate animated value to strokeDasharray
    const viewRadius = radius + 10;
    const circumference = Math.ceil(2 * 3.14 * radius);
    const strokeDashoffset = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [circumference, 0],
    });

    return (
        <Svg height={2*viewRadius} width={2*viewRadius} viewBox={`0 0 ${2*viewRadius} ${2*viewRadius}`}>
            <Circle cx={viewRadius} cy={viewRadius} r={radius} stroke="grey" strokeWidth="10" fill="transparent" />
            <AnimatedCircle
                cx={viewRadius}
                cy={viewRadius}
                r={radius}
                stroke="blue"
                strokeWidth="3"
                strokeDasharray={`${circumference}`}
                strokeDashoffset={strokeDashoffset}
                fill="transparent"
                strokeLinecap="round"
            />
        </Svg>
    );
};

export default CircularProgress;