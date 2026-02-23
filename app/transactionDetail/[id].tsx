import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useTransactionStore } from "@/store";
import { Transaction } from "@/types/type";
import { formatDate, generateTransactionNumber } from "@/utils";
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';


const Header = () => {
    const router = useRouter();

    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);


    const handleDownloadPress = () => {
        scale.value = withTiming(0.55, { duration: 100 });
        opacity.value = withTiming(0.3, { duration: 100 });

        setTimeout(() => {
            scale.value = withTiming(1, { duration: 120 });
            opacity.value = withTiming(1, { duration: 120 });
        }, 100);
    };
    return (
        <View className="px-5 pt-12 flex-row items-center justify-between   bg-white" style={{ height: 100 }}>

            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.back()}

            >
                <MaterialIcons
                    name="arrow-back-ios"
                    size={22}
                    color="#000"
                />

            </TouchableOpacity>
            <Text className="text-black text-[15px] font-inter-bold capitalize touch-pan-up ">
                Transaction details
            </Text>

            <TouchableOpacity

                onPress={handleDownloadPress}
            >
                <Image
                    source={icons.Customer}
                    className='h-11 w-12 object-contain'
                    resizeMode='contain'
                    width={20}

                />
            </TouchableOpacity>



        </View>
    );
};

const DashedLine = () => (
    <View className="flex-row w-full mt-3">
        {Array.from({ length: 48 }).map((_, i) => (
            <View
                key={i}
                style={{
                    width: 4,
                    height: 1,
                    backgroundColor: "#E5E7EB",
                    marginRight: 3,
                }}
            />
        ))}
    </View>
);

const TransactionDetail = () => {
    const { id } = useLocalSearchParams<{ id: string }>();

    const insets = useSafeAreaInsets();

    //get transaction By ID
    const getTransactionById = (id: string | number, transactions: Transaction[]) => {
        return transactions.find(t => String(t.id) === String(id));
    };

    const transactions = useTransactionStore(state => state.allTransactions);
    const tx = getTransactionById(id, transactions) as Transaction;

    const txNumber = generateTransactionNumber(tx.id);
    return (
        <SafeAreaView edges={["bottom"]} className='bg-white-300 flex-1'>
            <Header />
            <View className="px-5 mt-8 py-2 flex-1">
                <View className='flex-col gap-y-4  border  border-transparent shadow-xs bg-white   rounded-2xl items-center justify-center' style={{ height: 170 }}>
                    <View className='absolute -top-6 translate-x-1/2'>
                        <Image
                            source={images.SoftnetLogo}
                            className='size-12 object-contain'
                            resizeMode='contain'
                        />
                    </View>

                    <Text className="text-md uppercase  text-center pt-6 font-inter-semibold text-black-300 tracking-widest"> {` ${tx?.merchant} Account`}</Text>
                    <Text className="text-xl font-inter-bold text-black-300 tracking-wide">
                        {tx.amount >= 0
                            ? `₦${tx.amount.toFixed(2)}`
                            : `₦${Math.abs(tx.amount).toFixed(2)}`}
                    </Text>
                    <View className="flex-row items-center gap-2 mt-2">
                        <View className="p-2 rounded-full bg-gray-100">
                            <MaterialIcons
                                name={
                                    tx.status === "completed"
                                        ? "check-circle"
                                        : tx.status === "failed"
                                            ? "cancel"
                                            : tx.status === "pending"
                                                ? "schedule"
                                                : "hourglass-empty"
                                }
                                size={18}
                                color={
                                    tx.status === "completed"
                                        ? "#22c55e"
                                        : tx.status === "failed"
                                            ? "#ef4444"
                                            : "#f59e0b"
                                }
                            />
                        </View>

                        <Text className="text-sm capitalize text-gray-600">
                            {tx.status}
                        </Text>
                    </View>
                </View>

                <View className='mt-6 px-5 py-6 border  border-transparent shadow-xs bg-white  rounded-2xl ' style={{ height: 180 }}>
                    <Text className="text-md font-inter-semibold text-black-300"> Transaction Details </Text>
                    <View className="flex-row items-center justify-between py-2 mt-2">
                        <Text className="text-[11px] text-black-100 font-inter-regular"> User ID</Text>
                        <Text className="text-[12px] font-inter-semibold text-black-300"> {tx.id}</Text>
                    </View>

                    <View className="flex-row items-center justify-between py-2 ">
                        <Text className="text-[11px] text-black-100 font-inter-regular"> categories details </Text>
                        <Text className="text-[12px] font-inter-semibold text-black-300"> {tx.category}</Text>
                    </View>
                    <View className="flex-row items-center justify-between py-2">
                        <Text className="text-[12px] text-black-100 font-inter-regular">
                            Transaction No.
                        </Text>

                        <View className="flex-row items-center gap-x-1">
                            <Text className="text-[11px] font-inter-semibold text-black-300">
                                {txNumber}
                            </Text>

                            <MaterialIcons
                                name="content-copy"
                                size={10}
                                color="#000"
                            />
                        </View>
                    </View>
                    <View className="flex-row items-center justify-between py-2">
                        <Text className="text-[11px] text-black-100 font-inter-regular"> Transaction Date </Text>
                        <Text className="text-[12px] font-inter-semibold text-black-300"> {`${formatDate(tx.date)} 10:00:23`} </Text>
                    </View>

                </View>

                <View className='mt-6  px-4 py-4 border  border-transparent shadow-xs bg-white  rounded-2xl flex-col gap-y-3 overflow-y-hidden' >
                    <Text className="text-md font-inter-semibold text-black-300"> More Actions</Text>
                    <DashedLine />
                    <View className="flex-row items-center gap-x-10 w-full">
                        <TouchableOpacity
                            activeOpacity={0.7}
                            className="flex-row mt-2 gap-x-0.5 items-center"
                            onPress={() => { }}
                        >
                            <MaterialIcons name="repeat" size={16} color="#22C55E" />
                            <Text className="text-sm font-inter-regular text-green-500 "> Transfer Again</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            className="flex-row mt-2 gap-x-0.5 items-center"
                            onPress={() => { }}
                        >
                            <MaterialIcons name="history" size={16} color="#22C55E" />
                            <Text className="text-sm font-inter-regular text-green-500 "> View Records </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View
                    style={{ paddingBottom: insets.bottom }}
                    className="absolute -bottom-4 left-0 right-0 px-4 flex-row justify-center gap-x-6"
                >
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => { }}
                        className="rounded-full px-6 py-4 bg-green-100 items-center justify-center"
                    >
                        <Text className="text-green-500 font-inter-regular"> Report Issue</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => { }}
                        className="rounded-full px-6 py-4 bg-green-500 items-center justify-center"
                    >
                        <Text className=" font-inter-regular capitalize text-white "> Share Receipt </Text>
                    </TouchableOpacity>
                </View>
            </View>

        </SafeAreaView>

    )
}

export default TransactionDetail;