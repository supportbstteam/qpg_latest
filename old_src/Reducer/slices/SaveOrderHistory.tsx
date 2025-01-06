// asyncStorage.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetccUserId} from '../../Helpers/fetchDetails';

//it retuens a key with user id and "_history" as a string
const getHistoryKey = async () => {
  const userId = await fetccUserId();
  return userId + '_history';
};

export const saveHistory = async (newRecord: any) => {
  try {
    let updatedHistory = await getHistory();

    // Check if the record already exists in the history
    const existingRecordIndex = updatedHistory.findIndex(
      (item: any) =>
        item.ClassItem.value === newRecord.ClassItem.value &&
        item.SchoolItem.value === newRecord.SchoolItem.value &&
        item.SubjecItem.value === newRecord.SubjecItem.value,
    );

    if (existingRecordIndex !== -1) {
      // Update the quantity if the record exists
      // const updatedquentity=parseInt(newRecord.quantity)+parseInt(updatedHistory[existingRecordIndex].quantity)
      // console.log(updatedquentity)

      updatedHistory[existingRecordIndex].quantity = newRecord.quantity;
    } else {
      // Add the new record if it doesn't exist
      updatedHistory.push(newRecord);
    }
    const HISTORY_KEY = await getHistoryKey();
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error saving history to AsyncStorage:', error);
  }
};

export const getHistory = async () => {
  try {
    const HISTORY_KEY = await getHistoryKey();
    const historyString = await AsyncStorage.getItem(HISTORY_KEY);
    return historyString ? JSON.parse(historyString) : [];
  } catch (error) {
    console.error('Error retrieving history from AsyncStorage:', error);
    return [];
  }
};

export const deleteHistory = async (
  ClassId: string,
  SchoolId: string,
  SubjectId: string,
) => {
  try {
    console.log(ClassId, SchoolId, SubjectId);
    let existingHistory = await getHistory();

    console.log('before delete', existingHistory);
    existingHistory = existingHistory.filter(
      (item: any) =>
        item.ClassItem.value !== ClassId ||
        item.SchoolItem.value !== SchoolId ||
        item.SubjecItem.value !== SubjectId,
    );
    console.log('after delete', existingHistory);

    // Uncomment the line below to save the updated history back to AsyncStorage
    const HISTORY_KEY = await getHistoryKey();
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(existingHistory));
  } catch (error) {
    console.error('Error deleting history item from AsyncStorage:', error);
  }
};

export const clearHistory = async () => {
  try {
    const HISTORY_KEY = await getHistoryKey();
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.log('clear history error ', error);
  }
};

// for get total item

export const getTotalItemCount = async () => {
  try {
    const history = await getHistory();

    // Get the total count of items
    const totalCount = history.length;

    return totalCount;
  } catch (error) {
    console.error('Error getting total item count from history:', error);
    return 0;
  }
};
