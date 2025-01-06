import {
  View,
  Text,
  Modal,
  Alert,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Pressable,
} from 'react-native';
import React, { useState } from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import CutomWarning from '../../Component/Common_Component/CutomWarning';
import api from '../../API/api';
import { fetccUserId, fetchToken } from '../../Helpers/fetchDetails';
import Loader from '../../Component/Common_Component/Loader';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import CustomDropdown from '../../Component/Common_Component/CustomDropdown';
import Header from '../../Component/Common_Component/Header';
import CustomTextInput from '../../Component/Common_Component/CustomTextInput';
import { useDispatch } from 'react-redux';
import { addSchool } from '../../Reducer/slices/SchoolSlice';
import ConcernPerson from './ConernPerson';
import TeacherList from './TeacherList';

interface report {
  navigation: any;
}

const AddSchool: React.FC<report> = ({ navigation }) => {
  const [WarmodalVisible, setWarmodalVisible] = React.useState<boolean>(false);
  const [modalMessage, setModalMessage] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [Count, SetCount] = React.useState(1);
  const isEmailValid = (email: string): boolean => {
    // Email validation regex pattern
    const emailRegex = /^[^\s@]+@gmail\.com$/;
    return emailRegex.test(email);
  };
  const dispatch = useDispatch();
  const [modal, setModal] = useState('');
  const [concernPerson, setConcernPerson] = useState([]);
  const [teacher, setTeacher] = useState([]);
  const Boards = [
    { label: 'CBSE', value: 0 },
    { label: 'ICSE', value: 1 },
    { label: 'State Board', value: 2 },
  ];

  const States = [
    { label: 'Andhra Pradesh', value: 'Andhra Pradesh' },
    { label: 'Arunachal Pradesh', value: 'Arunachal Pradesh' },
    { label: 'Assam', value: 'Assam' },
    { label: 'Bihar', value: 'Bihar' },
    { label: 'Chhattisgarh', value: 'Chhattisgarh' },
    { label: 'Goa', value: 'Goa' },
    { label: 'Gujarat', value: 'Gujarat' },
    { label: 'Haryana', value: 'Haryana' },
    { label: 'Himachal Pradesh', value: 'Himachal Pradesh' },
    { label: 'Jharkhand', value: 'Jharkhand' },
    { label: 'Karnataka', value: 'Karnataka' },
    { label: 'Kerala', value: 'Kerala' },
    { label: 'Madhya Pradesh', value: 'Madhya Pradesh' },
    { label: 'Maharashtra', value: 'Maharashtra' },
    { label: 'Manipur', value: 'Manipur' },
    { label: 'Meghalaya', value: 'Meghalaya' },
    { label: 'Mizoram', value: 'Mizoram' },
    { label: 'Nagaland', value: 'Nagaland' },
    { label: 'Odisha', value: 'Odisha' },
    { label: 'Punjab', value: 'Punjab' },
    { label: 'Rajasthan', value: 'Rajasthan' },
    { label: 'Sikkim', value: 'Sikkim' },
    { label: 'Tamil Nadu', value: 'Tamil Nadu' },
    { label: 'Telangana', value: 'Telangana' },
    { label: 'Tripura', value: 'Tripura' },
    { label: 'Uttar Pradesh', value: 'Uttar Pradesh' },
    { label: 'Uttarakhand', value: 'Uttarakhand' },
    { label: 'West Bengal', value: 'West Bengal' },
    { label: 'Andaman and Nicobar Islands', value: 'Andaman and Nicobar Islands' },
    { label: 'Chandigarh', value: 'Chandigarh' },
    { label: 'Dadra and Nagar Haveli and Daman and Diu', value: 'Dadra and Nagar Haveli and Daman and Diu' },
    { label: 'Lakshadweep', value: 'Lakshadweep' },
    { label: 'Delhi', value: 'Delhi' },
    { label: 'Puducherry', value: 'Puducherry' },
    { label: 'Ladakh', value: 'Ladakh' },
    { label: 'Jammu and Kashmir', value: 'Jammu and Kashmir' },
  ];

  const Standard = [
    { label: 'Class 1 - Class 8', value: 0 },
    { label: 'Class 1 - Class 10', value: 1 },
    { label: 'Class 1 - Class 12', value: 2 },
  ];

  const [formData, setFormData] = React.useState({
    name: '',
    city: '',
    state: '',
    country: '',
    contact_no: '',
    strength: '',
    pincode: '',
    address: '',
    school_code: '',
    board: '',
    bookSellerName: '',
    bookSellerNum: '',
    bookName: '',
    standard: '',
  });

  const {
    name,
    strength,
    contact_no,
    city,
    state,
    country,
    pincode,
    address,
    school_code,
    board,
    bookSellerName,
    bookSellerNum,
    bookName,
    standard
  } = formData;

  const Submit = async () => {
    console.log('submit click');

    if (name === '') {
      setModalMessage('School Name is required');
      setWarmodalVisible(true);
      return;
    }

    if (school_code === '') {
      setModalMessage('School Code is required');
      setWarmodalVisible(true);
      return;
    }

    if (strength === '') {
      setModalMessage('strength is required');
      setWarmodalVisible(true);
      return;
    }

    // if (email === '') {
    //   setModalMessage('Email is required');
    //   setWarmodalVisible(true);
    //   return;
    // } else if (!isEmailValid(email)) {
    //   setModalMessage('Invalid email format');
    //   setWarmodalVisible(true);
    //   return;
    // }

    if (contact_no === '' || contact_no.length !== 10) {
      setModalMessage('Contact Number is required');
      setWarmodalVisible(true);
      return;
    }

    if (address === '') {
      setModalMessage('Address is required');
      setWarmodalVisible(true);
      return;
    }

    if (city === '') {
      setModalMessage('City is required');
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

    if (pincode === '' || pincode.length < 4) {
      setModalMessage('Postal Code is required');
      setWarmodalVisible(true);
      return;
    }

    setIsLoading(true);
    const token = await fetchToken();
    const user_Id = await fetccUserId();
    if (user_Id && token) {
      const user_Report = {
        name: name,
        strength: parseInt(strength),
        contact_no: parseInt(contact_no),
        city: city,
        state: state,
        country: country,
        code: school_code,
        pincode: pincode,
        address: address,
        board: board,
        concern_name: concernPerson,
        teachers: teacher,
        book_name: bookName,
        book_seller_name: bookSellerName,
        book_seller_number: bookSellerNum,
        std: standard
      };

      console.log('user respor', user_Report);

      try {
        const response = await api.user_Report(token, user_Report);
        console.log('here report form', response);
        if (response.data.status === true) {
          dispatch(addSchool(response.data.data));

          Toast.show({
            type: 'success',
            text1: response.data.message,
            autoHide: false,
            visibilityTime: 2000,
            onShow: () => {
              setTimeout(() => {
                Toast.hide();
                setIsLoading(false);
                navigation.navigate('Manage School');
              }, 2000);
            },
          });
        }
      } catch (error) {
        setIsLoading(false);
        console.log('Report Error:', error);
      }
    }
  };

  const AddMore = async () => {
    if (name === '') {
      setModalMessage('School Name is required');
      setWarmodalVisible(true);
      return;
    }

    if (strength === '' || strength === '0') {
      setModalMessage('strength is required');
      setWarmodalVisible(true);
      return;
    }
    if (school_code === '') {
      setModalMessage('School Code is required');
      setWarmodalVisible(true);
      return;
    }

    // if (email === '') {
    //   setModalMessage('Email is required');
    //   setWarmodalVisible(true);
    //   return;
    // } else if (!isEmailValid(email)) {
    //   setModalMessage('Invalid email format');
    //   setWarmodalVisible(true);
    //   return;
    // }

    if (contact_no === '' || contact_no.length !== 10) {
      setModalMessage('Contact Number is required');
      setWarmodalVisible(true);
      return;
    }
    if (address === '') {
      setModalMessage('Address is required');
      setWarmodalVisible(true);
      return;
    }

    if (city === '') {
      setModalMessage('City is required');
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

    if (pincode === '' || pincode.length < 4) {
      setModalMessage('Postal Code is required');
      setWarmodalVisible(true);
      return;
    }

    setIsLoading(true);
    const token = await fetchToken();
    const user_Id = await fetccUserId();
    if (user_Id && token) {
      const user_Report = {
        name: name,
        strength: parseInt(strength),
        contact_no: parseInt(contact_no),
        city: city,
        state: state,
        country: country,
        code: school_code,
        pincode: pincode,
        address: address,
        board: board,
        concern_name: concernPerson,
        teachers: teacher,
        book_name: bookName,
        book_seller_name: bookSellerName,
        book_seller_number: bookSellerNum,
        std: standard
      };

      console.log('user respor', user_Report);

      try {
        const response = await api.user_Report(token, user_Report);
        console.log('here report form', response);
        if (response.data.status === true) {
          dispatch(addSchool(response.data.data));

          Toast.show({
            type: 'success',
            text1: response.data.message,
            autoHide: false,
            visibilityTime: 2000,
            onShow: () => {
              setTimeout(() => {
                Toast.hide();
                setIsLoading(false);
                setFormData({
                  name: '',
                  city: '',
                  state: '',
                  country: '',
                  contact_no: '',
                  strength: '',
                  pincode: '',
                  address: '',
                  school_code: '',
                  board: '',
                  bookName: '',
                  bookSellerName: '',
                  bookSellerNum: '',
                  standard: ''
                });
                setConcernPerson([]);
                setTeacher([]);
              }, 2000);
            },
          });

          SetCount(Count + 1);
        }
      } catch (error) {
        setIsLoading(false);
        console.log('Report Error:', error);
      }
    }
  };

  const closeModal = () => {
    setWarmodalVisible(false);
  };
  return (
    <>
      <View style={styles.container}>
        <Header
          title={'Add School'}
          bg={'blue'}
          leftIcon={'arrow-back'}
          onLeftPress={() => navigation.goBack()}
        />

        <View style={styles.maincontainer}>
          <ScrollView keyboardShouldPersistTaps='handled'>
            <View>
              {/* <View style={{ alignItems: "center", marginTop: 10 }}>
                                <Text style={{ fontSize: responsiveFontSize(3), marginBottom: responsiveHeight(3),color:'black' }}>Add School Detail   {Count}</Text>

                            </View> */}
              <CustomTextInput
                title="School Name"
                value={name}
                placeholder="Enter School Name"
                onChangeText={name => setFormData({ ...formData, name })}
              />

              <CustomTextInput
                title="Address"
                value={address}
                placeholder="Enter Address"
                onChangeText={address => setFormData({ ...formData, address })}
              />

              <View style={styles.inputView}>
                <Text style={styles.textinputlabel}>Board</Text>
                <CustomDropdown
                  data={Boards?.map(ele => ({
                    label: ele.label,
                    value: ele.value,
                  }))}
                  placeholder="Select Board"
                  onSelect={val => {
                    setFormData({ ...formData, board: val.label });
                  }}
                />
              </View>

              <View style={styles.inputView}>
                <Text style={styles.textinputlabel}>Standard</Text>
                <CustomDropdown
                  data={Standard?.map(ele => ({
                    label: ele.label,
                    value: ele.value,
                  }))}
                  placeholder="Select Standard"
                  onSelect={val => {
                    setFormData({ ...formData, standard: val.label });
                  }}
                />
              </View>

              <CustomTextInput
                title="School Code"
                value={school_code}
                keyboardType="default"
                placeholder="Enter School Code"
                onChangeText={school_code =>
                  setFormData({ ...formData, school_code })
                }
              />

              <CustomTextInput
                title="Strength"
                value={strength}
                keyboardType="phone-pad"
                placeholder="Enter Strength"
                onChangeText={strength => setFormData({ ...formData, strength })}
              />

              <CustomTextInput
                title="Contact No"
                value={contact_no}
                keyboardType="phone-pad"
                placeholder="Enter Contact No"
                onChangeText={contact_no => {
                  const numericValue = contact_no.replace(/[^0-9]/g, '');
                  setFormData({ ...formData, contact_no: numericValue });
                }}
                maxLength={10}
              />

              <CustomTextInput
                title="City"
                value={city}
                placeholder="Enter City"
                onChangeText={city => setFormData({ ...formData, city })}
              />

              {/* <CustomTextInput
                title="State"
                value={state}
                placeholder="Enter State"
                onChangeText={state => setFormData({...formData, state})}
              /> */}
              <View style={styles.inputView}>
                <Text style={styles.textinputlabel}>State</Text>
                <CustomDropdown
                  data={States?.map(ele => ({
                    label: ele.label,
                    value: ele.value,
                  }))}
                  placeholder="Select State"
                  onSelect={val => {
                    setFormData({ ...formData, state: val.label });
                  }}
                />
              </View>
              <CustomTextInput
                title="Postal Code"
                value={pincode}
                placeholder="Enter Postal Code"
                onChangeText={pincode => setFormData({ ...formData, pincode })}
                maxLength={6}
                keyboardType={'numeric'}
              />

              <CustomTextInput
                title="Country"
                value={country}
                placeholder="Enter Country"
                onChangeText={country => setFormData({ ...formData, country })}
              />

              <CustomTextInput
                title="Book Seller Name"
                value={bookSellerName}
                placeholder="Enter Book Seller Name"
                onChangeText={bookSellerName =>
                  setFormData({ ...formData, bookSellerName })
                }
              />

              <CustomTextInput
                title="Book Seller Contact Number"
                value={bookSellerNum}
                placeholder="Enter Book Seller Contact"
                onChangeText={bookSellerNum =>
                  setFormData({ ...formData, bookSellerNum })
                }
                keyboardType={'numeric'}
                maxLength={10}
              />

              <CustomTextInput
                title="Current Book Name"
                value={bookName}
                placeholder="Enter Current Book Name"
                onChangeText={bookName => setFormData({ ...formData, bookName })}
              />

              {/* Concern Person Details */}
              <View style={styles.cardSection}>
                <Text style={styles.cardHeader}>Concern Person Details</Text>

                <View style={styles.card}>
                  {concernPerson.map((item: any, index: number) => (
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
                  <Pressable
                    style={styles.addMoreButton}
                    onPress={() => setModal('concern_Person')}>
                    <Text style={styles.addMore}>Add Concern Person (+)</Text>
                  </Pressable>
                </View>
              </View>

              {/* Teacher Details */}
              <View style={styles.cardSection}>
                <Text style={styles.cardHeader}>Teacher Details</Text>

                <View style={styles.card}>
                  {teacher.map((item: any, index: number) => (
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
                  <Pressable
                    style={styles.addMoreButton}
                    onPress={() => setModal('Teacher_Modal')}>
                    <Text style={styles.addMore}>Add Teacher (+)</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <View>
              <TouchableOpacity
                onPress={Submit}
                style={[styles.loginBtn, { marginRight: 10 }]}>
                <Text style={styles.loginText}>Submit Detail</Text>
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity onPress={AddMore} style={styles.loginBtn}>
                <Text style={styles.loginText}>Add More</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <CutomWarning
        visible={WarmodalVisible}
        message={modalMessage}
        closeModal={closeModal}
      />
      <ConcernPerson
        isVisible={modal === 'concern_Person'}
        onClose={() => setModal('')}
        concernList={concernPerson}
        updateconcernList={setConcernPerson as never}
      />
      <TeacherList
        isVisible={modal === 'Teacher_Modal'}
        onClose={() => setModal('')}
        updateteacher={setTeacher as never}
        teacher={teacher}
      />

      {isLoading ? <Loader Loading={isLoading} /> : null}
    </>
  );
};

export default AddSchool;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // marginVertical: 19
  },
  maincontainer: {
    flex: 1,
    backgroundColor: 'white',
  },

  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  inputView: {
    marginTop: responsiveHeight(1.7),
    width: responsiveWidth(95),
    marginRight: responsiveHeight(2),

    position: 'relative',
  },

  inputText: {
    width: responsiveWidth(85),
    // height: responsiveHeight(7),
    marginVertical: responsiveHeight(1.5),
    backgroundColor: 'white',
    borderRadius: responsiveHeight(1.5),
    padding: responsiveHeight(1.5),
    elevation: 2,
  },

  textinputlabel: {
    marginLeft: responsiveHeight(2.2),
    fontSize: responsiveFontSize(1.9),
    color: '#1A1A18',
  },

  loginBtn: {
    width: responsiveWidth(40),
    backgroundColor: '#4D2DB7',
    borderRadius: responsiveHeight(1),
    height: responsiveHeight(7),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: responsiveHeight(3),
    marginBottom: responsiveHeight(1.4),
  },
  loginText: {
    color: '#FFF',
    fontSize: responsiveFontSize(2.3),
    fontWeight: 'bold',
  },
  actionButton: {
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
  addMore: {
    color: 'black',
    alignSelf: 'center',
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
    marginTop: responsiveHeight(1),
  },
  addMoreButton: {
    backgroundColor: 'skyblue',
    borderRadius: 40,
    height: responsiveHeight(5),
  },
});
