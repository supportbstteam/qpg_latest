// asyncStorage.js

import AsyncStorage from "@react-native-async-storage/async-storage";


const HISTORY_KEY = "bookHistory";

export const saveHistory = async (newRecord) => {
    try {
        let updatedHistory = await getHistory();

        // Check if the record already exists in the history
        const existingRecordIndex = updatedHistory.findIndex(
            (item) =>
                item.ClassItem.value === newRecord.ClassItem.value &&
                item.SchoolItem.value === newRecord.SchoolItem.value &&
                item.SubjecItem.value === newRecord.SubjecItem.value
        );

        if (existingRecordIndex !== -1) {
            // Update the quantity if the record exists
            // const updatedquentity=parseInt(newRecord.quantity)+parseInt(updatedHistory[existingRecordIndex].quantity)
            // console.log(updatedquentity)
        
            updatedHistory[existingRecordIndex].quantity =newRecord.quantity;
        } else {
            // Add the new record if it doesn't exist
            updatedHistory.push(newRecord);
        }

        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
        console.error("Error saving history to AsyncStorage:", error);
    }
};




export const getHistory = async () => {
    try {
        const historyString = await AsyncStorage.getItem(HISTORY_KEY);
        return historyString ? JSON.parse(historyString) : [];
    } catch (error) {
        console.error("Error retrieving history from AsyncStorage:", error);
        return [];
    }
};

export const deleteHistory = async (ClassId, SchoolId, SubjectId) => {
    try {
        console.log(ClassId, SchoolId, SubjectId);
        let existingHistory = await getHistory();

        console.log("before delete", existingHistory);
        existingHistory = existingHistory.filter(item =>
            item.ClassItem.value !== ClassId ||
            item.SchoolItem.value !== SchoolId ||
            item.SubjecItem.value !== SubjectId
        );
        console.log("after delete", existingHistory);

        // Uncomment the line below to save the updated history back to AsyncStorage
        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(existingHistory));
    } catch (error) {
        console.error("Error deleting history item from AsyncStorage:", error);
    }
};

export const clearHistory = async () => {
    try {
        await AsyncStorage.removeItem(HISTORY_KEY);

    } catch (error) {
        console.log("clear history error ", error)
    }
}

// for get total item

export const getTotalItemCount = async () => {
    try {
        const history = await getHistory();

        // Get the total count of items
        const totalCount = history.length;

        return totalCount;
    } catch (error) {
        console.error("Error getting total item count from history:", error);
        return 0;
    }
};

