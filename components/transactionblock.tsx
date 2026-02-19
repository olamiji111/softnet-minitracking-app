import { icons } from '@/constants/icons';
import { transactions } from '@/lib/data';
import { formatDate } from '@/utils';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';



// ------ Transaction Item ----------
const TransactionItem = ({ item }: { item: typeof transactions[0] }) => {
    const statusStyles: Record<string, { bg: string; text: string }> = {
        completed: { bg: "bg-green-100", text: "text-gray-500" },
        pending: { bg: "bg-yellow-100", text: "text-yellow-500" },
        failed: { bg: "bg-red-100", text: "text-red-500" },
        reversed: { bg: "bg-red-300", text: "text-red-700" },
        "to be paid": { bg: "bg-yellow-200", text: "text-yellow-600" }
    }
    const statusStyle = statusStyles[item.status.toLowerCase()] || statusStyles["pending"];

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            className='flex-row justify-between items-center py-3 px-2 border-transparent'
            onPress={() => console.log("Transaction details triggered", item.id)}
        >
            <View className='flex-row items-center gap-3'>
                <View className='p-2 rounded-full bg-green-100'>
                    <MaterialIcons
                        name={item.amount > 0 ? "arrow-downward" : "arrow-upward"}
                        size={18}
                        color="#22c55e"
                    />
                </View>
                <View className='flex-col gap-2'>
                    <Text className='font-inter-regular text-sm text-black'> {item.merchant} </Text>
                    <Text className='text-xs font-inter-light text-black-100'>{formatDate(item.date)} </Text>
                </View>
            </View>
            <View className='flex-col items-end gap-2'>
                <Text className={` text-sm font-inter-semibold ${item.amount >= 0 ? "text-green-500" : "text-black"}`}>
                    {item.amount >= 0
                        ? `₦${item.amount.toFixed(2)}`
                        : `₦${Math.abs(item.amount).toFixed(2)}`
                    }
                </Text>
                <Text className={` text-xs font-inter-light px-2 py-1 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                    {item.status}
                </Text>

            </View>
        </TouchableOpacity>
    )
}

const Transactionblock = () => {
    const sortedTransactions = transactions.slice()
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <View className='mt-8 py-4 shadow-xs border border-transparent bg-white-400 h-auto rounded-lg'>
            <View className='px-2'>
                <View className='flex-row flex-between'>
                    <View className='flex flex-col items-start gap-1.5'>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            className='border-transparent flex-row gap-1 items-center'
                            onPress={() => { }}
                        >
                            <Text className='font-inter-regular text-sm'> Feb</Text>
                            <Image
                                source={icons.menuDown}
                                className="object-contain size-2.5"
                                resizeMode='contain'
                            />
                        </TouchableOpacity>
                        <Text className='text-xs font-inter-regular'> In ₦78,000  Out ₦92,000 </Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.7} className='bg-green-500 flex items-center rounded-full border-transparent px-4 py-2'>
                        <Text className='font-inter-regular text-sm text-white'>
                            Analysis
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View className="h-px  mt-4 bg-gray-200 w-full" />
            {/* ScrollView Area to map out /flat list my transaction block */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                className='px-2 '
                contentContainerStyle={{ paddingBottom: 20, }}

            >

                <FlatList
                    data={sortedTransactions}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ padding: 8, paddingBottom: 20 }}
                    renderItem={({ item }) => <TransactionItem item={item} />}
                />


            </ScrollView>

        </View>
    )
}

export default Transactionblock;