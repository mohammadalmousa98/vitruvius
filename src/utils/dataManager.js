import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@baby_care_activities';

export const loadData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error loading data:', e);
    return [];
  }
};

export const saveActivity = async (activities) => {
  try {
    const jsonValue = JSON.stringify(activities);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving data:', e);
  }
};

export const clearAllData = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing data:', e);
  }
};
