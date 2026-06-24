import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { usePronoStore } from '../stores/pronoStore';
import { useAuthStore } from '../stores/authStore';

const PronoDetailScreen = ({ route, navigation }) => {
  const { pronoId } = route.params;
  const { selectedProno, getPronoById, buyProno, isLoading } = usePronoStore();
  const { token } = useAuthStore();
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    if (token && pronoId) {
      loadProno();
    }
  }, [token, pronoId]);

  const loadProno = async () => {
    try {
      await getPronoById(token, pronoId);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger le pronostic');
    }
  };

  const handleBuyProno = async () => {
    try {
      setPurchasing(true);
      await buyProno(token, pronoId);
      Alert.alert('Succès', 'Pronostic acheté avec succès!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'acheter le pronostic');
    } finally {
      setPurchasing(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#00ff88" size="large" />
      </View>
    );
  }

  if (!selectedProno) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Pronostic non trouvé</Text>
      </View>
    );
  }

  const prono = selectedProno;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.sport}>{prono.sport}</Text>
          <Text style={styles.confidence}>{prono.confidence}</Text>
        </View>
        <Text style={styles.event}>{prono.event}</Text>
        <Text style={styles.competition}>{prono.competition}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Équipes</Text>
        <View style={styles.teamsList}>
          {prono.teams.map((team, index) => (
            <View key={index} style={styles.teamItem}>
              <Text style={styles.teamName}>⚽ {team}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prédiction</Text>
        <View style={styles.predictionCard}>
          <Text style={styles.predictionText}>{prono.prediction}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Analyse Détaillée</Text>
        <View style={styles.analysisCard}>
          <Text style={styles.analysisText}>{prono.analysis}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Cote</Text>
            <Text style={styles.infoValue}>{prono.odds}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Confiance</Text>
            <Text style={styles.infoValue}>{prono.confidencePercentage}%</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Achetés</Text>
            <Text style={styles.infoValue}>{prono.purchaseCount}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Note</Text>
            <Text style={styles.infoValue}>{prono.ratings.average.toFixed(1)} ⭐</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Auteur</Text>
        <View style={styles.authorCard}>
          <Text style={styles.authorName}>👤 {prono.author}</Text>
        </View>
      </View>

      <View style={styles.purchaseSection}>
        <TouchableOpacity
          style={[styles.buyButton, purchasing && styles.buyButtonDisabled]}
          onPress={handleBuyProno}
          disabled={purchasing}
        >
          {purchasing ? (
            <ActivityIndicator color="#0f0f1e" />
          ) : (
            <Text style={styles.buyButtonText}>Acheter ce pronostic - 0,99 €</Text>
          )}
        </TouchableOpacity>
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
  header: {
    backgroundColor: '#1a1a2e',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#00ff88'
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  sport: {
    color: '#00ff88',
    fontWeight: 'bold',
    fontSize: 14
  },
  confidence: {
    fontSize: 16
  },
  event: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5
  },
  competition: {
    color: '#888',
    fontSize: 14
  },
  section: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12
  },
  teamsList: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  teamItem: {
    width: '48%',
    backgroundColor: '#1a1a2e',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    marginRight: '2%'
  },
  teamName: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13
  },
  predictionCard: {
    backgroundColor: '#1a1a2e',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#00ff88'
  },
  predictionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 22
  },
  analysisCard: {
    backgroundColor: '#1a1a2e',
    padding: 15,
    borderRadius: 8
  },
  analysisText: {
    color: '#888',
    fontSize: 13,
    lineHeight: 20
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  infoBox: {
    width: '48%',
    backgroundColor: '#1a1a2e',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderTopWidth: 2,
    borderTopColor: '#00ff88',
    alignItems: 'center'
  },
  infoLabel: {
    color: '#888',
    fontSize: 11,
    marginBottom: 4
  },
  infoValue: {
    color: '#00ff88',
    fontSize: 16,
    fontWeight: 'bold'
  },
  authorCard: {
    backgroundColor: '#1a1a2e',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#00ff88'
  },
  authorName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  },
  purchaseSection: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#1a1a2e'
  },
  buyButton: {
    backgroundColor: '#00ff88',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  buyButtonDisabled: {
    opacity: 0.6
  },
  buyButtonText: {
    color: '#0f0f1e',
    fontWeight: 'bold',
    fontSize: 16
  },
  error: {
    color: '#ff4444',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14
  }
});

export default PronoDetailScreen;
