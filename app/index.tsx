import Header from '@/components/header';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = () => {
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Header />
    </SafeAreaView>

  )
}

export default Home;