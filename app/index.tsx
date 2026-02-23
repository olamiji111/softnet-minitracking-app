import Header from '@/components/header';
import Transactionblock from '@/components/transactionblock';
import { useTransactionStore } from '@/store';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  PanResponder,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const PULL_THRESHOLD = 70;

const Home = () => {
  const insets = useSafeAreaInsets();
  const store = useTransactionStore();

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

  return (
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
        onPress={() => { }}
        style={{
          position: 'absolute',
          right: 10,
          bottom: insets.bottom + 20,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: '#22c55e',
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 6, // Android shadow
          shadowColor: '#000', // iOS shadow
          shadowOpacity: 0.2,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 3 },
        }}
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Home;
