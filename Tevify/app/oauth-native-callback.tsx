import { useEffect } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSignIn } from '@clerk/clerk-expo';

// This screen handles the OAuth callback
export default function OAuthCallback() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const handleOAuthCallback = async () => {
      try {
        // Check if we have an ongoing sign-in attempt
        if (signIn && signIn.status === 'needs_second_factor') {
          // Reload to complete the OAuth flow
          await signIn.reload();
          
          if (signIn.status === 'complete') {
            await setActive({ session: signIn.createdSessionId });
            router.replace('/(home)'); // Redirect to home
            return;
          }
        }
        
        // If no ongoing OAuth flow or something went wrong, redirect to home
        // This handles the case where Google auth completed successfully
        // but we don't have a signIn object to reload
        router.replace('/(home)');
        
      } catch (err) {
        console.error('OAuth callback error:', err);
        // Even if there's an error, redirect to home
        // The user might already be authenticated
        router.replace('/(tabs)');
      }
    };

    handleOAuthCallback();
  }, [isLoaded, signIn, setActive, router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text>Completing sign in...</Text>
    </View>
  );
}