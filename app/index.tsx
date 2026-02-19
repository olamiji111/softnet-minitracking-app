import Header from '@/components/header';
import Transactionblock from '@/components/transactionblock';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = () => {
  return (
    <SafeAreaView className='flex-1 bg-white px-6 -z-40'>
      <Header />
      <Transactionblock />
    </SafeAreaView>

  )
}

export default Home;