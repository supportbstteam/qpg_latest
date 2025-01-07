import React, { useState, useCallback } from 'react';
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import api from '../../API/api';
import { fetchToken } from '../../Helpers/fetchDetails';
import Header from '../../Component/Common_Component/Header';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
import Textlabel from '../../Component/Common_Component/Textlabel';
import { CardBase } from '@rneui/base/dist/Card/Card';

const ViewSample = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('allSamples');
  const [allSamples, setAllSamples] = useState([]);
  const [activeSamples, setActiveSamples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedSample, setExpandedSample] = useState(null);

  const getHistory = async () => {
    setLoading(true);
    try {
      const token = await fetchToken();
      if(token){
        const response = await api.getSample(token);
        console.log(response.data)
        setAllSamples(response.data.data);
        setActiveSamples(response.data.userData);
      }
     
    } catch (error) {
      console.error('Error fetching samples:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getHistory();
    setRefreshing(false);
  };

  const handleStatusChange = async (sampleId, status) => {
    const token = await fetchToken();
    try {
      await api.updateSampleStatus(sampleId, token, { status });
      Toast.show({
        type: 'success',
        text1: status === 1 ? 'Sample Approved' : 'Sample Rejected',
        visibilityTime: 2000,
      });
      getHistory();
    } catch {
      Alert.alert('Error', 'Failed to update sample status.');
    }
  };

  const renderSampleItem = ({ item }) => (
    <CardBase containerStyle={styles.card}>
      <Textlabel title="Class Name:" value={item?.class?.ClassName} />
      <Textlabel title="Subject Name:" value={item?.subject?.SubjectName} />
      <Textlabel title="Quantity:" value={item?.qty} />
      <Textlabel title="Status:" value={getStatusText(item?.status)} />
      <Textlabel title="Date:" value={item?.date} />
    </CardBase>
  );

  const renderActiveSampleItem = ({ item }) => (
    <CardBase containerStyle={styles.card}>
      <Textlabel title="Name:" value={item.name} />
      <Textlabel title="Email:" value={item.email} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => setExpandedSample(expandedSample === item.id ? null : item.id)}
      >
        <Text style={styles.buttonText}>{expandedSample===item.id?'Hide Samples':'View Samples'}</Text>
      </TouchableOpacity>
      {expandedSample === item.id &&
        item.samples?.map(sample => (
          <CardBase key={sample.id} containerStyle={styles.card}>
            <Textlabel title="Class Name:" value={sample.class.ClassName} />
            <Textlabel title="Subject Name:" value={sample.subject.SubjectName} />
            <Textlabel title="Quantity:" value={sample.qty} />
            <Textlabel title="Status:" value={getStatusText(sample.status)} />
            <Textlabel title="Date:" value={sample.date} />
            {sample.status === 0 && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.approveButton}
                  onPress={() => handleStatusChange(sample.id, 1)}
                >
                  <Text style={styles.buttonText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => handleStatusChange(sample.id, 2)}
                >
                  <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}
          </CardBase>
        ))}
    </CardBase>
  );

  const getStatusText = status =>
    ({ 0: 'Pending', 1: 'Confirm', 2: 'Cancelled' }[status] || '');

  useFocusEffect(
    useCallback(() => {
      getHistory();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Header
        title="View Samples"
        bg="blue"
        leftIcon="arrow-back"
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.tabBar}>
        {['allSamples', 'activeSamples'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={styles.tabText}>
              {tab === 'allSamples' ? 'All Samples' : 'Active Samples'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
      style={{marginBottom:10}}
        data={activeTab === 'allSamples' ? allSamples : activeSamples}
        keyExtractor={item => item.id?.toString()}
        renderItem={activeTab === 'allSamples' ? renderSampleItem : renderActiveSampleItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color="blue" />
          ) : (
            <Text style={styles.noSamplesText}>No Samples Found</Text>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  card: { borderRadius: 10, margin: 10 },
  tabBar: {
    flexDirection: 'row',
  
    backgroundColor: '#0056b3',
  },
  tabButton: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#007BFF',
  },
  tabText: {
    color: '#fff',
    fontSize: 16,
  },

  button: {
    marginTop: 10,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  approveButton: {
    flex: 1,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
    alignItems: 'center',
  },
  rejectButton: {
    flex: 1,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
    alignItems: 'center',
  },

  sampleDetails: {
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noSamplesText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
  },
});

export default ViewSample;
