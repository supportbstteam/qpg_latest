import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect} from 'react';
import Bootom_Sheet_Dropdown from '../../Component/Common_Component/Bootom_Sheet_Dropdown';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {StyleSheet} from 'react-native';
import CustomTextInput from '../../Component/Common_Component/CustomTextInput';
import Header from '../../Component/Common_Component/Header';
import {fetccUserId, fetchToken} from '../../Helpers/fetchDetails';
import api from '../../API/api';
import CutomWarning from '../../Component/Common_Component/CutomWarning';
import Loader from '../../Component/Common_Component/Loader';

import AddTeacherModal from './TeacherField';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomDropdown from '../../Component/Common_Component/CustomDropdown';
import ImageSelectionModal from './Reimbursment';
import {Image as SelectedImage} from 'react-native-image-crop-picker';
import Toast from 'react-native-toast-message';
import AddSample from './AddSample';

const ReportSubmit: React.FC<{navigation: any}> = ({navigation}) => {
  const [School, SetSchool] = React.useState([]);
  const [WarmodalVisible, setWarmodalVisible] = React.useState<boolean>(false);
  const [modalMessage, setModalMessage] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [teacher, setteacher] = React.useState([]);
  const [dropdownVisible, setDropdownVisible] = React.useState<boolean>(false);
  const [selectedOption, setSelectedOption] = React.useState<string>('');
  const [images, setImages] = React.useState([]);

  const vehical = [
    {label: 'Two Wheeler', value: 0},
    {label: 'Three Wheeler', value: 1},
    {label: 'Four Wheeler', value: 2},
  ];

  const [SelectedData, SetSelectedData] = React.useState({
    vendor_id: null,
    city: '',
    state: '',
    country: '',
    strength: '',
    remark: '',
    SchoolItem: [],
    code: '',
    pincode: '',
    address: '',
    vehicle_type: '',
    class_id: '',
    subject_id: '',
    qty: '',
    std: '',
    concerns: [],
    teachers: [],
    board: '',
    hotelBill: '',
    GRBill: '',
    otherBill: '',
  });

  useEffect(() => {
    if (School.length === 0) {
      get_school();
    }
  }, []);

  const validateEmail = (val: any) => {
    // Regular expression for a valid email format
    const emailRegex = /^[^\s@]+@gmail\.com$/;

    if (emailRegex.test(val)) {
      // Email is valid
      return true;
    } else {
      return false;
    }
  };

  const {
    vendor_id,
    strength,
    city,
    state,
    country,
    remark,
    SchoolItem,
    code,
    pincode,
    address,
    vehicle_type,
    std,
    concerns,
    teachers,
    board,
    hotelBill,
    GRBill,
    otherBill,
  } = SelectedData;
  console.log(SelectedData);

  const get_school = async () => {
    const token = await fetchToken();
    if (token) {
      try {
        const respone = await api.get_school(token);
        console.log(respone.data);
        if (respone.data.status === true) {
          SetSchool(respone.data.data);
        }
        // console.log(respone);
      } catch (error) {
        console.log('get school error:', error);
      }
    }
  };

  const handleSampleSubmit = (data: any) => {
    console.log('sample data:', data);

    SetSelectedData({
      ...SelectedData,
      class_id: data?.ClassItem?.value,
      subject_id: data?.subjectItem?.value,
      qty: data.Quantity,
    });
    setSelectedOption('');
  };

  const submitReport = async () => {
    if (vendor_id === null) {
      setModalMessage('School Name is required');
      setWarmodalVisible(true);
      return;
    }
    if (code === '' || parseInt(code) <= 0) {
      setModalMessage('School Code is required');
      setWarmodalVisible(true);
      return;
    }

    if (strength === '' || parseInt(strength) <= 0) {
      setModalMessage('strength is required');
      setWarmodalVisible(true);
      return;
    }

    if (city === '') {
      setModalMessage('City is required');
      setWarmodalVisible(true);
      return;
    }
    if (pincode === '' || pincode.length < 4) {
      setModalMessage('Postal Code is required');
      setWarmodalVisible(true);
      return;
    }

    if (state === '') {
      setModalMessage('State is required');
      setWarmodalVisible(true);
      return;
    }
    if (country === '') {
      setModalMessage('Country is required');
      setWarmodalVisible(true);
      return;
    }
    console.log(SelectedData.vehicle_type);
    if (SelectedData.vehicle_type === undefined) {
      setModalMessage('Vehicle Type is required');
      setWarmodalVisible(true);
      return;
    }
    if (remark === undefined) {
      setModalMessage('Remark is required');
      setWarmodalVisible(true);
      return;
    }

    const token = await fetchToken();
    const user_Id = await fetccUserId();

    if (token && user_Id) {
      setIsLoading(true);
      const user_Report = new FormData();

      user_Report.append('vendor_id', vendor_id);
      user_Report.append('user_id', user_Id);
      user_Report.append('strength', String(parseInt(strength)));
      user_Report.append('city', city);
      user_Report.append('state', state);
      user_Report.append('country', country);
      user_Report.append('remark', remark);
      user_Report.append('code', code);
      user_Report.append('pincode', pincode);
      user_Report.append('address', address);
      // user_Report.append('designation', designation);
      user_Report.append('teachers', JSON.stringify(teacher));
      user_Report.append('vehicle_type', vehicle_type);
      user_Report.append('board', board);
      user_Report.append('h_bill', hotelBill);
      user_Report.append('gr_bill', GRBill);
      user_Report.append('other_bill', otherBill);
      user_Report.append(
        'class_id',
        SelectedData.class_id === undefined ? '' : SelectedData.class_id,
      );
      user_Report.append(
        'subject_id',
        SelectedData.subject_id === undefined ? '' : SelectedData.subject_id,
      );
      user_Report.append(
        'qty',
        SelectedData.qty === undefined ? '' : SelectedData.qty,
      );

      // Append the first image only if it exists
      if (images.length > 0) {
        user_Report.append('reimbursement', {
          uri: images[0],
          type: 'image/jpeg',
          name: 'reimbursement.jpg',
        });
      }
      console.log('user report:', user_Report);
      try {
        const response = await api.submit_Report(token, user_Report);
        console.log(response.data);
        if (response.data.status === true) {
          setIsLoading(false);
          Toast.show({
            type: 'success',
            text1: response.data.message,
            autoHide: false,
            visibilityTime: 2000,
            onShow: () => {
              setTimeout(() => {
                Toast.hide();

                navigation.navigate('PunchScreen');
              }, 2000); // Wait for 1 second before navigating
            },
          });
        }
      } catch (error: any) {
        setIsLoading(false);
        console.log('submit report error:', error.response.data);
        Toast.show({
          type: 'error',
          text1: error?.response?.data?.message,
          autoHide: false,
          visibilityTime: 1000,
          onShow: () => {
            setTimeout(() => {
              Toast.hide();
            }, 2000); // Wait for 1 second before navigating
          },
        });
      }
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Header
          title={'Submit Report'}
          bg={'blue'}
          leftIcon={'arrow-back'}
          onLeftPress={() => navigation.goBack()}
        />
        <ImageSelectionModal
          isVisible={selectedOption === 'Attach Bill'}
          onClose={() => setSelectedOption('')}
          images={images}
          setImages={setImages}
        />
        <AddTeacherModal
          isVisible={selectedOption === 'Add Teacher'}
          onClose={() => setSelectedOption('')}
          teacherList={teacher}
          updateTeacherList={setteacher as never}
        />

        <AddSample
          isVisible={selectedOption === 'Add Samples'}
          onClose={() => setSelectedOption('')}
          onSubmit={data => handleSampleSubmit(data)}
        />
        <View style={styles.maincontainer}>
          <ScrollView>
            <View>
              <Bootom_Sheet_Dropdown
                title="School name"
                data={School.map(School => ({
                  label: School.name,
                  value: School.id,
                  allData: School,
                }))}
                placeholder="Select School Name"
                selectedItem={SchoolItem}
                onSelect={item => {
                  SetSelectedData(item.allData),
                    SetSelectedData(prevData => ({
                      ...prevData,
                      vendor_id: item.allData.id,
                      SchoolItem: item,
                    }));
                }}
                isLoading={false}
              />
              <CustomTextInput
                title="School Code"
                value={code.toString()}
                keyboardType="phone-pad"
                placeholder="Enter Strength"
                onChangeText={code => SetSelectedData({...SelectedData, code})}
              />

              <CustomTextInput
                title="Strength"
                value={strength.toString()}
                keyboardType="phone-pad"
                placeholder="Enter Strength"
                onChangeText={strength =>
                  SetSelectedData({...SelectedData, strength})
                }
              />

              {/* Need to be prefilled and make every field not editable */}
              <CustomTextInput
                title="School Standard"
                value={std.toString()}
                placeholder="Enter School Standard"
                onChangeText={std => SetSelectedData({...SelectedData, std})}
                editable={false}
              />

              <CustomTextInput
                title="School Board"
                value={board.toString()}
                placeholder="Enter School Board"
                onChangeText={board =>
                  SetSelectedData({...SelectedData, board})
                }
                editable={false}
              />

              <CustomTextInput
                title="Address"
                value={address}
                placeholder="Enter Address"
                onChangeText={address =>
                  SetSelectedData({...SelectedData, address})
                }
              />

              <CustomTextInput
                title="City"
                value={city}
                placeholder="Enter City"
                onChangeText={city => SetSelectedData({...SelectedData, city})}
              />

              <CustomTextInput
                title="State"
                value={state}
                placeholder="Enter State"
                onChangeText={state =>
                  SetSelectedData({...SelectedData, state})
                }
              />

              <CustomTextInput
                title="Postal Code"
                value={pincode}
                placeholder="Enter Postal Code"
                onChangeText={pincode =>
                  SetSelectedData({...SelectedData, pincode})
                }
                maxLength={6}
                keyboardType={'numeric'}
              />

              <CustomTextInput
                title="Country"
                value={country}
                placeholder="Enter Country"
                onChangeText={country =>
                  SetSelectedData({...SelectedData, country})
                }
              />

              {/* Concern Person Details */}
              <View style={styles.cardSection}>
                <Text style={styles.cardHeader}>Concern Person Details</Text>

                <View style={styles.card}>
                  {concerns.map((item: any, index: number) => (
                    <View key={index} style={styles.concernItem}>
                      <View style={styles.field}>
                        <Text style={styles.fieldLabel}>Name:</Text>
                        <Text style={styles.fieldValue}>{item.name}</Text>
                      </View>

                      <View style={styles.field}>
                        <Text style={styles.fieldLabel}>Designation:</Text>
                        <Text style={styles.fieldValue}>
                          {item.designation}
                        </Text>
                      </View>

                      <View style={styles.field}>
                        <Text style={styles.fieldLabel}>Number:</Text>
                        <Text style={styles.fieldValue}>{item.number}</Text>
                      </View>

                      <View style={styles.field}>
                        <Text style={styles.fieldLabel}>Email:</Text>
                        <Text style={styles.fieldValue}>{item.email}</Text>
                      </View>
                      {<View style={styles.separator} />}
                    </View>
                  ))}
                </View>
              </View>

              {/* Teacher Details */}
              <View style={styles.cardSection}>
                <Text style={styles.cardHeader}>Teacher Details</Text>

                <View style={styles.card}>
                  {teachers.map((item: any, index: number) => (
                    <View key={index} style={styles.concernItem}>
                      <View style={styles.field}>
                        <Text style={styles.fieldLabel}>Name:</Text>
                        <Text style={styles.fieldValue}>{item.name}</Text>
                      </View>

                      <View style={styles.field}>
                        <Text style={styles.fieldLabel}>Designation:</Text>
                        <Text style={styles.fieldValue}>
                          {item.designation}
                        </Text>
                      </View>

                      <View style={styles.field}>
                        <Text style={styles.fieldLabel}>Subject:</Text>
                        <Text style={styles.fieldValue}>{item.subject}</Text>
                      </View>

                      <View style={styles.field}>
                        <Text style={styles.fieldLabel}>Email:</Text>
                        <Text style={styles.fieldValue}>{item.email}</Text>
                      </View>

                      <View style={styles.field}>
                        <Text style={styles.fieldLabel}>Address:</Text>
                        <Text style={styles.fieldValue}>{item.address}</Text>
                      </View>
                      <View style={styles.field}>
                        <Text style={styles.fieldLabel}>Contact:</Text>
                        <Text style={styles.fieldValue}>{item.contact}</Text>
                      </View>
                      {<View style={styles.separator} />}
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.inputView}>
                <Text style={styles.textinputlabel}>Vehical Type</Text>
                <CustomDropdown
                  data={vehical?.map(ele => ({
                    label: ele.label,
                    value: ele.value,
                  }))}
                  placeholder="Select Vehical Type"
                  onSelect={val => {
                    SetSelectedData({...SelectedData, vehicle_type: val.label});
                  }}
                />
              </View>

              <View style={styles.inputView}>
                <Text style={styles.textinputlabel}>Remark</Text>
                <TextInput
                  style={styles.inputText}
                  autoCapitalize="none"
                  autoCorrect={false}
                  multiline
                  numberOfLines={4}
                  value={remark}
                  placeholder="Enter Remark"
                  onChangeText={remark =>
                    SetSelectedData({...SelectedData, remark})
                  }
                  placeholderTextColor={'black'}
                />
              </View>

              <CustomTextInput
                title="Hotel Bill"
                value={hotelBill}
                placeholder="Enter Hotel Bill"
                onChangeText={hotelBill =>
                  SetSelectedData({...SelectedData, hotelBill})
                }
                maxLength={8}
                keyboardType={'numeric'}
              />

              <CustomTextInput
                title="GR Bill"
                value={GRBill}
                placeholder="Enter GR Bill"
                onChangeText={GRBill =>
                  SetSelectedData({...SelectedData, GRBill})
                }
                maxLength={8}
                keyboardType={'numeric'}
              />

              <CustomTextInput
                title="Other Bill"
                value={otherBill}
                placeholder="Enter Other Bill"
                onChangeText={otherBill =>
                  SetSelectedData({...SelectedData, otherBill})
                }
                maxLength={6}
                keyboardType={'numeric'}
              />

              <TouchableOpacity
                style={{
                  width: responsiveWidth(95),
                  height: responsiveHeight(8),
                  marginVertical: responsiveHeight(0.5),
                  marginHorizontal: responsiveHeight(1),
                  backgroundColor: 'white',
                  borderRadius: responsiveHeight(1.5),
                  padding: responsiveHeight(1.5),
                  elevation: responsiveHeight(0.2),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onPress={() => setSelectedOption('Attach Bill')}>
                <Text
                  style={{fontSize: 16, color: 'black', fontWeight: 'bold'}}>
                  Attach Bill
                </Text>
                <Icon name="camera" size={30} color={'black'} />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  width: responsiveWidth(95),
                  height: responsiveHeight(8),
                  marginVertical: responsiveHeight(0.5),
                  marginHorizontal: responsiveHeight(1),
                  backgroundColor: 'white',
                  borderRadius: responsiveHeight(1.5),
                  padding: responsiveHeight(1.5),
                  elevation: responsiveHeight(0.2),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onPress={() => setSelectedOption('Add Teacher')}>
                <Text
                  style={{fontSize: 16, color: 'black', fontWeight: 'bold'}}>
                  Add Teacher
                </Text>
                <Icon name="account-multiple-plus" size={30} color={'black'} />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  width: responsiveWidth(95),
                  height: responsiveHeight(8),
                  marginVertical: responsiveHeight(0.5),
                  marginHorizontal: responsiveHeight(1),
                  backgroundColor: 'white',
                  borderRadius: responsiveHeight(1.5),
                  padding: responsiveHeight(1.5),
                  elevation: responsiveHeight(0.2),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onPress={() => setSelectedOption('Add Samples')}>
                <Text
                  style={{fontSize: 16, color: 'black', fontWeight: 'bold'}}>
                  Add Samples
                </Text>
                <Icon name="book-check" size={30} color={'black'} />
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View>
            <TouchableOpacity style={styles.loginBtn} onPress={submitReport}>
              <Text style={{color: 'white', fontSize: 18}}>Submit Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <CutomWarning
        visible={WarmodalVisible}
        message={modalMessage}
        closeModal={() => setWarmodalVisible(false)}
      />

      {isLoading ? <Loader Loading={isLoading} /> : null}
    </>
  );
};

export default ReportSubmit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  maincontainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  inputText: {
    width: responsiveWidth(95),
    color: 'black',

    marginVertical: responsiveHeight(0.5),
    marginHorizontal: responsiveHeight(1.5),
    backgroundColor: 'white',
    borderRadius: responsiveHeight(1.5),
    padding: responsiveHeight(1.5),

    elevation: responsiveHeight(0.2),
  },
  textinputlabel: {
    marginLeft: responsiveHeight(2.2),
    fontSize: responsiveFontSize(1.9),
    color: '#1A1A18',
  },
  inputView: {
    marginTop: responsiveHeight(1.7),
    width: responsiveWidth(95),
    marginRight: responsiveHeight(2),

    position: 'relative',
  },
  loginBtn: {
    width: responsiveWidth(92),
    backgroundColor: '#4D2DB7',
    borderRadius: responsiveHeight(1),
    height: responsiveHeight(7),
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop:responsiveHeight(3),
    marginBottom: responsiveHeight(1.4),
    marginVertical: responsiveHeight(1.5),
    marginHorizontal: responsiveHeight(1.5),
  },
  dropdownContainer: {
    position: 'absolute',
    top: 60,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 3,
    zIndex: 1,
    width: 150,
  },
  card: {
    backgroundColor: 'white',
    padding: responsiveHeight(1.5),
    marginBottom: responsiveHeight(1),
    borderRadius: responsiveHeight(1),
    elevation: 2,
    width: responsiveWidth(95),
    alignSelf: 'center',
  },
  cardSection: {
    marginTop: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(5),
  },
  cardHeader: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    marginBottom: responsiveHeight(1),
    color: 'black',
  },
  concernItem: {
    marginBottom: responsiveHeight(1),
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldLabel: {
    width: responsiveWidth(30),
    marginRight: responsiveWidth(2),
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.8),
    color: 'black',
  },
  fieldValue: {
    flex: 1,
    fontSize: responsiveFontSize(1.8),
    color: 'black',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: responsiveHeight(1),
  },
});
