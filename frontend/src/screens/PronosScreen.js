import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  TextInput
} from 'react-native';
import { useAuthStore } from '../stores/authStore';
import { usePronoStore } from '../stores/pronoStore';

const PronosScreen = ({ navigation }) => {
  const { token } = useAuthStore();
  const { pronos, getPronos, filterPronos, isLoading, filters } = usePronoStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [sport, setSport] = useState(null);

  const sports = ['Football', 'Basketball', 'Tennis', 'Baseball', 'MMA', 'Esports'];
  const confidenceLevels = ['🟢 Très Haut', '🟡 Haut', '🟠 Moyen', '🔴 Bas'];

  useEffect(() => {
    loadPronos();
  }, [token]);

  const loadPronos = async () => {
    try {
      await getPronos(token);
    } catch (error) {
      console.error('Failed to load pronos', error);
    }
  };

  const handleSportFilter = async (selectedSport) => {
    setSport(selectedSport);
    await filterPronos(token, { sport: selectedSport });
  };

  const handleConfidenceFilter = async (confidence) => {
    await filterPronos(token, { confidence });
  };

  const renderPronoCard = ({ item: prono }) => (
    <TouchableOpacity
      style={styles.pronoCard}
      onPress={() => navigation.navigate('PronoDetail', { pronoId: prono._id })}
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.sport}>{prono.sport}</Text>
          <Text style={styles.event}>{prono.event}</Text>
        </View>
        <Text style={styles.confidence}>{prono.confidence}</Text>
      </View>

      <Text style={styles.competition}>{prono.competition}</Text>
      <Text style={styles.prediction}>{prono.prediction}</Text>

      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.oddsLabel}>Cote</Text>
          <Text style={styles.odds}>{prono.odds}</Text>
        </View>
        <View>
          <Text style={styles.ratingLabel}>Note</Text>
          <Text style={styles.rating}>{prono.ratings.average.toFixed(1)} ⭐</Text>
        </View>
        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyButtonText}>0,99 €</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterHeader}>
        <TextInput
          style={styles.searchInput}
          placeholder="Chercher..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.sportFilter}
        contentContainerStyle={styles.sportFilterContent}
      >
        {sports.map((s) => (
          <TouchableOpacity
            key={s}
            style={[
              styles.sportChip,
              sport === s && styles.sportChipActive
            ]}
            onPress={() => handleSportFilter(s)}
          >
            <Text style={[
              styles.sportChipText,
              sport === s && styles.sportChipTextActive
            ]}>
              {s}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#00ff88" size="large" />
        </View>
      ) : (
        <FlatList
          data={pronos}
          renderItem={renderPronoCard}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e'
  },
  filterHeader: {
    backgroundColor: '#1a1a2e',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#00ff88'
  },
  searchInput: {
    backgroundColor: '#0f0f1e',
    borderWidth: 1,
    borderColor: '#00ff88',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    fontSize: 14
  },
  sportFilter: {
    backgroundColor: '#1a1a2e',
    paddingVertical: 10
  },
  sportFilterContent: {
    paddingHorizontal: 10
  },
  sportChip: {
    backgroundColor: '#0f0f1e',
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginHorizontal: 5
  },
  sportChipActive: {
    backgroundColor: '#00ff88',
    borderColor: '#00ff88'
  },
  sportChipText: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600'
  },
  sportChipTextActive: {
    color: '#0f0f1e',
    fontWeight: 'bold'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  listContent: {
    padding: 15
  },
  pronoCard: {
    backgroundColor: '#1a1a2e',
    borderLeftWidth: 4,
    borderLeftColor: '#00ff88',
    padding: 15,
    marginBottom: 12,
    borderRadius: 8
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  sport: {
    color: '#00ff88',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 4
  },
  event: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14
  },
  confidence: {
    fontSize: 16
  },
  competition: {
    color: '#888',
    fontSize: 12,
    marginBottom: 6
  },
  prediction: {
    color: '#fff',
    fontSize: 13,
    marginBottom: 12,
    fontStyle: 'italic'
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333'
  },
  oddsLabel: {
    color: '#888',
    fontSize: 11,
    marginBottom: 2
  },
  odds: {
    color: '#00ff88',
    fontWeight: 'bold',
    fontSize: 14
  },
  ratingLabel: {
    color: '#888',
    fontSize: 11,
    marginBottom: 2
  },
  rating: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12
  },
  buyButton: {
    backgroundColor: '#00ff88',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6
  },
  buyButtonText: {
    color: '#0f0f1e',
    fontWeight: 'bold',
    fontSize: 12
  }
});

export default PronosScreen;
