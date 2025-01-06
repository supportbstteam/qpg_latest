import React, {useState} from 'react';
import {
  Alert,
  TextInput,
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialIcons';
interface Teacher {
  name: string;
  contact: string;
}

interface AddTeacherModalProps {
  isVisible: boolean;
  onClose: () => void;
  teacherList: Teacher[];
  updateTeacherList: (updatedList: Teacher[]) => void;
}

const AddTeacherModal: React.FC<AddTeacherModalProps> = ({
  isVisible,
  onClose,
  teacherList,
  updateTeacherList,
}) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');

  const addTeacher = () => {
    if (name === '' || contact === '') {
      Alert.alert('Fields Cannot be Empty.');
      return;
    }
    //filed validation for minimum contact no should be 10 digit
    if (contact.length < 10) {
      Alert.alert('Contact No is Invalid!');
      return;
    }

    const newTeacher: Teacher = {
      name,
      contact,
    };
    updateTeacherList([...teacherList, newTeacher]);
    setName('');
    setContact('');
  };


  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalBackground} onPress={onClose} activeOpacity={1}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={responsiveFontSize(3)} color="grey" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Add Teacher</Text>
          <FlatList
            data={teacherList}
            renderItem={({item, index}) => (
              <View style={styles.teacherItem}>
                <Text style={styles.index}>{index + 1}.</Text>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.contact}>- {item.contact}</Text>
              </View>
            )}
            keyExtractor={(_, index) => index.toString()}
            style={styles.flatList}
          />
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholderTextColor={'grey'}
            />
            <TextInput
              placeholder="Contact No"
              value={contact}
              onChangeText={setContact}
              style={styles.input}
              placeholderTextColor={'grey'}
              keyboardType="numeric"
              maxLength={10}
            />
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
  teacherItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(1),
  },
  flatList: {
    marginBottom: responsiveHeight(1),
  },
  inputContainer: {
    // flexDirection: 'row',
    // marginVertical: responsiveHeight(1),
  },
  input: {
    // flex: 1,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 5,
    padding: responsiveHeight(1),
    color: 'black',
    marginRight: responsiveWidth(2),
    marginVertical: responsiveHeight(1),
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
    // textTransform: 'uppercase',
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
    right: responsiveWidth(2),
    // padding: responsiveHeight(1),
    // borderRadius: 50,
    // borderWidth: 1,
    // borderColor: 'gray',
    // elevation: 1,
  },
});

export default AddTeacherModal;
