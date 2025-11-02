import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function CleaningTracker({ onComplete }) {
  const handlePress = () => {
    onComplete({
      type: 'cleaning',
      emoji: '✨'
    });
  };

  return (
    <LinearGradient
      colors={['#4ECDC4', '#6FE5DB']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <Text style={styles.emoji}>✨</Text>
      <Text style={styles.title}>Diaper Change</Text>
      <Text style={styles.subtitle}>Tap when you change the diaper</Text>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Mark Diaper Changed</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  emoji: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    fontWeight: '700',
    fontSize: 22,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontWeight: '400',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 18,
    color: '#4ECDC4',
  },
});
