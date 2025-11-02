import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SleepTimer({ onComplete }) {
  const [isAsleep, setIsAsleep] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isAsleep) {
      interval = setInterval(() => {
        setSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isAsleep, startTime]);

  const handleSleep = () => {
    setStartTime(Date.now());
    setIsAsleep(true);
    setSeconds(0);
  };

  const handleWake = () => {
    setIsAsleep(false);
    if (seconds > 0) {
      onComplete({
        type: 'sleep',
        duration: seconds,
        emoji: '😴'
      });
    }
    setSeconds(0);
    setStartTime(null);
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <LinearGradient
      colors={['#A78BFA', '#C4B5FD']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <Text style={styles.emoji}>{isAsleep ? '😴' : '👶'}</Text>
      <Text style={styles.title}>Sleep Tracker</Text>
      {isAsleep && (
        <Text style={styles.timer}>{formatTime(seconds)}</Text>
      )}
      {!isAsleep && (
        <Text style={styles.subtitle}>Track your baby's sleep time</Text>
      )}
      <TouchableOpacity
        style={[styles.button, isAsleep && styles.buttonWake]}
        onPress={isAsleep ? handleWake : handleSleep}
      >
        <Text style={styles.buttonText}>
          {isAsleep ? 'Baby is Awake' : 'Baby is Asleep'}
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
  subtitle: {
    fontWeight: '400',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 16,
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
  buttonWake: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 18,
    color: '#A78BFA',
  },
});
