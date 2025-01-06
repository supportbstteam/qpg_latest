import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchToken = async () => {
    const token = await AsyncStorage.getItem('token');
    return token;
  };

export const fetccUserId = async () => {
    const userId = await AsyncStorage.getItem('userId');
    return userId;
  };

  exports = {fetccUserId, fetchToken};