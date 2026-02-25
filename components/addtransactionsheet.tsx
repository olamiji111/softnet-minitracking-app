import { images } from '@/constants/images';
import { transactionSchema } from '@/utils/transactionschema';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Gesture, GestureDetector, TextInput } from "react-native-gesture-handler";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from "react-native-reanimated";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from "react-native-worklets";
import { ZodError } from "zod";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SNAP_TOP = SCREEN_HEIGHT * 0.07;
const SNAP_BOTTOM = SCREEN_HEIGHT;

interface BottomSheetProps {
    isOpen: boolean;
    onClose?: () => void;
    onDrag?: (values: {
        scaleX: number;
        scaleY: number;
        opacity: number;
        translateY: number;
    }) => void;
}

const springConfig = {
    damping: 40,
    stiffness: 600,
    mass: 1,
    overshootClamping: true,
};

const AddTransactionSheet = ({ onClose, isOpen, onDrag }: BottomSheetProps) => {
    const translateY = useSharedValue<number>(SNAP_BOTTOM);
    const context = useSharedValue({ y: 0 });
    const sheetProgress = useSharedValue(0);
    const insets = useSafeAreaInsets();
    const merchantRef = useRef<TextInput>(null);
    const amountRef = useRef<TextInput>(null);
    const categoriesRef = useRef<TextInput>(null);
    const quickAmounts = [50, 100, 200, 500, 700, 1000] as const
    const catergorySelect = ["Groceries", "Dining", "Shopping", "Utilities", "Transport", "Education"] as const;
    const [activeAmountShown, setActiveAmountShown] = useState<quickAmountsType | null>(null)
    const [transaction, setTransaction] = useState({
        merchant: "",
        amount: "",
        categories: ""
    });
    const [activeCategory, setActiveCategory] = useState<categorySelectprops | null>(null)
    const [focused, setFocused] = useState<"merchant" | "amount" | "categories" | null>(null);
    const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

    const isDisabled =
        !transaction.merchant.trim() ||
        !transaction.amount.trim() ||
        !transaction.categories.trim() ||
        Object.values(errors).some((e) => e);

    type categorySelectprops = (typeof catergorySelect)[number];
    type quickAmountsType = (typeof quickAmounts)[number];

    const validateField = (field: string, value: string) => {
        try {

            (transactionSchema.shape as any)[field].parse(value);


            setErrors((prev) => ({ ...prev, [field]: undefined }));
        } catch (err) {
            if (err instanceof ZodError) {

                if (focused === field) {
                    setErrors((prev) => ({
                        ...prev,
                        [field]: err.issues?.[0]?.message || "Invalid input",
                    }));
                }
            }
        }
    };

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

            const scaleX = 0.93 + (1 - 0.78) * progress;
            const scaleY = 0.82 + (1 - 0.74) * progress;
            const opacity = 0.95 + (1 - 0.95) * progress;
            const translateVal = 10 * progress;

            if (onDrag) {
                scheduleOnRN(onDrag, {
                    scaleX,
                    scaleY,
                    opacity,
                    translateY: translateVal,
                });
            }
        })
        .onEnd(() => {
            const shouldClose = translateY.value > SCREEN_HEIGHT * 0.51;

            if (shouldClose) {
                translateY.value = withSpring(
                    SCREEN_HEIGHT + 100,
                    springConfig,
                    () => {
                        if (onClose) scheduleOnRN(onClose);
                    }
                );
            } else {
                translateY.value = withSpring(SNAP_TOP, springConfig);

                if (onDrag) {
                    scheduleOnRN(onDrag, {
                        scaleX: 0.99,
                        scaleY: 0.89,
                        opacity: 1,
                        translateY: 20,
                    });
                }
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

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
                        backgroundColor: '#E5E7EB',
                        zIndex: 100,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                    },
                ]}
            >
                <ScrollView
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    className='h-full flex-1 px-6 py-2'
                >
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} className="flex-1">
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                            <View className="flex-1  mt-4">
                                <View className=' border-b border-zinc-400 shadow-xs  rounded-lg  flex-row items-center justify-between place-items-center'>

                                    <Image
                                        source={images.SoftnetImage}
                                        resizeMode='contain'
                                        className='w-24 h-14'
                                    />

                                    <Text className='text-center text-md  font-inter-bold text-black-300 capitalize '> Add a transaction </Text>
                                    <TouchableOpacity
                                        className="px-2"
                                        onPress={() => { }}
                                        activeOpacity={0.4}
                                    >
                                        <Text className='text-green-500 font-inter-semibold text-sm'> Records </Text>
                                    </TouchableOpacity>
                                </View>
                                <View className='py-6 flex-col gap-y-4'>

                                    <View className='mt-4 bg-white rounded-2xl shadow-xs  py-4 px-3 border border-transparent overflow-hidden' >
                                        <Text className='text-[14px] font-inter-regular'> merchant </Text>
                                        <View className="mt-4">
                                            <View className="relative">
                                                {/* Placeholder */}
                                                {!transaction.merchant && (
                                                    <Text className="absolute left-0 top-2 text-[12px] text-gray-400 font-inter-regular">
                                                        Whats the transaction purpose?
                                                    </Text>
                                                )}

                                                <TextInput
                                                    ref={merchantRef}
                                                    className={`mt-2  mb-2 text-[16px] pb-2 text-zinc-700 font-inter-regular border-b 
                                                    ${focused === "merchant" ? "border-green-600" : "border-[#E5E7EB]"}`}
                                                    value={transaction.merchant}
                                                    onChangeText={(text) => {
                                                        setTransaction((s) => ({ ...s, merchant: text }));
                                                        validateField("merchant", text);
                                                    }}
                                                    onFocus={() => setFocused("merchant")}
                                                    onBlur={() => {
                                                        setFocused(null);

                                                    }}
                                                    returnKeyType="done"
                                                    cursorColor="#22c55E"
                                                    selectionColor="#22c55E"
                                                />
                                                {errors.merchant && (
                                                    <Text className="text-red-500 text-xs mt-2">
                                                        {errors.merchant}
                                                    </Text>
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                    <View className="mt-4 bg-white rounded-2xl py-4 px-3 border border-transparent">
                                        <Text className="text-[14px] font-inter-regular">Amount</Text>

                                        <View className={` flex-row items-center  mt-3 border-b ${focused === "amount" ? "border-green-600 " : "border-[#E5E7EB]"
                                            }`}>
                                            <Text className="text-black text-[18px] mr-1.5 pb-1.5">₦</Text>

                                            <TextInput
                                                ref={amountRef}
                                                keyboardType="numeric"
                                                value={
                                                    transaction.amount
                                                        ? Number(transaction.amount).toLocaleString()
                                                        : ""
                                                }
                                                onChangeText={(text) => {
                                                    const digits = text.replace(/\D/g, "");
                                                    setTransaction((s) => ({ ...s, amount: digits }));
                                                    setActiveAmountShown(null);
                                                    validateField("amount", digits);
                                                }}
                                                onFocus={() => setFocused('amount')}
                                                onBlur={() => {
                                                    setFocused(null)

                                                }}
                                                placeholder="10.00 - 5,000,000"
                                                placeholderTextColor="#9CA3AF"
                                                className="flex-1 text-[17px] pb-4 text-zinc-700 font-inter-semibold py-1"
                                                cursorColor="#22c55E"
                                                selectionColor="#22c55E"
                                                returnKeyType="done"
                                            />

                                        </View>
                                        {errors.amount && (
                                            <Text className="text-red-500 text-xs mt-2">
                                                {errors.amount}
                                            </Text>
                                        )}
                                        <View className='flex-row flex-wrap justify-between mt-4 gap-3'>
                                            {quickAmounts.map((amt, idx) => (
                                                <TouchableOpacity
                                                    key={idx}
                                                    activeOpacity={0.7}
                                                    className={` ${activeAmountShown === amt ? "bg-green-100" : "bg-gray-100"} py-3 rounded-lg items-center justify-center `}
                                                    style={{ width: "30%" }}
                                                    onPress={(() => {
                                                        setTransaction((s) => ({ ...s, amount: String(amt) }))
                                                        setActiveAmountShown(amt)
                                                        validateField("amount", String(amt))

                                                    })}
                                                >
                                                    <Text className={` ${activeAmountShown === amt ? "text-green-500" : "text-zinc-500"} font-inter-regular text-sm`}> ₦{amt.toLocaleString()}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                    <View className='mt-4 bg-white rounded-2xl shadow-xs  py-4 px-3 border border-transparent '>
                                        <Text className='text-[14px] font-inter-regular'> category </Text>
                                        <View className="mt-4">
                                            <View className="relative">
                                                {/* Placeholder */}
                                                {!transaction.categories && (
                                                    <Text className="absolute left-0 top-2 text-[12px] text-gray-400 font-inter-regular">
                                                        select a category
                                                    </Text>
                                                )}

                                                <TextInput
                                                    ref={categoriesRef}
                                                    className={`mt-2  mb-2 text-[16px] pb-2 text-zinc-700 font-inter-regular border-b 
                                                    ${focused === "merchant" ? "border-green-600" : "border-[#E5E7EB]"}`}
                                                    value={transaction.categories}
                                                    onChangeText={(text) =>
                                                        setTransaction((s) => ({ ...s, categories: text }))
                                                    }
                                                    editable={false}
                                                    pointerEvents='none'
                                                    onFocus={() => setFocused("categories")}
                                                    onBlur={() => setFocused(null)}
                                                    returnKeyType="done"
                                                    cursorColor="#22c55E"
                                                    selectionColor="#22c55E"
                                                />
                                                <View className="flex-row flex-wrap justify-between mt-4 gap-3">
                                                    {catergorySelect.map((cat, idx) => (
                                                        <TouchableOpacity
                                                            key={idx}
                                                            activeOpacity={0.7}
                                                            style={{ width: "30%" }}
                                                            className={`py-3 rounded-lg items-center justify-center 
                                                                ${activeCategory === cat ? "bg-green-100" : "bg-gray-100"}`}
                                                            onPress={() => {
                                                                setTransaction((s) => ({ ...s, categories: cat }));
                                                                setActiveCategory(cat);
                                                                validateField("categories", cat);
                                                                setErrors((prev) => ({ ...prev, categories: undefined }));
                                                            }}
                                                        >
                                                            <Text
                                                                className={`font-inter-regular text-sm 
                                                                    ${activeCategory === cat ? "text-green-500" : "text-zinc-500"}`}
                                                            >
                                                                {cat}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            </View>

                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => { }}
                                        disabled={isDisabled}
                                        className={` px-6 py-5 ${isDisabled ? "bg-gray-300" : "bg-green-600"} w-full transition-colors duration-300 rounded-2xl flex-row items-center justify-center `}
                                    >
                                        <Text className={` text-[15px] ${isDisabled ? "text-gray-500" : "text-white"} `}>  Add Transaction </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </ScrollView>
            </Animated.View>
        </GestureDetector>
    );
};

export default AddTransactionSheet;