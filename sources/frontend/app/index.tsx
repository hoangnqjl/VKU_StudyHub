import { Redirect } from 'expo-router';

// Entry point: redirect to auth by default (in production, check auth state)
export default function Index() {
  return <Redirect href="/(auth)/welcome" />;
}
