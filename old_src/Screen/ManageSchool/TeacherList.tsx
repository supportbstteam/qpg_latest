import React, {useState} from 'react';
import {
  Alert,
  TextInput,
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface TeacherList {
  name: string;
  subject: string;
  designation: string;
  email: string;
  address: string;
  contact:string
}

interface TeacherListModalProps {
  isVisible: boolean;
  onClose: () => void;
  updateteacher: (updatedList: TeacherList[]) => void;
  teacher: TeacherList[]
}

const TeacherList: React.FC<TeacherListModalProps> = ({
  isVisible,
  onClose,
  updateteacher,
  teacher
}) => {
  const [data, setData] = useState({
    name: '',
    designation: '',
    subject: '',
    email: '',
    address: '',
    contact:'',
  });

  const isEmailValid = (email: string): boolean => {
    // Email validation regex pattern
    const emailRegex = /^[^\s@]+@gmail\.com$/;
    return emailRegex.test(email);
  };

  const addTeacher = () => {
    if (
      data.name === '' ||
      data.subject === '' ||
      data.designation === '' ||
      data.email === '' || 
      data.contact === ''
    ) {
      Alert.alert('Fields Cannot be Empty.');
      return;
    }

    if(!isEmailValid(data.email.trim())){
      Alert.alert('Please Enter valid Email.');
      return;
    }
    

    const {name, subject, designation, email, address,contact} = data;
    const newTeacher: TeacherList = {
      name,
      subject,
      email,
      designation,
      address,
      contact
    };
    updateteacher([...teacher,newTeacher]);
    setData({
      name: '',
      email: '',
      designation: '',
      subject: '',
      address: '',
      contact:''
    });
    onClose();
  };

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
            <Icon name="close" size={responsiveFontSize(3)} color="grey" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Add Teacher</Text>
          <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
              <Text style={styles.label}>Name:</Text>
              <TextInput
                placeholder="Enter Name"
                value={data.name}
                onChangeText={text => setData({...data, name: text})}
                style={styles.input}
                placeholderTextColor={'grey'}
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.label}>Designation:</Text>
              <TextInput
                placeholder="Enter Designation"
                value={data.designation}
                onChangeText={text => setData({...data, designation: text})}
                style={styles.input}
                placeholderTextColor={'grey'}
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.label}>Subject:</Text>
              <TextInput
                placeholder="Enter Subject"
                value={data.subject}
                onChangeText={text => setData({...data, subject: text})}
                style={styles.input}
                placeholderTextColor={'grey'}
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.label}>Email:</Text>
              <TextInput
                placeholder="Enter Email"
                value={data.email}
                onChangeText={text => setData({...data, email: text})}
                style={styles.input}
                placeholderTextColor={'grey'}
                keyboardType="email-address"
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.label}>Address:</Text>
              <TextInput
                placeholder="Enter Address"
                value={data.address}
                onChangeText={text => setData({...data, address: text})}
                style={styles.input}
                placeholderTextColor={'grey'}
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.label}>Contact:</Text>
              <TextInput
                placeholder="Enter Contact No."
                value={data.contact}
                onChangeText={text => setData({...data, contact: text})}
                style={styles.input}
                placeholderTextColor={'grey'}
                maxLength={10}
                keyboardType='numeric'
              />
            </View>
          </View>
          <TouchableOpacity onPress={addTeacher} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add</Text>
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
    borderRadius: 20,
    width: '90%',
  },
  modalTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    marginBottom: responsiveHeight(2),
    color: '#404040',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: responsiveHeight(2),
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(1),
  },
  label: {
    width: responsiveWidth(25),
    fontWeight: 'bold',
    marginRight: responsiveWidth(2),
    color: 'black',
  },
  input: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 5,
    padding: responsiveHeight(1),
    color: 'black',
  },
  addButton: {
    backgroundColor: '#404040',
    padding: responsiveHeight(1),
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: responsiveHeight(1),
    right: responsiveWidth(2),
  },
});

export default TeacherList;
