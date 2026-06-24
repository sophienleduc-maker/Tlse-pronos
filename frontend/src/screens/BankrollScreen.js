import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { LineChart } from 'react-native-svg-charts';
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const API_URL = process.env.REACT_NATIVE_API_URL || 'http://localhost:5000/api';
const { width } = Dimensions.get('window');

const BankrollScreen = () => {
  const { user, token } = useAuthStore();
  const [bankroll, setBankroll] = useState(null);
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadBankrollData();
    }
  }, [token]);

  const loadBankrollData = async () => {
    try {
      setLoading(true);
      const [bankrollRes, statsRes, historyRes] = await Promise.all([
        axios.get(`${API_URL}/bankroll`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/bankroll/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/bankroll/history`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setBankroll(bankrollRes.data.bankroll);
      setStats(statsRes.data.stats);
      setHistory(historyRes.data.transactions || []);
    } catch (error) {
      console.error('Failed to load bankroll data', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = history.slice(0, 30).map(t => t.amount).reverse();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#00ff88" size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.label}>Solde actuel</Text>
        <Text style={styles.balance}>
          {stats?.currentBankroll.toFixed(2) || 0}€
        </Text>
        <Text style={styles.profit}>
          Bénéfice: +{stats?.profit.toFixed(2) || 0}€
        </Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Total Paris</Text>
          <Text style={styles.statValue}>{stats?.totalBets || 0}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Victoires</Text>
          <Text style={[styles.statValue, { color: '#4ade80' }]}>{stats?.totalWins || 0}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Défaites</Text>
          <Text style={[styles.statValue, { color: '#ff4444' }]}>{stats?.totalLosses || 0}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Taux Réussite</Text>
          <Text style={styles.statValue}>{stats?.winRate.toFixed(2) || 0}%</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Graphique Performance</Text>
        {chartData.length > 0 ? (
          <LineChart
            style={styles.chart}
            data={chartData}
            svg={{ stroke: '#00ff88', strokeWidth: 2 }}
            contentInset={{ top: 20, bottom: 20, left: 10, right: 10 }}
          />
        ) : (
          <Text style={styles.noData}>Pas de données</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Historique Récent</Text>
        {history.slice(0, 10).map((transaction, index) => (
          <View key={index} style={styles.historyItem}>
            <View>
              <Text style={styles.historyType}>
                {transaction.type === 'purchase' ? '💳 Achat' : '✅ Gain'}
              </Text>
              <Text style={styles.historyDate}>
                {new Date(transaction.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <Text style={[
              styles.historyAmount,
              { color: transaction.type === 'purchase' ? '#ff4444' : '#4ade80' }
            ]}>
              {transaction.type === 'purchase' ? '-' : '+'}{transaction.amount.toFixed(2)}€
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f1e'
  },
  headerCard: {
    backgroundColor: '#1a1a2e',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#00ff88'
  },
  label: {
    color: '#888',
    fontSize: 12,
    marginBottom: 5
  },
  balance: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#00ff88',
    marginBottom: 8
  },
  profit: {
    color: '#4ade80',
    fontSize: 14,
    fontWeight: '600'
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    marginBottom: 15
  },
  statBox: {
    width: '48%',
    backgroundColor: '#1a1a2e',
    padding: 12,
    marginHorizontal: 5,
    marginBottom: 10,
    borderRadius: 8,
    borderTopWidth: 2,
    borderTopColor: '#00ff88'
  },
  statTitle: {
    color: '#888',
    fontSize: 12,
    marginBottom: 6
  },
  statValue: {
    color: '#00ff88',
    fontSize: 20,
    fontWeight: 'bold'
  },
  section: {
    paddingHorizontal: 15,
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12
  },
  chart: {
    height: 200,
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    marginBottom: 15
  },
  noData: {
    color: '#888',
    textAlign: 'center',
    paddingVertical: 20
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#00ff88'
  },
  historyType: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13
  },
  historyDate: {
    color: '#888',
    fontSize: 11,
    marginTop: 3
  },
  historyAmount: {
    fontWeight: 'bold',
    fontSize: 14
  }
});

export default BankrollScreen;
