import React, {useEffect, useState} from 'react';
import {
  TextInput,
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomDropdown from '../../Component/Common_Component/CustomDropdown';
import {fetchToken} from '../../Helpers/fetchDetails';
import api from '../../API/api';

interface Teacher {
  name: string;
  contact: string;
}

interface LocationProp {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const AddSample: React.FC<LocationProp> = ({isVisible, onClose, onSubmit}) => {
  const [ClassItem, SetClassItem] = React.useState('');
  const [subjectItem, SetSubjectItem] = React.useState('');
  const [classes, SetClasses] = React.useState([]);
  const [subjects, SetSubjects] = React.useState([]);
  const [SelectedData, SetSelectedData] = React.useState({
    ClassItem: '',
    subjectItem: '',
    Quantity: '',
  });
  const [SchoolLoading, SetSchoolLoading] = React.useState(false);
  
  useEffect(() => {
    const getClasses = async () => {
      try {
        const token = await fetchToken();

        if (token) {
          let response = await api.getSample(token, 'report=1');
          SetSchoolLoading(false);
          // console.log('response', response.data.data);
          SetClasses(response.data.data);
        }
      } catch (error) {
        console.log(error.message);
        SetSchoolLoading(false);
      }
    };
    getClasses();
  }, []);

  useEffect(() => {
    const getSubjects = async () => {
      // try {
      //   const token = await fetchToken();
      //   // console.log('classitem', ClassItem);
      //   if (token && ClassItem) {
      //     let response = await api.subject(
      //       token,
      //       SelectedData?.ClassItem?.value,
      //     );
      //     SetSchoolLoading(false);
      //     SetSubjects(response.data);
      //   }
      // } catch (error) {
      //   console.log(error);
      //   SetSchoolLoading(false);
      // }
      if (ClassItem!=='') {
        const data = classes.find(
          ClassData => ClassData?.class_id === ClassItem,
        );
        // console.log('data', data?.subjects);
        SetSubjects(data?.subjects);
      }
    };
    getSubjects();
  }, [ClassItem]);

  function handleAddSample() {
    //Alert and validate for empty fields
    if (SelectedData.ClassItem === '') {
      Alert.alert('Please select a class');
      return;
    }
    if (SelectedData.subjectItem === '') {
      Alert.alert('Please select a subject');
      return;
    }
    if (SelectedData.Quantity === '') {
      Alert.alert('Please enter quantity');
      return;
    }
    onSubmit(SelectedData);
  }

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.modalBackground}
        onPress={onClose}
        activeOpacity={1}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={responsiveFontSize(3)} color="red" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Add Sample</Text>
          <CustomDropdown
            data={classes
              ?.filter(ClassData => ClassData.subjects.length > 0) // Filter out classes with empty subjects array
              .map(ClassData => ({
                label: ClassData.ClassName,
                value: ClassData.class_id,
              }))}
            placeholder={SelectedData.ClassItem.label || 'Select Class'}
            onSelect={item => {
              console.log(item);
              SetSelectedData(prevData => ({
                ...prevData,
                ClassItem: item,
              }));
              SetClassItem(item.value);
            }}
            style={{
              width: responsiveWidth(70),
              margin: 0,
              alignSelf: 'center',
            }}
          />
          <CustomDropdown
            data={subjects?.map(subject => ({
              label: subject.SubjectName,
              value: subject.SubjectID,
            }))}
            placeholder={SelectedData.subjectItem.label || 'Select Subject'}
            onSelect={item => {
              SetSelectedData(prevData => ({
                ...prevData,
                subjectItem: item,
              }));
              SetSubjectItem(item.value);
            }}
            style={{
              width: responsiveWidth(70),
              margin: 0,
              alignSelf: 'center',
            }}
          />
          <View
            style={{flexDirection: 'row', marginVertical: responsiveHeight(1)}}>
            <TextInput
              placeholder="Enter Quantity of Sample Books"
              value={SelectedData.Quantity}
              onChangeText={text => {
                SetSelectedData(prevData => ({
                  ...prevData,
                  Quantity: text,
                }));
              }}
              style={styles.inputText}
              placeholderTextColor={'grey'}
              keyboardType="numeric"
            />
          </View>
          <TouchableOpacity
            onPress={handleAddSample}
            style={styles.addButton}>
            <Text style={styles.addButtonText}>Send Sample</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: responsiveWidth(4),
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    marginBottom: responsiveHeight(2),
    color: 'black',
    textAlign: 'center',
  },
  teacherItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(1),
  },
  flatList: {
    marginBottom: responsiveHeight(1),
  },
  inputContainer: {
    flexDirection: 'row',
    marginVertical: responsiveHeight(1),
  },
  inputText: {
    flex: 1,
    borderBottomWidth: 0.5,
    borderColor: 'blue',
    padding: responsiveHeight(1),
    color: 'black',
    marginHorizontal: responsiveWidth(2),
  },
  addButton: {
    backgroundColor: 'blue',
    padding: responsiveHeight(1),
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  index: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2),
    width: responsiveWidth(10),
  },
  name: {
    color: 'black',
    fontWeight: '500',
    fontSize: responsiveFontSize(2),
    width: responsiveWidth(30),
  },
  contact: {
    color: 'black',
    fontWeight: '500',
    fontSize: responsiveFontSize(2),
    width: responsiveWidth(30),
  },

  closeButton: {
    position: 'absolute',
    top: responsiveHeight(1),
    right: responsiveWidth(1),
    // padding: responsiveHeight(1),
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'gray',
    elevation: 1,
  },
});

export default AddSample;
