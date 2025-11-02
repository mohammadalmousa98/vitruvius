import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function FeedingTimer({ onComplete }) {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
    setSeconds(0);
  };

  const handleStop = () => {
    setIsRunning(false);
    if (seconds > 0) {
      onComplete({
        type: 'feeding',
        duration: seconds,
        emoji: '🍼'
      });
      setSeconds(0);
    }
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <LinearGradient
      colors={['#FF6B9D', '#FF8FB3']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <Text style={styles.emoji}>🍼</Text>
      <Text style={styles.title}>Feeding Timer</Text>
      <Text style={styles.timer}>{formatTime(seconds)}</Text>
      <TouchableOpacity
        style={[styles.button, isRunning && styles.buttonStop]}
        onPress={isRunning ? handleStop : handleStart}
      >
        <Text style={styles.buttonText}>
          {isRunning ? 'Stop Feeding' : 'Start Feeding'}
        </Text>
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
    marginBottom: 12,
  },
  timer: {
    fontWeight: '700',
    fontSize: 48,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonStop: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 18,
    color: '#FF6B9D',
  },
});
