import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useAuthStore } from '../stores/authStore';
import { usePronoStore } from '../stores/pronoStore';

const HomeScreen = ({ navigation }) => {
  const { user, token } = useAuthStore();
  const { pronos, getPronos, isLoading } = usePronoStore();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const loadData = async () => {
    try {
      await getPronos(token, 1, 5);
    } catch (error) {
      console.error('Failed to load data', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bienvenue 👋</Text>
          <Text style={styles.name}>{user?.firstName} {user?.lastName}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Pronostics achetés</Text>
          <Text style={styles.statValue}>{user?.pronoBought?.length || 0}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Taux de réussite</Text>
          <Text style={styles.statValue}>{user?.bankroll?.winRate || 0}%</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>ROI</Text>
          <Text style={styles.statValue}>{user?.bankroll?.roi || 0}%</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Derniers Pronostics</Text>
          <TouchableOpacity onPress={() => navigation.navigate('PronosTab')}>
            <Text style={styles.viewAll}>Voir tout</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator color="#00ff88" size="large" />
        ) : pronos.length > 0 ? (
          pronos.slice(0, 3).map((prono) => (
            <TouchableOpacity
              key={prono._id}
              style={styles.pronoCard}
              onPress={() => navigation.navigate('PronosTab', {
                screen: 'PronoDetail',
                params: { pronoId: prono._id }
              })}
            >
              <View style={styles.pronoHeader}>
                <Text style={styles.sport}>{prono.sport}</Text>
                <Text style={styles.confidence}>{prono.confidence}</Text>
              </View>
              <Text style={styles.event}>{prono.event}</Text>
              <Text style={styles.prediction}>{prono.prediction}</Text>
              <View style={styles.pronoFooter}>
                <Text style={styles.odds}>Cote: {prono.odds}</Text>
                <Text style={styles.price}>0,99 €</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noData}>Aucun pronostic disponible</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e'
  },
  header: {
    backgroundColor: '#1a1a2e',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#00ff88'
  },
  greeting: {
    fontSize: 18,
    color: '#888',
    marginBottom: 5
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00ff88'
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-between'
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    borderLeftWidth: 3,
    borderLeftColor: '#00ff88'
  },
  statLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 5
  },
  statValue: {
    color: '#00ff88',
    fontSize: 18,
    fontWeight: 'bold'
  },
  section: {
    padding: 15
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  },
  viewAll: {
    color: '#00ff88',
    fontSize: 12,
    fontWeight: '600'
  },
  pronoCard: {
    backgroundColor: '#1a1a2e',
    borderLeftWidth: 4,
    borderLeftColor: '#00ff88',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8
  },
  pronoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  sport: {
    color: '#00ff88',
    fontWeight: 'bold',
    fontSize: 12
  },
  confidence: {
    fontSize: 14
  },
  event: {
    color: '#fff',
    fontWeight: '600',
    marginBottom: 4,
    fontSize: 14
  },
  prediction: {
    color: '#888',
    fontSize: 12,
    marginBottom: 8
  },
  pronoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#333'
  },
  odds: {
    color: '#00ff88',
    fontWeight: 'bold',
    fontSize: 12
  },
  price: {
    color: '#00ff88',
    fontWeight: 'bold',
    fontSize: 12
  },
  noData: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14
  }
});

export default HomeScreen;
