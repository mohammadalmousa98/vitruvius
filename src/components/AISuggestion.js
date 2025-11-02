import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getNextSuggestion } from '../utils/aiSuggestions';

export default function AISuggestion({ activities }) {
  const [suggestion, setSuggestion] = useState(null);

  useEffect(() => {
    const newSuggestion = getNextSuggestion(activities);
    setSuggestion(newSuggestion);
  }, [activities]);

  if (!suggestion) return null;

  const gradientColors = {
    'feeding': ['#FF6B9D', '#FF8FB3'],
    'cleaning': ['#4ECDC4', '#6FE5DB'],
    'sleep': ['#A78BFA', '#C4B5FD'],
    'all-good': ['#10B981', '#34D399'],
  };

  return (
    <LinearGradient
      colors={gradientColors[suggestion.type] || ['#6366F1', '#818CF8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.emoji}>{suggestion.emoji}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.label}>AI Suggestion</Text>
          <Text style={styles.message}>{suggestion.message}</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 40,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontWeight: '700',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  message: {
    fontWeight: '500',
    fontSize: 18,
    color: '#ffffff',
    lineHeight: 24,
  },
});
