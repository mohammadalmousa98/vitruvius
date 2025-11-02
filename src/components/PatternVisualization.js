import React from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function PatternVisualization({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Activity Timeline</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📊</Text>
          <Text style={styles.emptyText}>Start tracking to see patterns!</Text>
        </View>
      </View>
    );
  }

  // Get last 24 hours of activities
  const now = Date.now();
  const last24Hours = activities.filter(
    a => now - a.timestamp < 24 * 60 * 60 * 1000
  );

  // Group by hour
  const hourlyData = Array(24).fill(null).map((_, index) => {
    const hourStart = now - (index * 60 * 60 * 1000);
    const hourEnd = hourStart - (60 * 60 * 1000);

    const hourActivities = last24Hours.filter(
      a => a.timestamp <= hourStart && a.timestamp > hourEnd
    );

    return {
      hour: 23 - index,
      activities: hourActivities,
      feeding: hourActivities.filter(a => a.type === 'feeding').length,
      cleaning: hourActivities.filter(a => a.type === 'cleaning').length,
      sleep: hourActivities.filter(a => a.type === 'sleep').length,
    };
  }).reverse();

  // Calculate totals
  const totals = {
    feeding: last24Hours.filter(a => a.type === 'feeding').length,
    cleaning: last24Hours.filter(a => a.type === 'cleaning').length,
    sleep: last24Hours.filter(a => a.type === 'sleep').length,
  };

  const renderRecentActivities = () => {
    const recent = activities.slice(0, 10);

    return recent.map((activity, index) => {
      const colors = {
        'feeding': '#FF6B9D',
        'cleaning': '#4ECDC4',
        'sleep': '#A78BFA',
      };

      const time = new Date(activity.timestamp);
      const timeStr = time.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });

      return (
        <View
          key={activity.id || index}
          style={[styles.activityItem, { borderLeftColor: colors[activity.type] }]}
        >
          <Text style={styles.activityEmoji}>{activity.emoji}</Text>
          <View style={styles.activityDetails}>
            <Text style={styles.activityType}>
              {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
            </Text>
            <Text style={styles.activityTime}>{timeStr}</Text>
          </View>
          {activity.duration && (
            <Text style={styles.activityDuration}>
              {formatDuration(activity.duration)}
            </Text>
          )}
        </View>
      );
    });
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activity Patterns (24h)</Text>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: '#FF6B9D' }]}>
          <Text style={styles.summaryEmoji}>🍼</Text>
          <Text style={styles.summaryCount}>{totals.feeding}</Text>
          <Text style={styles.summaryLabel}>Feedings</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#4ECDC4' }]}>
          <Text style={styles.summaryEmoji}>✨</Text>
          <Text style={styles.summaryCount}>{totals.cleaning}</Text>
          <Text style={styles.summaryLabel}>Changes</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#A78BFA' }]}>
          <Text style={styles.summaryEmoji}>😴</Text>
          <Text style={styles.summaryCount}>{totals.sleep}</Text>
          <Text style={styles.summaryLabel}>Naps</Text>
        </View>
      </View>

      {/* Recent Activities Timeline */}
      <View style={styles.timelineContainer}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        <ScrollView style={styles.activitiesList} showsVerticalScrollIndicator={false}>
          {renderRecentActivities()}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontWeight: '700',
    fontSize: 24,
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontWeight: '500',
    fontSize: 18,
    color: '#6B7280',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  summaryCount: {
    fontWeight: '700',
    fontSize: 28,
    color: '#ffffff',
    marginBottom: 4,
  },
  summaryLabel: {
    fontWeight: '500',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  timelineContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    padding: 20,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: '#333',
    marginBottom: 16,
  },
  activitiesList: {
    maxHeight: 400,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activityEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  activityDetails: {
    flex: 1,
  },
  activityType: {
    fontWeight: '700',
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  activityTime: {
    fontWeight: '400',
    fontSize: 13,
    color: '#6B7280',
  },
  activityDuration: {
    fontWeight: '700',
    fontSize: 14,
    color: '#6366F1',
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
});
