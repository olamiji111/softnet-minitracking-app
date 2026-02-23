import { icons } from '@/constants/icons';
import { transactions } from '@/lib/data';
import { useTransactionStore } from '@/store';
import { formatDate } from '@/utils';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';


// ------ Transaction Item ----------
const TransactionItem = ({ item }: { item: typeof transactions[0] }) => {
    const router = useRouter();
    const statusStyles: Record<string, { bg: string; text: string }> = {
        completed: { bg: "bg-green-100", text: "text-green-600" },
        pending: { bg: "bg-yellow-200", text: "text-yellow-600" },
        failed: { bg: "bg-red-100", text: "text-red-500" },
        reversed: { bg: "bg-red-100", text: "text-red-500" },
        "to be paid": { bg: "bg-yellow-200", text: "text-yellow-600" }
    }
    const statusStyle = statusStyles[item.status.toLowerCase()] || statusStyles["pending"];

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            className='flex-row justify-between items-center py-2.5 px-2 border-transparent'
            onPress={() => router.push(`/transactionDetail/${item.id}`)}
        >
            <View className='flex-row items-center gap-1.5'>
                <View className='px-4 py-4 rounded-full bg-green-100'>
                    <MaterialIcons
                        name={item.amount > 0 ? "arrow-downward" : "arrow-upward"}
                        size={22}
                        color="#22c55e"
                    />
                </View>
                <View className='flex-col gap-2'>
                    <Text className='font-inter-regular text-sm text-black'> {item.merchant} </Text>
                    <Text className='text-xs font-inter-light text-black-100'>{formatDate(item.date)} </Text>
                </View>
            </View>
            <View className='flex-col items-end gap-1'>
                <Text className={` text-sm font-inter-semibold ${item.amount >= 0 ? "text-green-500" : "text-black"}`}>
                    {item.amount >= 0
                        ? `+₦${item.amount.toFixed(2)}`
                        : `- ₦${Math.abs(item.amount).toFixed(2)}`
                    }
                </Text>
                <Text className={` text-xs font-inter-light px-2 py-1 rounded ${statusStyle.bg} ${statusStyle.text}`}>
                    {item.status}
                </Text>

            </View>
        </TouchableOpacity>
    );
};
const Transactionblock = () => {
    const store = useTransactionStore();

    const [list, setList] = useState<typeof store.allTransactions>([]);
    const [loading, setLoading] = useState(false);
    const [noMore, setNoMore] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(false);
    const [showNoMore, setShowNoMore] = useState(false)

    const bottomLock = useRef(false);

    // Load initial batch whenever filter changes
    const loadInitial = () => {
        store.loadedCount = 0;
        const filtered = store.getFiltered();
        const nextBatch = filtered.slice(0, store.batchSize);
        store.loadedCount = nextBatch.length;

        setList(nextBatch);
        setNoMore(false); // reset
    };

    useEffect(() => {
        loadInitial();
    }, [store.activeCategory, store.activeStatus]);

    useEffect(() => {
        if (noMore && isAtBottom) {
            setShowNoMore(true);

            const timer = setTimeout(() => {
                setShowNoMore(false); // hide after 3 seconds
            }, 1500); // 3 seconds delay

            return () => clearTimeout(timer); // cleanup if effect re-runs
        }
    }, [noMore, isAtBottom]);
    // Load next batch
    const loadMore = () => {
        if (loading) return;

        setLoading(true);

        setTimeout(() => {
            const filtered = store.getFiltered();
            const nextBatch = store.getNextBatch();

            if (nextBatch.length) {
                setList(prev => {
                    // prevent duplicates by id
                    const existingIds = new Set(prev.map(i => i.id));
                    const uniqueNext = nextBatch.filter(i => !existingIds.has(i.id));
                    return [...prev, ...uniqueNext];
                });
            }

            if (store.loadedCount >= filtered.length) setNoMore(true);

            setLoading(false);
        }, 300);
    };

    // Scroll handler
    const handleScroll = (e: any) => {
        const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent;
        const bottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 2;

        if (bottom && !bottomLock.current) {
            bottomLock.current = true;
            setIsAtBottom(true);
            loadMore();
        }

        if (!bottom && bottomLock.current) {
            bottomLock.current = false;
            setIsAtBottom(false);
        }
    };

    const filtered = store.getFiltered();

    return (
        <View className="mt-8 ">
            {/* Scrollable container */}
            <View className="py-4 shadow-xs bg-white-400 rounded-2xl overflow-hidden" style={{ maxHeight: 600 }}>

                <View className="px-2">
                    <View className="flex-row flex-between">
                        <View className="flex flex-col items-start gap-1.5">
                            <TouchableOpacity className="flex-row gap-1 items-center">
                                <Text className="font-inter-regular text-sm">Feb</Text>
                                <Image source={icons.menuDown} className="object-contain size-2.5" />
                            </TouchableOpacity>
                            <Text className="text-xs font-inter-regular">
                                In ₦78,000 Out ₦92,000
                            </Text>
                        </View>

                        <TouchableOpacity className="bg-green-500 rounded-full px-4 py-2">
                            <Text className="font-inter-regular text-sm text-white">
                                Analysis
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="h-px mt-4 bg-gray-200 w-full" />

                {/* LIST */}
                {filtered.length === 0 ? (
                    <View className="py-12 items-center">
                        <Text className="text-gray-400 text-sm">No transactions for this combination</Text>
                    </View>
                ) : (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 10 }}
                        scrollEventThrottle={16}
                        onScroll={handleScroll}
                        bounces={false}
                    >
                        {list.map(item => (
                            <TransactionItem key={item.id} item={item} />
                        ))}
                    </ScrollView>
                )}
            </View>


            <View className="h-10 items-center justify-center mt-2">
                {loading && (
                    <View className="flex-row items-center gap-2">
                        <ActivityIndicator size="small" color="#22c55e" />
                        <Text className="text-xs text-gray-400">
                            Checking for more transactions...
                        </Text>
                    </View>
                )}

                {!loading && showNoMore && isAtBottom && (
                    <Text className="text-xs text-gray-400">
                        No more transactions
                    </Text>
                )}
            </View>
        </View>
    );
}
export default Transactionblock;


