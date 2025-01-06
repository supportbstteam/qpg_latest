import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {fetchToken} from '../../Helpers/fetchDetails';
import api from '../../API/api';
import Header from '../../Component/Common_Component/Header';
import EvilIcons from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import {useFocusEffect} from '@react-navigation/native';
import Textlabel from '../../Component/Common_Component/Textlabel';
import {useDispatch} from 'react-redux';
import {setTotalOrderHistory} from '../../Reducer/slices/ConfirmOrderHistory';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {CardBase} from '@rneui/base/dist/Card/Card';

const ConfirmOrderHistory = ({navigation}) => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchOrder, setSearchOrder] = useState('');
  const [activeTab, setActiveTab] = useState('ownOrders'); // 'ownOrders' or 'assignedOrders'
  const dispatch = useDispatch();
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      getHistory();
    }, []),
  );

  const getHistory = async () => {
    try {
      const token = await fetchToken();
      if (token) {
        const response = await api.getOrderHistory(token);
        setOrderHistory(response.data.data);
        dispatch(setTotalOrderHistory(response.data.data));
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log('Order history error:', error);
    }
  };

  const dateTimeFormat = date => {
    const orderDate = new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
    return orderDate;
  };

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

  const filterOrdersByType = () => {
    return orderHistory.filter(
      order => order.order_type === (activeTab === 'ownOrders' ? 1 : 2),
    );
  };

  const handleApprove = async OrderId => {
    const formData = {status: 1};
    const token = await fetchToken();
    try {
      const response = await api.Order_Approve_reject(OrderId, token, formData);
      Toast.show({
        type: 'success',
        text1: 'Status Approved',
        visibilityTime: 2000,
      });
      getHistory();
    } catch (error) {
      Alert.alert('Error', 'Failed to approve report.');
    }
  };

  const handleReject = async OrderId => {
    const formData = {status: 2};
    const token = await fetchToken();
    try {
      const response = await api.Order_Approve_reject(OrderId, token, formData);
      Toast.show({
        type: 'success',
        text1: 'Status Rejected',
        visibilityTime: 2000,
      });
      getHistory();
    } catch (error) {
      Alert.alert('Error', 'Failed to reject report.');
    }
  };

  const toggleReportsSection = (userId: number) => {
    setExpandedUserId(prev => (prev === userId ? null : userId));
  };

  const OrderItem = ({item}) => (
    <>
      {item.order_type === 1 && (
        <TouchableOpacity
          style={styles.cardContainer}
          onPress={() =>
            navigation.navigate('ViewConfirmOrder', {orderId: item.id})
          }>
          <View style={styles.cardContent}>
            <Textlabel title="Order No:" value={item?.id} />
            <Textlabel title="Date:" value={dateTimeFormat(item.created_at)} />
            <Textlabel title="Total Amt:" value={item?.total_amount} />
            <Textlabel title="Status:" value={getStatusText(item.status)} />
          </View>
        </TouchableOpacity>
      )}

      {item.order_type === 2 && (
        <CardBase containerStyle={styles.fullWidthCard}>
          <Textlabel title="Name:" value={item.name} />
          <Textlabel title="Email:" value={item.email} />
          <Textlabel title="Contact No:" value={item.contact_no} />
          <TouchableOpacity
            onPress={() => toggleReportsSection(item.id)}
            style={styles.toggleButton}>
            <Text style={styles.toggleButtonText}>
              {expandedUserId === item.id ? 'Hide Reports' : 'View Reports'}
            </Text>
          </TouchableOpacity>

          {expandedUserId === item.id && (
            <FlatList
              data={item.order}
              renderItem={({item: orderItem}) => (
                <TouchableOpacity
                  style={styles.cardContainer}
                  onPress={() =>
                    navigation.navigate('ViewConfirmOrder', {
                      orderId: null,
                      item: orderItem,
                    })
                  }>
                  <View style={styles.cardContent}>
                    <Textlabel title="Order No:" value={orderItem?.id} />
                    <Textlabel
                      title="Date:"
                      value={dateTimeFormat(orderItem.created_at)}
                    />
                    <Textlabel
                      title="Total Amt:"
                      value={orderItem?.total_amount}
                    />
                    <Textlabel
                      title="Status:"
                      value={getStatusText(orderItem.status)}
                    />
                    {orderItem.status === 0 && (
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity
                          style={styles.approveButton}
                          onPress={() => handleApprove(orderItem.id)}>
                          <Text style={styles.buttonText}>Approve</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.rejectButton}
                          onPress={() => handleReject(orderItem.id)}>
                          <Text style={styles.buttonText}>Reject</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={orderItem => orderItem.id.toString()}
              numColumns={2} // Show reports in 2 columns
            />
          )}
        </CardBase>
      )}
    </>
  );
  return (
    <View style={styles.container}>
      <Header
        SearchBarchangeText={value => setSearchOrder(value)}
        SearchPlaceHolder="Search By Order No or Date,Status"
        bg="blue"
        leftIcon="menu"
        onLeftPress={() => navigation.toggleDrawer()}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 10,
        }}>
        <TouchableOpacity
          style={{
            marginHorizontal: 20,
            borderWidth: 1,
            padding: 10,
            borderRadius: 10,
          }}
          onPress={() => {
            navigation.navigate('AddOrder');
          }}>
          <Text style={{fontSize: responsiveFontSize(2), color: '#000'}}>
            Add Order
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{marginHorizontal: 20, marginVertical: 6}}
          onPress={() => getHistory()}>
          <EvilIcons name="refresh" size={30} color={'#000'} />
        </TouchableOpacity>
      </View>
      {/* Custom Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'ownOrders' && styles.activeTab]}
          onPress={() => setActiveTab('ownOrders')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'ownOrders' && styles.activeTabText,
            ]}>
            Own Orders
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'assignedOrders' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('assignedOrders')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'assignedOrders' && styles.activeTabText,
            ]}>
            Assigned Orders
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        numColumns={activeTab === 'ownOrders' ? 2 : 1} // Dynamically set numColumns
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => getHistory()}
          />
        }
        data={filterOrdersByType()}
        renderItem={({item}) => <OrderItem item={item} />}
        keyExtractor={item => item.id.toString()} // Keep a stable key for items
        key={activeTab === 'ownOrders' ? 'own' : 'assigned'} // Avoid dynamic keys for the entire list
        extraData={expandedUserId} // Pass expanded state to avoid unnecessary re-renders
      />
    </View>
  );
};

export default ConfirmOrderHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: 'blue',
  },
  tabText: {
    fontSize: responsiveFontSize(2),
    color: '#000',
  },
  activeTabText: {
    color: 'blue',
    fontWeight: 'bold',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: '#ffffff',
  },

  cardContainertype: {
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f8f9fa',
    elevation: 2,
  },
  cardContent: {
    marginHorizontal: 14,
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 12,
    marginHorizontal: 12,
  },
  approveButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#28a745',
    borderRadius: 5,
    marginRight: 8,
    alignItems: 'center',
  },
  rejectButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#dc3545',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  toggleButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  fullWidthCard: {
    // width: '100%',
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f8f9fa',
    elevation: 2,
  },
});
