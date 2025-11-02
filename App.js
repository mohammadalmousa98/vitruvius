import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, StatusBar, Platform } from 'react-native';
import FeedingTimer from './src/components/FeedingTimer';
import CleaningTracker from './src/components/CleaningTracker';
import SleepTimer from './src/components/SleepTimer';
import PatternVisualization from './src/components/PatternVisualization';
import AISuggestion from './src/components/AISuggestion';
import { loadData, saveActivity } from './src/utils/dataManager';

export default function App() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    loadActivitiesFromStorage();
  }, []);

  const loadActivitiesFromStorage = async () => {
    const data = await loadData();
    setActivities(data);
  };

  const handleActivityComplete = async (activity) => {
    const newActivity = {
      ...activity,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    const updatedActivities = [newActivity, ...activities];
    setActivities(updatedActivities);
    await saveActivity(updatedActivities);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>👶 Baby Care Tracker</Text>
        </View>

        <AISuggestion activities={activities} />

        <View style={styles.trackersContainer}>
          <FeedingTimer onComplete={handleActivityComplete} />
          <CleaningTracker onComplete={handleActivityComplete} />
          <SleepTimer onComplete={handleActivityComplete} />
        </View>

        <PatternVisualization activities={activities} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  trackersContainer: {
    paddingHorizontal: 20,
    gap: 15,
  },
});
