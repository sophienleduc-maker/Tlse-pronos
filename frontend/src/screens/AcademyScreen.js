import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList
} from 'react-native';

const AcademyScreen = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const categories = [
    {
      id: 1,
      title: '📚 Gestion de Bankroll',
      lessons: [
        {
          id: 1,
          title: 'Principes fondamentaux',
          description: 'Apprenez les bases de la gestion de bankroll',
          duration: '5 min'
        },
        {
          id: 2,
          title: 'Stratégie Kelly Criterion',
          description: 'La formule mathématique pour optimiser vos mises',
          duration: '8 min'
        },
        {
          id: 3,
          title: 'Gestion du risque',
          description: 'Comment protéger votre capital',
          duration: '6 min'
        }
      ]
    },
    {
      id: 2,
      title: '🎯 Stratégies de Paris',
      lessons: [
        {
          id: 4,
          title: 'Value Betting',
          description: 'Trouver les meilleures cotes',
          duration: '7 min'
        },
        {
          id: 5,
          title: 'Arbitrage',
          description: 'Profiter des différences de cotes',
          duration: '9 min'
        },
        {
          id: 6,
          title: 'Hedging',
          description: 'Couvrir vos positions',
          duration: '6 min'
        }
      ]
    },
    {
      id: 3,
      title: '💡 Analyse Sportive',
      lessons: [
        {
          id: 7,
          title: 'Analyse des statistiques',
          description: 'Interpréter les données sportives',
          duration: '10 min'
        },
        {
          id: 8,
          title: 'Tendances et formes',
          description: 'Analyser la forme des équipes',
          duration: '8 min'
        },
        {
          id: 9,
          title: 'Facteurs externes',
          description: 'Météo, blessures, suspensions',
          duration: '7 min'
        }
      ]
    },
    {
      id: 4,
      title: '🧠 Psychologie du Parieur',
      lessons: [
        {
          id: 10,
          title: 'Gestion émotionnelle',
          description: 'Contrôler vos émotions',
          duration: '8 min'
        },
        {
          id: 11,
          title: 'Éviter les biais cognitifs',
          description: 'Les pièges mentaux à éviter',
          duration: '9 min'
        },
        {
          id: 12,
          title: 'Discipline et routine',
          description: 'Construire une approche gagnante',
          duration: '6 min'
        }
      ]
    }
  ];

  const renderLesson = ({ item }) => (
    <TouchableOpacity style={styles.lessonCard}>
      <View style={styles.lessonHeader}>
        <View style={styles.lessonInfo}>
          <Text style={styles.lessonTitle}>{item.title}</Text>
          <Text style={styles.lessonDesc}>{item.description}</Text>
        </View>
        <Text style={styles.duration}>{item.duration}</Text>
      </View>
      <TouchableOpacity style={styles.watchButton}>
        <Text style={styles.watchButtonText}>Regarder ▶️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }) => (
    <View style={styles.categoryContainer}>
      <TouchableOpacity
        style={styles.categoryHeader}
        onPress={() => setExpandedCategory(
          expandedCategory === item.id ? null : item.id
        )}
      >
        <Text style={styles.categoryTitle}>{item.title}</Text>
        <Text style={styles.expandIcon}>
          {expandedCategory === item.id ? '▼' : '▶'}
        </Text>
      </TouchableOpacity>

      {expandedCategory === item.id && (
        <FlatList
          data={item.lessons}
          renderItem={renderLesson}
          keyExtractor={(lesson) => lesson.id.toString()}
          scrollEnabled={false}
          style={styles.lessonsList}
        />
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Académie TLSE PRONOS</Text>
        <Text style={styles.headerSubtitle}>
          Apprenez à devenir un parieur professionnel
        </Text>
      </View>

      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
        contentContainerStyle={styles.categoriesList}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          💡 Conseil: Lisez au moins une leçon par jour pour améliorer vos compétences!
        </Text>
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
    borderBottomWidth: 2,
    borderBottomColor: '#00ff88'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ff88',
    marginBottom: 5
  },
  headerSubtitle: {
    color: '#888',
    fontSize: 14
  },
  categoriesList: {
    padding: 15
  },
  categoryContainer: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1a1a2e'
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#00ff88'
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1
  },
  expandIcon: {
    color: '#00ff88',
    fontSize: 14,
    fontWeight: 'bold'
  },
  lessonsList: {
    borderTopWidth: 1,
    borderTopColor: '#333'
  },
  lessonCard: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#0f0f1e'
  },
  lessonHeader: {
    marginBottom: 10
  },
  lessonInfo: {
    marginBottom: 10
  },
  lessonTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 3
  },
  lessonDesc: {
    color: '#888',
    fontSize: 12
  },
  duration: {
    color: '#00ff88',
    fontSize: 12,
    fontWeight: '600'
  },
  watchButton: {
    backgroundColor: '#00ff88',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start'
  },
  watchButtonText: {
    color: '#0f0f1e',
    fontWeight: 'bold',
    fontSize: 12
  },
  footer: {
    margin: 15,
    padding: 15,
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#00ff88'
  },
  footerText: {
    color: '#fff',
    fontSize: 13,
    lineHeight: 20
  }
});

export default AcademyScreen;
