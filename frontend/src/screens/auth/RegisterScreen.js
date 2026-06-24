import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import { useAuthStore } from '../../stores/authStore';

const RegisterScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, isLoading, error } = useAuthStore();

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    try {
      await register(email, password, firstName, lastName);
    } catch (error) {
      Alert.alert('Erreur d\'inscription', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scroll}>
        <View style={styles.content}>
          <Text style={styles.logo}>🎯 TLSE PRONOS</Text>
          <Text style={styles.subtitle}>Créer un compte</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Prénom</Text>
            <TextInput
              style={styles.input}
              placeholder="Jean"
              placeholderTextColor="#666"
              value={firstName}
              onChangeText={setFirstName}
              editable={!isLoading}
            />

            <Text style={styles.label}>Nom</Text>
            <TextInput
              style={styles.input}
              placeholder="Dupont"
              placeholderTextColor="#666"
              value={lastName}
              onChangeText={setLastName}
              editable={!isLoading}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="votre@email.com"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
              keyboardType="email-address"
            />

            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
            />

            <Text style={styles.label}>Confirmer le mot de passe</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#666"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              editable={!isLoading}
            />

            {error && <Text style={styles.error}>{error}</Text>}

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#0f0f1e" />
              ) : (
                <Text style={styles.buttonText}>S'inscrire</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>
                Déjà inscrit ? <Text style={styles.linkBold}>Se connecter</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e'
  },
  scroll: {
    flex: 1
  },
  content: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#00ff88',
    textAlign: 'center',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 30
  },
  form: {
    marginTop: 20
  },
  label: {
    fontSize: 14,
    color: '#00ff88',
    marginBottom: 8,
    fontWeight: '600'
  },
  input: {
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#00ff88',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 14,
    fontSize: 14
  },
  button: {
    backgroundColor: '#00ff88',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20
  },
  buttonDisabled: {
    opacity: 0.6
  },
  buttonText: {
    color: '#0f0f1e',
    fontSize: 16,
    fontWeight: 'bold'
  },
  error: {
    color: '#ff4444',
    marginBottom: 12,
    fontSize: 12
  },
  link: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14
  },
  linkBold: {
    color: '#00ff88',
    fontWeight: 'bold'
  }
});

export default RegisterScreen;
