import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../services/apiClient';

export default function Index() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function determineInitialRoute() {
      try {
        const onboardingDone = await AsyncStorage.getItem('@vku_onboarding_done');
        if (onboardingDone !== 'true') {
          router.replace('/onboarding' as any);
          return;
        }

        const token = await apiClient.getToken();
        if (token) {
          router.replace('/home' as any);
        } else {
          router.replace('/login' as any);
        }
      } catch {
        router.replace('/login' as any);
      } finally {
        setLoading(false);
      }
    }

    determineInitialRoute();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#101D83" />
      </View>
    );
  }

  return null;
}
