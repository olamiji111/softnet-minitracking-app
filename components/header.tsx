import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";

const Header = () => {
    const router = useRouter();

    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    const handlePress = () => {
        scale.value = withSpring(0.7);
        opacity.value = withTiming(0.4);

        setTimeout(() => {
            scale.value = withSpring(1);
            opacity.value = withTiming(1);

        }, 100)
    };
    // Header Top
    const HeaderTop = () => (
        <View className='bg-white border-none  mt-1 flex-between flex-row'>
            <TouchableWithoutFeedback onPress={() => { }}>
                <MaterialIcons name="home-filled" size={26} color="#00000" />
            </TouchableWithoutFeedback>

            <Text className="text-black text-[15px] font-inter-bold pl-8 "> Transactions</Text>

            <TouchableWithoutFeedback onPress={handlePress}>
                <Animated.View style={animatedStyle}>
                    <Text className="text-green-700 font-inter-regular text-sm capitalize"> download </Text>
                </Animated.View>
            </TouchableWithoutFeedback>
        </View>
    )

    // Filter Bar 
    const FilterBar = () => {
        const [openFilter, setOpenFilter] = useState<"category" | "status" | null>(null);

        return (
            <View id="#FilterBar" className=" space-x-4 gap-x-4 pr-4 mt-2 py-4 bg-inherit flex-start flex-row  ">
                <TouchableOpacity
                    className="flex-row shadow-xs items-center  justify-center px-3 w-1/2 py-2.5 bg-gray-200 rounded-xl"
                    onPress={() => setOpenFilter(openFilter === "category" ? null : "category")}
                >
                    <Text className="font-inter-light text-black text-sm"> All Categories </Text>
                    <MaterialIcons
                        name={openFilter === "category" ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                        size={20}
                        color="#000000"
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    className="flex-row shadow-xs items-center justify-center px-3 w-1/2 py-2.5 bg-gray-200 rounded-xl"
                    onPress={() => setOpenFilter(openFilter === "status" ? null : "status")}
                >
                    <Text className="font-inter-light text-black text-sm"> All Statuses </Text>
                    <MaterialIcons
                        name={openFilter === "status" ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                        size={20}
                        color="#000000"
                    />
                </TouchableOpacity>

            </View>
        )
    }

    return (
        <View className="bg-white h-auto px-4">
            <HeaderTop />
            <FilterBar />
        </View>

    );
}

export default Header;