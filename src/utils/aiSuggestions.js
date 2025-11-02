// AI logic to suggest next activity based on patterns

export const getNextSuggestion = (activities) => {
  if (!activities || activities.length === 0) {
    return {
      type: 'feeding',
      message: 'Start tracking your baby\'s activities!',
      color: '#FF6B9D',
      emoji: '🍼'
    };
  }

  const now = Date.now();
  const last24Hours = activities.filter(
    a => now - a.timestamp < 24 * 60 * 60 * 1000
  );

  // Calculate average intervals
  const feedingActivities = last24Hours.filter(a => a.type === 'feeding');
  const cleaningActivities = last24Hours.filter(a => a.type === 'cleaning');
  const sleepActivities = last24Hours.filter(a => a.type === 'sleep');

  // Get last activity of each type
  const lastFeeding = activities.find(a => a.type === 'feeding');
  const lastCleaning = activities.find(a => a.type === 'cleaning');
  const lastSleep = activities.find(a => a.type === 'sleep');

  const timeSinceFeeding = lastFeeding ? now - lastFeeding.timestamp : Infinity;
  const timeSinceCleaning = lastCleaning ? now - lastCleaning.timestamp : Infinity;
  const timeSinceSleep = lastSleep ? now - lastSleep.timestamp : Infinity;

  // Average feeding interval (typically 2-4 hours for newborns)
  const avgFeedingInterval = calculateAverageInterval(feedingActivities);
  const avgCleaningInterval = calculateAverageInterval(cleaningActivities);
  const avgSleepInterval = calculateAverageInterval(sleepActivities);

  // Determine what's most overdue
  const feedingOverdue = timeSinceFeeding / (avgFeedingInterval || 3 * 60 * 60 * 1000);
  const cleaningOverdue = timeSinceCleaning / (avgCleaningInterval || 3 * 60 * 60 * 1000);
  const sleepOverdue = timeSinceSleep / (avgSleepInterval || 2 * 60 * 60 * 1000);

  const suggestions = [];

  if (feedingOverdue > 0.9) {
    suggestions.push({
      type: 'feeding',
      message: `Feeding time! Last fed ${formatTimeAgo(timeSinceFeeding)} ago`,
      color: '#FF6B9D',
      emoji: '🍼',
      priority: feedingOverdue
    });
  }

  if (cleaningOverdue > 0.9) {
    suggestions.push({
      type: 'cleaning',
      message: `Check diaper! Last changed ${formatTimeAgo(timeSinceCleaning)} ago`,
      color: '#4ECDC4',
      emoji: '✨',
      priority: cleaningOverdue
    });
  }

  if (sleepOverdue > 0.9) {
    suggestions.push({
      type: 'sleep',
      message: `Nap time! Last slept ${formatTimeAgo(timeSinceSleep)} ago`,
      color: '#A78BFA',
      emoji: '😴',
      priority: sleepOverdue
    });
  }

  // Return highest priority suggestion
  if (suggestions.length > 0) {
    suggestions.sort((a, b) => b.priority - a.priority);
    return suggestions[0];
  }

  // Everything is on track
  return {
    type: 'all-good',
    message: 'All activities are on schedule! 🎉',
    color: '#10B981',
    emoji: '✅'
  };
};

const calculateAverageInterval = (activities) => {
  if (activities.length < 2) return null;

  let totalInterval = 0;
  for (let i = 0; i < activities.length - 1; i++) {
    totalInterval += activities[i].timestamp - activities[i + 1].timestamp;
  }

  return totalInterval / (activities.length - 1);
};

const formatTimeAgo = (milliseconds) => {
  const hours = Math.floor(milliseconds / (60 * 60 * 1000));
  const minutes = Math.floor((milliseconds % (60 * 60 * 1000)) / (60 * 1000));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export const getPatternInsights = (activities) => {
  const last7Days = activities.filter(
    a => Date.now() - a.timestamp < 7 * 24 * 60 * 60 * 1000
  );

  const feedingCount = last7Days.filter(a => a.type === 'feeding').length;
  const cleaningCount = last7Days.filter(a => a.type === 'cleaning').length;
  const sleepCount = last7Days.filter(a => a.type === 'sleep').length;

  return {
    feedingPerDay: (feedingCount / 7).toFixed(1),
    cleaningPerDay: (cleaningCount / 7).toFixed(1),
    sleepPerDay: (sleepCount / 7).toFixed(1),
  };
};
