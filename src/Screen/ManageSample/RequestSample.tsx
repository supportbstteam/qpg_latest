import {
  Alert,
  Button,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
Image,  
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import CustomTextInput from '../../Component/Common_Component/CustomTextInput';
import Header from '../../Component/Common_Component/Header';
import Bootom_Sheet_Dropdown from '../../Component/Common_Component/Bootom_Sheet_Dropdown';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import CutomWarning from '../../Component/Common_Component/CutomWarning';
import Loader from '../../Component/Common_Component/Loader';
import {fetchToken} from '../../Helpers/fetchDetails';
import api from '../../API/api';
import DatePicker from 'react-native-date-picker';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import ImageSelectionModal from '../Report/Reimbursment';
import Bootom_Sheet_Dropdown_checkbox from '../../Component/Common_Component/Bootom_Sheet_Dropdown_checkbox';

const RequestSample: React.FC<{navigation: any}> = ({navigation}) => {
  const [isLoading, SetIsLoading] = React.useState(false);
  const [WarmodalVisible, SetWarmodalVisible] = React.useState(false);
  const [modalMessage, SetModalMessage] = React.useState('');
  const [ClassItem, SetClassItem] = React.useState('');
  const [classes, SetClasses] = React.useState([]);
  const [subjects, SetSubjects] = React.useState([]);
  const [SelectedData, SetSelectedData] = React.useState({
    ClassItem: '',
    subjectItem: [],
    Quantity: '',
    date: new Date().toISOString().split('T')[0],
    transportName: '',
    shippedPerson: '',
  });
  const [SchoolLoading, SetSchoolLoading] = React.useState(false);
  const [date, setDate] = React.useState(new Date());
  const [open, setOpen] = React.useState(false);
  const [sample, setSample] = React.useState([]);
  const [image, setImage] = React.useState([]);
  const [ImageModal, setImageModal] = React.useState(false);
  const submitRequest = async () => {
    if (sample.length === 0) {
      SetModalMessage('Please Add Sample');
      SetWarmodalVisible(true);
      return;
    }
    if (SelectedData.transportName === '') {
      SetModalMessage('Please Mention Transport Name');
      SetWarmodalVisible(true);
      return;
    }
    if (SelectedData.shippedPerson === '') {
      SetModalMessage('Please Mention Ship to Person Name');
      SetWarmodalVisible(true);
      return;
    }
    Alert.alert('Are you sure you want to Submit the request?', '', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          const data = new FormData();
          data.append('transport_name', SelectedData.transportName);
          data.append('shipped_person', SelectedData.shippedPerson);
          data.append('sample', JSON.stringify(sample));
          if (image.length > 0) {
            data.append('gr_bill', {
              uri: image[0],
              type: 'image/jpeg',
              name: 'reimbursement.jpg',
            });
          }
          console.log('original', sample);
          console.log('sample', data);

          // return;
          try {
            const token = await fetchToken();
            if (token) {
              SetIsLoading(true);
              const response = await api.requestSample(token, data);

              console.log('response', response.data);
              if (response.status === 200) {
                SetIsLoading(false);
                Toast.show({
                  type: 'success',
                  position: 'top',
                  text1: 'Sample Request Submitted Successfully',
                  visibilityTime: 3000,
                  autoHide: true,
                });
                SetSelectedData({
                  ...SelectedData,
                  ClassItem: '',
                  subjectItem: [],
                  Quantity: '',
                  transportName: '',
                  shippedPerson: '',
                });
                setSample([]);
                setImage([]);
              }
            }
          } catch (error) {
            console.log("add sample  error",error);
            SetIsLoading(false);
            SetModalMessage('Something went wrong');
            SetWarmodalVisible(true);
          }
        },
      },
    ]);
  };

  const handleSample = async () => {
    
    console.log("selected subjects", SelectedData.subjectItem);
    if (!SelectedData.ClassItem) {
      SetModalMessage('Please Select Class');
      SetWarmodalVisible(true);
      return;
    }
    if (SelectedData.subjectItem.length===0) {
      SetModalMessage('Please Select Subject');
      SetWarmodalVisible(true);
      return;
    }
    if (!SelectedData.Quantity) {
      SetModalMessage('Please Enter Quantity');
      SetWarmodalVisible(true);
      return;
    }
    if (!SelectedData.date) {
      SetModalMessage('Please Select Date');
      SetWarmodalVisible(true);
      return;
    }
    //Add Final Submit Request validation
    AddSample();
  };

  useEffect(() => {
    const getClasses = async () => {
      try {
        const token = await fetchToken();

        if (token) {
          let response = await api.class(token);
          SetSchoolLoading(false);
       
          SetClasses(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getClasses();
  }, []);

  useEffect(() => {
    const getSubjects = async () => {
      try {
        const token = await fetchToken();
        // console.log('classitem', ClassItem);
        if (token && ClassItem) {
          let response = await api.subject(
            token,
            SelectedData?.ClassItem?.value,
          );
          SetSchoolLoading(false);
       
          SetSubjects(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getSubjects();
  }, [ClassItem]);

  const handleRemove = (id: string) => {
    Alert.alert('Are you sure you want to delete the Sample?', '', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          const updatedSampleList = sample.filter(item => item.id !== id);
          setSample(updatedSampleList);
        },
      },
    ]);
  };

  const AddSample = () => {
  
    
    // Map over each selected subject and create a new sample for each
    const newSamples = SelectedData.subjectItem.map(subject => ({
      id: Math.random().toString(36).substring(2, 9), // Generate unique id
      class_id: `${SelectedData.ClassItem.value}`,
      subject_id: `${subject.value}`, // Use the current subject's value
      qty: `${SelectedData.Quantity}`,
      date: `${SelectedData.date}`,
      className: `${SelectedData.ClassItem.label}`,
      subjectName: `${subject.label}`, // Use the current subject's label
    }));
    
    // Update the state with all new samples
    setSample([...sample, ...newSamples]);
    
    SetSelectedData({
      ...SelectedData,
      ClassItem: '',
      subjectItem: [],
      Quantity: '',
      transportName: '',
      shippedPerson: '',
    });
  };
  


  const removeImage = (index: number) => {
    const updatedImages = [...image];
    updatedImages.splice(index, 1);
    setImage(updatedImages);
  };
  return (
    <>
      <View style={styles.Container}>
        <Header
          title={'Sample Request'}
          bg={'blue'}
          leftIcon={'menu'}
          onLeftPress={() => navigation.toggleDrawer()}
        />
        <View style={styles.mainConainer}>
          <ScrollView>
            <View style={{marginBottom: 20}}>
              <Bootom_Sheet_Dropdown
                title="Class"
                data={
                  classes
                    ? classes.map(ClassData => ({
                        label: ClassData.ClassName,
                        value: ClassData.ClassID,
                      }))
                    : []
                }
                selectedItem={SelectedData.ClassItem}
                placeholder="Select Class"
                onSelect={item => {
                  SetSelectedData(prevData => ({
                    ...prevData,
                    ClassItem: item,
                  }));
                  SetClassItem(item.value);
                }}
                isLoading={SchoolLoading}
              />

              <Bootom_Sheet_Dropdown_checkbox
                title="Subject"
                data={
                  subjects
                    ? subjects.map(subject => ({
                        label: subject.SubjectName,
                        value: subject.SubjectID,
                      }))
                    : []
                }
                selectedItems={SelectedData.subjectItem}
                placeholder="Select Subject"
                onSelect={item => {
                  SetSelectedData(prevData => ({
                    ...prevData,
                    subjectItem: item,
                  }));
                }}
                isLoading={SchoolLoading}
              />

              <CustomTextInput
                title="Quantity"
                value={SelectedData.Quantity}
                onChangeText={text => {
                  SetSelectedData(prevData => ({
                    ...prevData,
                    Quantity: text,
                  }));
                }}
                placeholder="Enter Quantity for Sample"
                keyboardType={'numeric'}
              />
              <TouchableWithoutFeedback>
                <CustomTextInput
                  title="Date"
                  value={SelectedData.date || date.toISOString().split('T')[0]} // Set the initial value to today's date
                  placeholder="Select Date"
                  editable={false}
                />
                <Icon
                  name={'date-range'}
                  size={30}
                  color={'black'}
                  onPress={() => setOpen(true)}
                  style={{position: 'absolute', right: 20, top: 55}}
                />
              </TouchableWithoutFeedback>

              <Pressable
                onPress={handleSample}
                style={{
                  width: responsiveWidth(95),
                  alignSelf: 'center',
                  overflow: 'hidden',
                  borderRadius: 50,
                  elevation: 10,
                  height: responsiveHeight(5),
                  marginTop: responsiveHeight(4),
                  backgroundColor: '#5F5D9C',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: responsiveFontSize(2),
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    color: 'white',
                    marginTop: responsiveHeight(1),
                  }}>
                  Add Sample
                </Text>
              </Pressable>

              <View
                style={{
                  borderBottomColor: 'black',
                  borderBottomWidth: 1,
                  marginTop: 40,
                  width: '95%',
                  alignSelf: 'center',
                }}
              />

              {sample.length > 0 &&
                sample.map((item, index) => (
                  <View style={styles.card} key={index}>
                    <View style={styles.titleContainer}>
                      <Text style={styles.titleText}>{item.date}</Text>
                    </View>

                    <View style={styles.infoContainer}>
                      <View
                        style={{
                          maxWidth: responsiveWidth(50),
                          minWidth: responsiveWidth(50),
                        }}>
                        <Text style={styles.infoText}>{item.subjectName}</Text>
                        <Text style={styles.infoText}>{item.className}</Text>
                      </View>

                      <Text style={styles.qtyText}>{item.qty}</Text>

                      <View style={styles.iconContainer}>
                        <Icon
                          name="delete"
                          size={22}
                          color={'black'}
                          onPress={() => handleRemove(item.id)}
                        />
                      </View>
                    </View>
                  </View>
                ))}
              {sample.length > 0 && (
                <>
                  <CustomTextInput
                    title="Transport Name"
                    value={SelectedData.transportName} // Set the initial value to today's date
                    placeholder="Enter Transport Name"
                    onChangeText={transportName =>
                      SetSelectedData({...SelectedData, transportName})
                    }
                  />
                  <CustomTextInput
                    title="Ship To Person"
                    value={SelectedData.shippedPerson} // Set the initial value to today's date
                    placeholder="Enter Person Name"
                    onChangeText={shippedPerson =>
                      SetSelectedData({...SelectedData, shippedPerson})
                    }
                  />
                  <Pressable onPress={() => setImageModal(true)}>
                    <CustomTextInput
                      title="Attach GR"
                      value={'Attachment'} // Set the initial value to today's date
                      placeholder="Select Date"
                      editable={false}
                    />
                  </Pressable>
                  <View style={styles.imageContainer}>
            {image?.map((image, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{uri: image}} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeImage(index)}>
                  <FontAwesome name="times" size={20} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
                </>
              )}
            </View>
          </ScrollView>

          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <TouchableOpacity onPress={submitRequest} style={[styles.loginBtn]}>
              <Text style={styles.loginText}>Submit Request</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('View Sample')}
              style={[styles.loginBtn]}>
              <Text style={styles.loginText}>View Samples</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ImageSelectionModal
        isVisible={ImageModal}
        onClose={() => setImageModal(false)}
        images={image}
        setImages={setImage}
      />

      <CutomWarning
        visible={WarmodalVisible}
        message={modalMessage}
        closeModal={() => SetWarmodalVisible(false)}
      />
      <DatePicker
        title={'Sample Date'}
        modal
        open={open}
        date={date}
        mode="date"
        minimumDate={new Date()} //To restrict past date
        onConfirm={date => {
          setOpen(false);
          const formattedDate = date.toISOString().split('T')[0];
          SetSelectedData(prevData => ({
            ...prevData,
            date: formattedDate,
          }));
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
      {isLoading ? <Loader Loading={isLoading} /> : null}
    </>
  );
};

export default RequestSample;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: 'white',
  },
  mainConainer: {
    flex: 1,
    backgroundColor: 'white',
  },

  calculateContainer: {
    width: responsiveWidth(95),

    marginVertical: responsiveHeight(1.5),
    marginHorizontal: responsiveHeight(1.5),
    backgroundColor: 'white',
    borderRadius: responsiveHeight(1.5),
    padding: responsiveHeight(2.2),
    elevation: responsiveHeight(0.2),
  },
  plus_minusContainer: {
    backgroundColor: 'blue',
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    marginHorizontal: 10,
    marginTop: 10,
  },
  table: {
    borderWidth: 0.4,
    borderColor: '#000',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#000',
    padding: 8,
  },
  loginBtn: {
    width: responsiveWidth(45),
    backgroundColor: '#4D2DB7',
    borderRadius: responsiveHeight(1),
    height: responsiveHeight(7),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: responsiveWidth(2),
    marginBottom: responsiveHeight(1.4),
  },
  loginText: {
    color: '#FFF',
    fontSize: responsiveFontSize(2.3),
    fontWeight: 'bold',
  },
  card: {
    height: responsiveHeight(10),
    width: responsiveWidth(95),
    backgroundColor: '#B5C0D0',
    alignSelf: 'center',
    marginTop: responsiveHeight(4),
    borderRadius: 10,
    elevation: 5,
    paddingHorizontal: responsiveWidth(5),
  },

  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: responsiveHeight(0.4),
  },

  titleText: {
    color: 'black',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },

  infoContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', // Add space between children
    alignItems: 'center',
  },

  infoText: {
    color: 'black',
    fontSize: responsiveFontSize(1.6),
    fontWeight: 'bold',
  },

  qtyText: {
    fontSize: responsiveFontSize(3),
    color: 'black',
    fontWeight: 'bold',
  },

  iconContainer: {
    justifyContent: 'center', // Center the content vertically
  },
  imageWrapper: {
    position: 'relative',
    margin: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    padding: 5,
  },
});
