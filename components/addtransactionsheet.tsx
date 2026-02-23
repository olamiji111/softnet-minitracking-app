import React, { useEffect, useRef, useState } from 'react';
import {
    Dimensions
} from "react-native";
import { Gesture, GestureDetector, TextInput } from "react-native-gesture-handler";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from "react-native-reanimated";
import { useSafeAreaInsets } from 'react-native-safe-area-context';



const SCREEN_HEIGHT = Dimensions.get("window").height;
const SNAP_TOP = SCREEN_HEIGHT * 0.1;
const SNAP_BOTTOM = SCREEN_HEIGHT;
const SNAP_POINTS = [SNAP_TOP, SNAP_BOTTOM];


interface BottomSheetProps {
    isOpen: boolean;
    onClose?: () => void | any;
    onDrag?: (values: { scaleX: number; scaleY: number; opacity: number; translateY: number }) => void;
}

const springConfig = {
    damping: 40,
    stiffness: 600,
    mass: 1,
    overshootClamping: true,
};
const DRAG_THRESHOLD = 10;




const AddTransactionSheet = ({ onClose, isOpen, onDrag }: BottomSheetProps) => {
    const translateY = useSharedValue<number>(SNAP_BOTTOM);
    const insets = useSafeAreaInsets();
    const context = useSharedValue({ y: 0 });
    const sheetProgress = useSharedValue(0);
    const [focused, setfocused] = useState(false)
    const [query, setQuery] = useState('');
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        translateY.value = withSpring(isOpen ? SNAP_TOP : SNAP_BOTTOM, springConfig);
        sheetProgress.value = withSpring(isOpen ? 0 : 1);
    }, [isOpen]);

    const panGesture = Gesture.Pan()
        .onStart(() => {
            context.value = { y: translateY.value };
        })
        .onUpdate((event) => {
            let nextTranslate = event.translationY + context.value.y;
            nextTranslate = Math.max(SNAP_TOP, Math.min(SNAP_BOTTOM, nextTranslate));
            translateY.value = nextTranslate;

            const progress = (nextTranslate - SNAP_TOP) / (SNAP_BOTTOM - SNAP_TOP);

            if (progress < 0.08) return;

            // Define scale curves
            const scaleX = 0.93 + (1 - 0.78) * progress;
            const scaleY = 0.82 + (1 - 0.74) * progress;
            const opacity = 0.95 + (1 - 0.95) * progress;
            const translateVal = 10 * progress;

            if (onDrag) {
                runOnJS(onDrag)({
                    scaleX,
                    scaleY,
                    opacity,
                    translateY: translateVal,
                });
            }
        })
        .onEnd(() => {
            const shouldClose = translateY.value > SCREEN_HEIGHT * 0.55;

            if (shouldClose) {
                translateY.value = withSpring(SCREEN_HEIGHT + 100, springConfig, () => {
                    if (onClose) runOnJS(onClose)();
                });
            } else {
                translateY.value = withSpring(SNAP_TOP, springConfig);

                if (onDrag) {
                    runOnJS(onDrag)({
                        scaleX: 0.99,
                        scaleY: 0.89,
                        opacity: 1,
                        translateY: 20,
                    })
                } else {
                    translateY.value = withSpring(SNAP_TOP, springConfig)
                    if (onDrag) {
                        runOnJS(onDrag)({
                            scaleX: 0.99,
                            scaleY: 0.89,
                            opacity: 0.95,
                            translateY: 20
                        })
                    }
                }


            }
        });
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View
                style={[
                    animatedStyle,
                    {
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        top: 0,
                        right: 0,
                        backgroundColor: 'white',
                        zIndex: 100,
                        borderTopLeftRadius: 40,
                        borderTopRightRadius: 40,
                    },
                ]}
            >
            </Animated.View>
        </GestureDetector>

    )
}

export default AddTransactionSheet;