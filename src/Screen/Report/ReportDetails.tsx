import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect } from 'react';
import Header from '../../Component/Common_Component/Header';
import { fetchToken } from '../../Helpers/fetchDetails';
import api from '../../API/api';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import CustomDropdown from '../../Component/Common_Component/CustomDropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
import Textlabel from '../../Component/Common_Component/Textlabel';

const ReportDetails: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [school, setSchool] = React.useState<string>('');
  const [list, setList] = React.useState<any>([]);
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const fetchReportDetails = async () => {
    setLoading(true);
    try {
      const token = await fetchToken();
      if (token) {
        const response = await api.get_Report(token);
        if (response.data.status === true) {
          setList(response.data.data);
          console.log(response.data.data);
        }
      }
    } catch (error) {
      console.log('error in report details', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (list.length === 0) {
      fetchReportDetails();
    }
  }, []);

  const handleSchool = (id: any) => {
    setSchool(id.label);
  };

  function formatDate(inputDate: any) {
    const date = new Date(inputDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  }

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchReportDetails();
      setSearchTerm('');
    } finally {
      setRefreshing(false);
    }
  };

  const handleReportView = (item: any) => {
    navigation.navigate('ReportView', { data: item });
  }

  const filteredSchools = list.filter((school) => school.school_name && school.school_name.trim() !== "");

  return (
    <>
      <Header
        title={'Report Details'}
        bg={'blue'}
        leftIcon={'menu'}
        onLeftPress={() => navigation.toggleDrawer()}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{ flex: 1, backgroundColor: '#F8F8F8' }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Report by School or Date..."
            placeholderTextColor={'gray'}
            value={searchTerm}
            onChangeText={text => setSearchTerm(text)}
          />
          <Icon
            name="search"
            size={16}
            color="#323E47"
            style={styles.searchIcon}
          />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="blue" />
          </View>
        ) : (
          <View style={styles.cardContainer}>
            {filteredSchools
              ?.filter(
                (item: any) =>
                  item?.school_name &&
                  (formatDate(item.created_at).includes(searchTerm) ||
                    item?.school_name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())),
              )
              .map((item: any, index: any) => (
                <Pressable key={index} style={styles.card} onPress={() => handleReportView(item)}>
                  <View style={styles.viewIconContainer}>
                    <TouchableOpacity style={styles.viewButton} onPress={() => handleReportView(item)}>
                      <Text style={styles.viewButtonText}>View</Text>
                    </TouchableOpacity>
                  </View>
                  <Textlabel title="School Name:" value={item?.school_name} />
                  <Textlabel title="School Board:" value={item?.board} />
                  <Textlabel title="Strength:" value={item?.strength} />
                  <Textlabel title="Remark:" value={item?.remark} />
                  <Textlabel title="Vehicle Type:" value={item?.vehicle_type} />
                  <Textlabel title="Date:" value={formatDate(item?.created_at)} />
                </Pressable>
              ))}
          </View>
        )}

        {filteredSchools.length === 0 && !loading && (
          <View style={styles.emptyView}>
            <Text style={styles.noReportText}>No Report Found</Text>
          </View>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(3),
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(2),
  },
  searchInput: {
    flex: 1,
    height: responsiveHeight(5),
    borderRadius: 25,
    backgroundColor: '#fff',
    paddingLeft: responsiveWidth(5),
    paddingVertical: 0,
    fontSize: responsiveFontSize(1.9),
    elevation: 3,
  },
  searchIcon: {
    position: 'absolute',
    right: responsiveWidth(6),
    top: responsiveHeight(1.5),
  },
  cardContainer: {
    flex: 1,
    paddingHorizontal: responsiveWidth(3),
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: responsiveHeight(2),
    marginBottom: responsiveHeight(2),
    elevation: 5,
  },
  viewIconContainer: {
    alignSelf: 'flex-end',
  },
  viewButton: {
    backgroundColor: '#72A0C1',
    paddingVertical: responsiveHeight(0.5),
    paddingHorizontal: responsiveWidth(4),
    borderRadius: 20,
    marginBottom: 4
  },
  viewButtonText: {
    color: '#fff',
    fontSize: responsiveFontSize(1.7),
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(40),
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(35),
  },
  noReportText: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: 'black',
  },
});

export default ReportDetails;
