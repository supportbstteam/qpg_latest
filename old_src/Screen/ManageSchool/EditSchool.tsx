import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectSchoolById,
  updateSchoolById,
} from '../../Reducer/slices/SchoolSlice';
import Header from '../../Component/Common_Component/Header';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import CustomTextInput from '../../Component/Common_Component/CustomTextInput';
import Loader from '../../Component/Common_Component/Loader';
import { fetchToken } from '../../Helpers/fetchDetails';
import api from '../../API/api';
import CutomWarning from '../../Component/Common_Component/CutomWarning';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import CustomDropdown from '../../Component/Common_Component/CustomDropdown';
import ConcernPerson from './ConernPerson';
import { Pressable } from 'react-native';
import TeacherList from './TeacherList';

const EditSchool: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { Id } = route.params;
  const selectedSchool = useSelector(state => selectSchoolById(state, Id));
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [WarmodalVisible, setWarmodalVisible] = React.useState<boolean>(false);
  const [modalMessage, setModalMessage] = React.useState<string>('');
  const [formData, setFormData] = React.useState({
    name: selectedSchool?.name || '',
    strength: selectedSchool?.strength?.toString() || '',
    code: selectedSchool?.code || '',
    pincode: selectedSchool?.pincode || '',
    city: selectedSchool?.city || '',
    state: selectedSchool?.state || '',
    country: selectedSchool?.country || '',
    address: selectedSchool?.address || '',
    board: selectedSchool?.board || '',
    bookSellerName: selectedSchool?.book_seller_name || '',
    bookSellerNum: selectedSchool?.book_seller_number || '',
    bookName: selectedSchool?.book_name || '',
    standard: selectedSchool?.std || '',
  });
  const [concern, setConcern] = React.useState(selectedSchool?.concerns || []);
  const [teacher, setTeacher] = React.useState(selectedSchool?.teachers || []);
  const [modal, setModal] = React.useState('');

  const {
    name,
    strength,
    city,
    state,
    country,
    pincode,
    code,
    address,
    board,
    bookSellerName,
    bookSellerNum,
    bookName,
    standard
  } = formData;

  const Boards = [
    { label: 'CBSE', value: 0 },
    { label: 'ICSE', value: 1 },
    { label: 'State Board', value: 2 },
  ];

  const Standard = [
    { label: 'Class 1 - Class 8', value: 0 },
    { label: 'Class 1 - Class 10', value: 1 },
    { label: 'Class 1 - Class 12', value: 2 },
  ];

  console.log('school data ', selectedSchool);
  const dispatch = useDispatch();

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


  const updateSchool = async () => {
    try {
      if (name === '') {
        setModalMessage('School Name is required');
        setWarmodalVisible(true);
        return;
      }
      if (code === '') {
        setModalMessage('School Code is required');
        setWarmodalVisible(true);
        return;
      }
      if (strength === '' || strength === '0') {
        setModalMessage('strength is required');
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
      const UpdateSchool = {
        name: name,
        strength: parseInt(strength),
        city: city,
        state: state,
        country: country,
        code: code,
        pincode: pincode,
        address: address,
        book_name: bookName,
        book_seller_name: bookSellerName,
        book_seller_number: bookSellerNum,
        teachers: teacher,
        board: board,
        concern_name: concern
      };
      setIsLoading(true);

      const token = await fetchToken();
      if (token) {
        const respone = await api.Update_School(Id, token, UpdateSchool);
        if (respone.data.status === true) {
          Toast.show({
            type: 'success',
            text1: respone.data.message,
            autoHide: false,
            visibilityTime: 2000,
            onShow: () => {
              setTimeout(() => {
                Toast.hide();
                setIsLoading(false);
                dispatch(
                  updateSchoolById({ ...selectedSchool, ...UpdateSchool }),
                );
                navigation.goBack();
              }, 2000); // Wait for 1 second before navigating
            },
          });
        }
        console.log(respone.data);
      }
    } catch (error) {
      console.log('edit shop error', error);
    }
  };

  const closeModal = () => {
    setWarmodalVisible(false);
  };

  return (
    <>
      <View style={styles.container}>
        <Header
          title={'Edit School'}
          bg={'blue'}
          leftIcon={'arrow-back'}
          onLeftPress={() => navigation.goBack()}
        />

        <View style={styles.maincontainer}>
          <ScrollView>
            <View>
              <CustomTextInput
                title="School Name"
                value={name}
                placeholder="Enter School Name"
                onChangeText={name => setFormData({ ...formData, name })}
              />

              <View style={styles.inputView}>
                <Text style={styles.textinputlabel}>Board</Text>
                <CustomDropdown
                  data={Boards?.map(ele => ({
                    label: ele.label,
                    value: ele.value,
                  }))}
                  placeholder={board === '' ? 'Select Board' : board}
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
                  placeholder={standard === '' ? 'Select Standard' : standard}
                  onSelect={val => {
                    setFormData({ ...formData, standard: val.label });
                  }}
                />
              </View>

              <CustomTextInput
                title="School Code"
                value={code}
                keyboardType="default"
                placeholder="Enter School Code"
                onChangeText={code => setFormData({ ...formData, code })}
              />

              <CustomTextInput
                title="Strength"
                value={strength}
                keyboardType="phone-pad"
                placeholder="Enter Strength"
                onChangeText={strength => setFormData({ ...formData, strength })}
              />

              <CustomTextInput
                title="Address"
                value={address}
                placeholder="Enter Address"
                onChangeText={address => setFormData({ ...formData, address })}
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
                onChangeText={state => setFormData({ ...formData, state })}
              /> */}
              <View style={styles.inputView}>
                <Text style={styles.textinputlabel}>States</Text>
                <CustomDropdown
                  data={States?.map(ele => ({
                    label: ele.label,
                    value: ele.value,
                  }))}
                  placeholder={state === '' ? 'Select States' : state}
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
                title="Book Seller Contact No."
                value={bookSellerNum}
                placeholder="Enter Book Seller Contact No."
                onChangeText={bookSellerNum =>
                  setFormData({ ...formData, bookSellerNum })
                }
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
                  {concern.map((item: any, index: number) => (
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

          <View>
            <TouchableOpacity onPress={updateSchool} style={styles.loginBtn}>
              <Text style={styles.loginText}>Update School</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ConcernPerson
        isVisible={modal === 'concern_Person'}
        onClose={() => setModal('')}
        concernList={concern}
        updateconcernList={setConcern as never}
      />
      <TeacherList
        isVisible={modal === 'Teacher_Modal'}
        onClose={() => setModal('')}
        updateteacher={setTeacher as never}
        teacher={teacher}
      />
      <CutomWarning
        visible={WarmodalVisible}
        message={modalMessage}
        closeModal={closeModal}
      />
      {isLoading ? <Loader Loading={isLoading} /> : null}
    </>
  );
};

export default EditSchool;

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
  card: {
    backgroundColor: 'white',
    padding: responsiveHeight(1.5),
    marginBottom: responsiveHeight(1),
    borderRadius: responsiveHeight(1),
    elevation: 2,
    width: responsiveWidth(95),
    alignSelf: 'center',
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
