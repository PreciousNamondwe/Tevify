import { useSignIn, useOAuth } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View, StyleSheet, Alert, Image } from 'react-native'
import React from 'react'
import * as WebBrowser from 'expo-web-browser'
import { Ionicons } from '@expo/vector-icons'
import { ThemedView } from '@/components/themed-view'
import icon from '@/assets/images/google.png'

// Required for OAuth to work in Expo
WebBrowser.maybeCompleteAuthSession()

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [isEmailLoading, setIsEmailLoading] = React.useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false)

  // Simple Google Sign-In using useOAuth hook
  const onGoogleSignInPress = async () => {
    if (!isLoaded) return;
    setIsGoogleLoading(true);

    try {
      const { createdSessionId, setActive } = await startOAuthFlow();
      
      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        router.replace('/(home)');
      }
    } catch (err: any) {
      console.error('OAuth error:', err);
      if (err.message?.includes('cancelled')) {
        Alert.alert('Cancelled', 'Google sign in was cancelled');
      } else {
        Alert.alert('Error', 'Failed to sign in with Google');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;
    setIsEmailLoading(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/(home)')
      } else {
        console.log('Sign in status:', signInAttempt.status);
        Alert.alert('Info', 'Please check your email for verification');
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      Alert.alert('Error', err.errors?.[0]?.message || 'Failed to sign in')
    } finally {
      setIsEmailLoading(false);
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ThemedView style={styles.container} >
        <Text style={styles.title}>Sign in</Text>
      
      {/* Email Input with Icon */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Email address"
          onChangeText={setEmailAddress}
          keyboardType="email-address"
          editable={!isEmailLoading && !isGoogleLoading}
          placeholderTextColor="#999"
        />
      </View>
      
      {/* Password Input with Icon and Eye Toggle */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={[styles.input, styles.passwordInput]}
          value={password}
          placeholder="Password"
          secureTextEntry={!showPassword}
          onChangeText={setPassword}
          editable={!isEmailLoading && !isGoogleLoading}
          placeholderTextColor="#999"
        />
        <TouchableOpacity 
          onPress={togglePasswordVisibility}
          style={styles.eyeIcon}
          disabled={isEmailLoading || isGoogleLoading}
        >
          <Ionicons 
            name={showPassword ? "eye-off-outline" : "eye-outline"} 
            size={20} 
            color="#666" 
          />
        </TouchableOpacity>
      </View>
      
      {/* Email Sign-In Button */}
      <TouchableOpacity 
        style={[
          styles.primaryButton, 
          (isEmailLoading || isGoogleLoading) && styles.disabledButton
        ]} 
        onPress={onSignInPress}
        disabled={isEmailLoading || isGoogleLoading}
      >
        {isEmailLoading ? (
          <Text style={styles.buttonText}>Signing in...</Text>
        ) : (
          <Text style={styles.buttonText}>Sign in with Email</Text>
        )}
      </TouchableOpacity>

      {/* Separator */}
      <View style={styles.separator}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorText}>OR</Text>
        <View style={styles.separatorLine} />
      </View>

      {/* Google Sign-In Button */}
      <TouchableOpacity 
        style={[
          styles.googleButton, 
          (isEmailLoading || isGoogleLoading) && styles.disabledButton
        ]} 
        onPress={onGoogleSignInPress}
        disabled={isEmailLoading || isGoogleLoading}
      >
         <Image
          source={icon}
          style={styles.googleIcon}
        />
        {isGoogleLoading ? (
          <Text style={styles.googleButtonText}>Connecting...</Text>
        ) : (
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        )}
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <Link href="/sign-up" style={styles.signupLink}>
          <Text style={styles.signupLinkText}>Sign up</Text>
        </Link>
      </View>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
  },
  passwordInput: {
    paddingRight: 10,
  },
  eyeIcon: {
    padding: 5,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  separatorText: {
    marginHorizontal: 15,
    color: '#666',
    fontWeight: '500',
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#4285F4',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  googleIcon: {
     width: 20,
    height: 20,
    marginRight: 12,
    resizeMode: 'contain',
  },
  googleButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  signupText: {
    color: '#666',
    fontSize: 14,
  },
  signupLink: {
    marginLeft: 5,
  },
  signupLinkText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 14,
  },
})