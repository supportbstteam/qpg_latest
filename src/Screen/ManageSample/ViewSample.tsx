import React, {useState, useEffect} from 'react';
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import api from '../../API/api';
import {fetchToken} from '../../Helpers/fetchDetails';
import Header from '../../Component/Common_Component/Header';
import Toast from 'react-native-toast-message';
import {useFocusEffect} from '@react-navigation/native';

const ViewSample: React.FC<{navigation: any}> = ({navigation}) => {
  // const [orderHistory, setOrderHistory] = useState([]);
  // const [orderHistory, setOrderHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('allSamples');
  const [allSamples, setAllSamples] = useState([]);
  const [activeSamples, setActiveSamples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedSample, setExpandedSample] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      getHistory();
    }, []),
  );

  useEffect(() => {
    if (activeTab === 'allSamples' && allSamples.length === 0) {
      allSamples;
    } else if (activeTab === 'activeSamples' && activeSamples.length === 0) {
      activeSamples;
    }
  }, [activeTab]);

  const getHistory = async () => {
    try {
      const token = await fetchToken();
      if (token) {
        const response = await api.getSample(token);
        setAllSamples(response.data.data);
        setActiveSamples(response.data.userData);
      }
    } catch (error) {
      console.log('Error fetching all samples:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (activeTab === 'allSamples') {
        await allSamples;
      } else if (activeTab === 'activeSamples') {
        await activeSamples;
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleApprove = async sampleId => {
    const formData = {status: 1};
    const token = await fetchToken();
    try {
      await api.updateSampleStatus(sampleId, token, formData);
      Toast.show({
        type: 'success',
        text1: 'Sample Approved',
        visibilityTime: 2000,
      });
      getHistory();
    } catch (error) {
      Alert.alert('Error', 'Failed to approve sample.');
    }
  };

  const handleReject = async sampleId => {
    const formData = {status: 2};
    const token = await fetchToken();
    try {
      await api.updateSampleStatus(sampleId, token, formData);
      Toast.show({
        type: 'success',
        text1: 'Sample Rejected',
        visibilityTime: 2000,
      });
      // Update the sample status in the state
      getHistory();
    } catch (error) {
      Alert.alert('Error', 'Failed to reject sample.');
    }
  };

  const renderAllSamplesItem = ({item}) => (
    <View style={styles.card}>
      <Text style={styles.label}>Class Name: {item?.class?.ClassName}</Text>
      <Text style={styles.label}>
        Subject Name: {item?.subject?.SubjectName}
      </Text>
      <Text style={styles.label}>Quantity: {item?.qty}</Text>
      <Text style={styles.label}>Status: {getStatusText(item?.status)}</Text>
      <Text style={styles.label}>Date: {item?.date}</Text>
    </View>
  );

  const renderActiveSamplesItem = ({item}) => (
    <View style={styles.card}>
      <Text style={styles.label}>Name: {item.name}</Text>
      <Text style={styles.label}>Email: {item.email}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          setExpandedSample(expandedSample === item.id ? null : item.id)
        }>
        <Text style={styles.buttonText}>View Details</Text>
      </TouchableOpacity>
      {expandedSample === item.id && (
        <View style={styles.detailsContainer}>
          {item.samples && item.samples.length > 0 ? (
            item.samples.map(sample => (
              <View key={sample.id} style={styles.sampleDetails}>
                <Text style={styles.label}>
                  Class Name: {sample.class.ClassName}
                </Text>
                <Text style={styles.label}>
                  Subject Name: {sample.subject.SubjectName}
                </Text>
                <Text style={styles.label}>Quantity: {sample.qty}</Text>
                <Text style={styles.label}>
                  Status: {getStatusText(sample.status)}
                </Text>
                <Text style={styles.label}>Date: {sample.date}</Text>
                {sample?.status === 0 && (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.approveButton}
                      onPress={() => handleApprove(sample.id)}>
                      <Text style={styles.buttonText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.rejectButton}
                      onPress={() => handleReject(sample.id)}>
                      <Text style={styles.buttonText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.noSamplesText}>No Samples Found</Text>
          )}
        </View>
      )}
    </View>
  );

  // const getStatusText = status => {
  //   switch (status) {
  //     case 0:
  //       return 'Inactive';
  //     case 1:
  //       return 'Active';
  //     default:
  //       return '';
  //   }
  // };

  const getStatusText = status => {
    switch (status) {
      case 0:
        return 'Pending';
      case 1:
        return 'Confirm';
      case 2:
        return 'Cancelled';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={'View Samples'}
        bg={'blue'}
        leftIcon="arrow-back"
        onLeftPress={() => navigation.goBack()}
      />

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'allSamples' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('allSamples')}>
          <Text style={styles.tabText}>All Samples</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'activeSamples' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('activeSamples')}>
          <Text style={styles.tabText}>Active Samples</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'allSamples' && (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="blue" />
            </View>
          ) : (
            allSamples.map((item, index) => renderAllSamplesItem({item, index}))
          )}
          {allSamples.length === 0 && !loading && (
            <View style={styles.emptyView}>
              <Text style={styles.noSamplesText}>No Samples Found</Text>
            </View>
          )}
        </ScrollView>
      )}

      {activeTab === 'activeSamples' && (
        <FlatList
          data={activeSamples}
          keyExtractor={item => item.id.toString()}
          renderItem={renderActiveSamplesItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            loading ? (
              <ActivityIndicator size="large" color="blue" />
            ) : (
              <Text style={styles.noSamplesText}>No Users Found</Text>
            )
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#007BFF',
  },
  tabButton: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#0056b3',
  },
  tabText: {
    color: '#fff',
    fontSize: 16,
  },
  card: {
    padding: 16,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 14,
    marginVertical: 4,
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
  detailsContainer: {
    marginTop: 10,
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 5,
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
