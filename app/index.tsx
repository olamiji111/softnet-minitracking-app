import AddTransactionSheet from '@/components/addtransactionsheet';
import Header from '@/components/header';
import Transactionblock from '@/components/transactionblock';
import { useTransactionStore } from '@/store';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  PanResponder,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import AnimatedReanimated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const PULL_THRESHOLD = 70;

const Home = () => {
  const insets = useSafeAreaInsets();
  const store = useTransactionStore();
  const [showSheet, setShowSheet] = useState(false);
  const sheetProgress = useSharedValue(0);

  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const translateY = useRef(new Animated.Value(0)).current;

  const resetFilters = () => {
    store.setCategory("All Categories");
    store.setStatus("All Status");
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 100,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) {
          translateY.setValue(g.dy * 0.3);
          setPullDistance(g.dy);
        }
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > PULL_THRESHOLD) {
          setRefreshing(true);
          resetFilters();

          setTimeout(() => {
            setRefreshing(false);
          }, 800);
        }

        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();

        setPullDistance(0);
      },
    })
  ).current;

  // Shared animation values
  const backgroundScaleX = useSharedValue(1);
  const backgroundScaleY = useSharedValue(1);
  const backgroundOpacity = useSharedValue(1);
  const backgroundTranslateY = useSharedValue(0);
  const bgColor = useSharedValue(1);

  useEffect(() => {
    const active = showSheet;
    backgroundScaleX.value = withTiming(active ? 0.9999 : 1, { duration: 0 });
    backgroundScaleY.value = withTiming(active ? 0.85 : 1, { duration: 0 });
    backgroundOpacity.value = withTiming(active ? 0.95 : 1, { duration: 0 });
    backgroundTranslateY.value = withTiming(active ? 1 : 0, { duration: 0 });
    bgColor.value = withTiming(active ? 0 : 1, { duration: 300 });
  }, [showSheet]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: backgroundScaleX.value },
      { translateY: backgroundTranslateY.value },
    ],
    opacity: backgroundOpacity.value,
  }));
  const contentTransformStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scaleX: backgroundScaleX.value },
        { scaleY: backgroundScaleY.value },
        { translateY: backgroundTranslateY.value },
      ],
      opacity: backgroundOpacity.value,
    };
  });

  const backgroundColorStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      sheetProgress.value, // use this instead of bgColor
      [0, 1],
      ['#22C55E', '#FFFFFF']
    ),
  }));

  const onDrag = ({
    scaleX,
    scaleY,
    opacity,
    translateY,
  }: {
    scaleX: number;
    scaleY: number
    opacity: number;
    translateY: number;
  }) => {
    backgroundScaleX.value = withTiming(scaleX, { duration: 120 });
    backgroundScaleY.value = withTiming(scaleY, { duration: 120 });
    backgroundOpacity.value = withTiming(opacity, { duration: 120 });
    backgroundTranslateY.value = withTiming(translateY, { duration: 120 });
  };

  return (
    <>

      {showSheet && (
        <AddTransactionSheet onClose={() => setShowSheet(false)} isOpen={showSheet} onDrag={onDrag}
        />
      )}

      {showSheet && (
        <View className="absolute inset-0 z-[90] bg-black/50" pointerEvents="auto" />
      )}
      <AnimatedReanimated.View style={[{ flex: 1 }, backgroundColorStyle]}>
        <AnimatedReanimated.View
          style={[
            {
              flex: 1,
              marginHorizontal: showSheet ? 12 : 0,
              marginTop: showSheet ? 12 : 0,
              marginBottom: showSheet ? 12 : 0,
              borderRadius: showSheet ? 16 : 0,
              overflow: 'hidden',
              backgroundColor: '#FFFFFF',
            },
            animatedStyle,
            contentTransformStyle,
          ]}
        >

          <SafeAreaView className="flex-1 bg-white px-6">
            <Header />
            <Animated.View
              style={{ transform: [{ translateY }] }}
              {...panResponder.panHandlers}
              className="max-h-full"
            >


              {/* REFRESH STRIP — only visible while dragging */}
              {pullDistance > 0 && (
                <View className="items-center justify-center py-3">
                  {refreshing ? (
                    <View className="flex-row items-center gap-2">
                      <ActivityIndicator size="small" color="#22c55e" />
                      <Text className="text-xs text-gray-400">Refreshing...</Text>
                    </View>
                  ) : (
                    <View className="flex-row items-center gap-1">
                      <MaterialIcons
                        name={pullDistance > PULL_THRESHOLD ? "arrow-upward" : "arrow-downward"}
                        size={16}
                        color="#9ca3af"
                      />
                      <Text className="text-xs text-gray-400">
                        {pullDistance > PULL_THRESHOLD
                          ? "Release to refresh"
                          : "Pull down to refresh"}
                      </Text>
                    </View>
                  )}
                </View>
              )}
              <Transactionblock />
            </Animated.View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowSheet(true)}
              style={{
                position: 'absolute',
                right: 10,
                bottom: insets.bottom + 20,
                width: 60,
                height: 60,
                borderRadius: 28,
                backgroundColor: '#22c55e',
                alignItems: 'center',
                justifyContent: 'center',
                elevation: 6,
                shadowColor: '#000',
                shadowOpacity: 0.2,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 3 },
              }}
            >
              <MaterialIcons name="add" size={28} color="#fff" />
            </TouchableOpacity>
          </SafeAreaView>
        </AnimatedReanimated.View>
      </AnimatedReanimated.View>
    </>
  );
};

export default Home;
