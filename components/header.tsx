import { useTransactionStore } from "@/store";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { LayoutChangeEvent, Pressable, Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const PANEL_HEIGHT = 180;


const Header = () => {
    const insets = useSafeAreaInsets();
    const [openFilter, setOpenFilter] = useState<"category" | "status" | null>(null);
    const headerBottom = useSharedValue(0);
    const [activeCategory, setActiveCategory] = useState<string>("All Categories");
    const [activeStatus, setActiveStatus] = useState<string>("All Status");

    /* ---------------- Download Animation ---------------- */
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);
    const downloadStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    const handleDownloadPress = () => {
        scale.value = withTiming(0.75, { duration: 100 });
        opacity.value = withTiming(0.5, { duration: 100 });

        setTimeout(() => {
            scale.value = withTiming(1, { duration: 120 });
            opacity.value = withTiming(1, { duration: 120 });
        }, 100);
    };

    /* ---------------- Panel Animation ---------------- */
    const panelHeight = useSharedValue(0);
    const panelStyle = useAnimatedStyle(() => ({
        height: panelHeight.value,
        top: headerBottom.value,
    }));

    const toggleFilter = (type: "category" | "status") => {
        const opening = openFilter !== type;
        setOpenFilter(opening ? type : null);
        panelHeight.value = withTiming(opening ? PANEL_HEIGHT : 0, { duration: 90 });
    };

    /* ---------------- Measure header container ---------------- */
    const onHeaderLayout = (e: LayoutChangeEvent) => {
        headerBottom.value = e.nativeEvent.layout.height + insets.top;
    };

    /* ---------------- HeaderTop ---------------- */
    const HeaderTop = () => (
        <View className="flex-row justify-between items-center" style={{ height: 40 }}>
            <TouchableOpacity>
                <MaterialIcons name="home-filled" size={26} color="#000" />
            </TouchableOpacity>

            <Text className="text-black text-[15px] font-inter-bold pl-4">
                Transactions
            </Text>

            <TouchableOpacity onPress={handleDownloadPress}>
                <Animated.View style={downloadStyle}>
                    <Text className="text-green-500 text-sm font-inter-regular">
                        Download
                    </Text>
                </Animated.View>
            </TouchableOpacity>
        </View>
    );

    /* ---------------- FilterBar ---------------- */
    const FilterBar = () => (
        <View className="flex-row gap-3 mt-4 ">
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleFilter("category")}
                className={` flex-1 flex-row items-center justify-center px-3 py-2.5 ${openFilter === "category" ? "bg-green-100" : "bg-gray-200"} rounded-xl `}
            >
                <Text
                    numberOfLines={1}
                    className={`text-sm font-inter-regular ${openFilter === "category" ? "text-green-500" : "text-black"
                        }`}
                >
                    {activeCategory}
                </Text>
                <MaterialIcons
                    name={openFilter === "category" ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                    size={20}
                    color={`${openFilter === "category" ? "#16A34A" : "#000"}`}
                />
            </TouchableOpacity>

            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleFilter("status")}
                className={` flex-1 flex-row items-center justify-center px-3 py-2.5 ${openFilter === "status" ? "bg-green-100" : "bg-gray-200"} rounded-xl `}
            >
                <Text
                    numberOfLines={1}
                    className={`text-sm font-inter-regular ${openFilter === "status" ? "text-green-500" : "text-black"
                        }`}
                >
                    {activeStatus}
                </Text>
                <MaterialIcons
                    name={openFilter === "status" ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                    size={20}
                    color={`${openFilter === "status" ? "#16A34A" : "#000"}`}
                />
            </TouchableOpacity>
        </View>
    );

    /* ---------------- FilterPanel ---------------- */
    const FilterPanel = () => {
        if (!openFilter) return null;

        const options =
            openFilter === "category"
                ? ["All Categories", "Groceries", "Dining", "Shopping", "Utilities", "Transport"]
                : ["All Status", "Completed", "Pending", "Failed", "Reversed", "To be Paid"];

        const setActiveOption = (opt: string) => {
            if (openFilter === "category") {
                setActiveCategory(opt);
                useTransactionStore.getState().setCategory(opt);
            }
            if (openFilter === "status") {
                setActiveStatus(opt);
                useTransactionStore.getState().setStatus(opt);
            }

            setOpenFilter(null);
            panelHeight.value = withTiming(0, { duration: 90 });
        };

        return (
            <>
                {/* Shadow overlay */}
                <Pressable
                    onPress={() => toggleFilter(openFilter)}
                    className="absolute inset-0 bg-black/80 z-50"
                    style={{ top: headerBottom.value }}
                />

                {/* Panel */}
                <Animated.View
                    style={panelStyle}
                    className="absolute left-0 right-0 bg-white overflow-hidden z-50 rounded-b-3xl"
                >
                    <View className="flex-row flex-wrap justify-center gap-2 mt-4 py-4 px-6">
                        <View className="h-px mb-4 bg-gray-200 w-full" />
                        {options.map((opt) => {
                            const isActive =
                                (openFilter === "category" && activeCategory === opt) ||
                                (openFilter === "status" && activeStatus === opt);

                            return (
                                <TouchableOpacity
                                    key={opt}
                                    activeOpacity={0.8}
                                    onPress={() => setActiveOption(opt)}
                                    className={`px-3 py-2.5 rounded-md ${isActive ? "bg-green-100" : "bg-gray-200"}`}
                                >
                                    <Text className={`text-sm font-inter-light ${isActive ? "text-green-500" : "text-black"}`}>{opt}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </Animated.View>
            </>
        );
    };


    return (
        <>
            <View
                onLayout={onHeaderLayout}
                className="bg-white"
            >
                <HeaderTop />
                <FilterBar />
            </View>

            <FilterPanel />
        </>
    );
};

export default Header;
