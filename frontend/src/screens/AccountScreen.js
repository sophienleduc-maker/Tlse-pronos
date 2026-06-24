import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useAuthStore } from '../stores/authStore';
import axios from 'axios';

const API_URL = process.env.REACT_NATIVE_API_URL || 'http://localhost:5000/api';

const AccountScreen = () => {
  const { user, token, logout } = useAuthStore();
  const [preferences, setPreferences] = useState({
    notifications: true,
    emailUpdates: true,
    darkMode: true
  });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user && token) {
      loadUserStats();
    }
  }, [user, token]);

  const loadUserStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/${user._id}/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.stats);
      if (user.preferences) {
        setPreferences(user.preferences);
      }
    } catch (error) {
      console.error('Failed to load stats', error);
    }
  };

  const handlePreferenceChange = async (key, value) => {
    try {
      setLoading(true);
      const updated = { ...preferences, [key]: value };
      await axios.put(
        `${API_URL}/users/${user._id}/preferences`,
        updated,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPreferences(updated);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de mettre à jour les préférences');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', onPress: () => {} },
        {
          text: 'Déconnexion',
          onPress: async () => {
            await logout();
          },
          style: 'destructive'
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Supprimer le compte',
      'Cette action est irréversible. Tous vos données seront perdues.',
      [
        { text: 'Annuler', onPress: () => {} },
        {
          text: 'Supprimer',
          onPress: async () => {
            try {
              await axios.delete(
                `${API_URL}/users/${user._id}/account`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              await logout();
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer le compte');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.section}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.firstName[0]}{user?.lastName[0]}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
        </View>
      </View>

      {/* Statistics */}
      {stats && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistiques</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Pronostics achetés</Text>
              <Text style={styles.statNumber}>{stats.totalPronoBought}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Taux de réussite</Text>
              <Text style={styles.statNumber}>{stats.bankroll?.winRate || 0}%</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>ROI</Text>
              <Text style={styles.statNumber}>{stats.bankroll?.roi || 0}%</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Bénéfice</Text>
              <Text style={styles.statNumber}>
                {stats.bankroll?.currentBankroll?.toFixed(2) || 0}€
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Préférences</Text>

        <View style={styles.preferenceItem}>
          <View>
            <Text style={styles.preferenceName}>🔔 Notifications</Text>
            <Text style={styles.preferenceDesc}>Recevoir les alertes</Text>
          </View>
          <Switch
            value={preferences.notifications}
            onValueChange={(value) => handlePreferenceChange('notifications', value)}
            trackColor={{ false: '#333', true: '#00ff88' }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.preferenceItem}>
          <View>
            <Text style={styles.preferenceName}>📧 Emails</Text>
            <Text style={styles.preferenceDesc}>Recevoir les mises à jour</Text>
          </View>
          <Switch
            value={preferences.emailUpdates}
            onValueChange={(value) => handlePreferenceChange('emailUpdates', value)}
            trackColor={{ false: '#333', true: '#00ff88' }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.preferenceItem}>
          <View>
            <Text style={styles.preferenceName}>🌙 Mode sombre</Text>
            <Text style={styles.preferenceDesc}>Interface sombre</Text>
          </View>
          <Switch
            value={preferences.darkMode}
            onValueChange={(value) => handlePreferenceChange('darkMode', value)}
            trackColor={{ false: '#333', true: '#00ff88' }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Account Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Compte</Text>

        <TouchableOpacity
          style={[styles.actionButton, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={styles.actionButtonText}>👋 Déconnexion</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.deleteButtonText}>🗑️ Supprimer le compte</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>TLSE PRONOS v1.0.0</Text>
        <Text style={styles.footerText}>© 2026 - Tous droits réservés</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e'
  },
  section: {
    marginVertical: 10,
    paddingHorizontal: 15
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#00ff88'
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00ff88',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  avatarText: {
    color: '#0f0f1e',
    fontSize: 24,
    fontWeight: 'bold'
  },
  profileInfo: {
    flex: 1
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4
  },
  profileEmail: {
    fontSize: 12,
    color: '#888'
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  statItem: {
    width: '48%',
    backgroundColor: '#1a1a2e',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderTopWidth: 2,
    borderTopColor: '#00ff88'
  },
  statLabel: {
    color: '#888',
    fontSize: 11,
    marginBottom: 6
  },
  statNumber: {
    color: '#00ff88',
    fontSize: 18,
    fontWeight: 'bold'
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#00ff88'
  },
  preferenceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 3
  },
  preferenceDesc: {
    fontSize: 12,
    color: '#888'
  },
  actionButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10
  },
  logoutButton: {
    backgroundColor: '#00ff88'
  },
  deleteButton: {
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#ff4444'
  },
  actionButtonText: {
    color: '#0f0f1e',
    fontWeight: 'bold',
    fontSize: 14
  },
  deleteButtonText: {
    color: '#ff4444',
    fontWeight: 'bold',
    fontSize: 14
  },
  footer: {
    marginVertical: 30,
    paddingHorizontal: 15,
    alignItems: 'center'
  },
  footerText: {
    color: '#666',
    fontSize: 11,
    marginBottom: 3
  }
});

export default AccountScreen;
