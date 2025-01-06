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
  ScrollView,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialIcons';
interface ConcernPerson {
  name: string;
  number: string;
  email: string;
  designation: string;
}

interface ConcernPersonModalProps {
  isVisible: boolean;
  onClose: () => void;
  concernList: ConcernPerson[];
  updateconcernList: (updatedList: ConcernPerson[]) => void;
}

const ConcernPerson: React.FC<ConcernPersonModalProps> = ({
  isVisible,
  onClose,
  concernList,
  updateconcernList,
}) => {
  const [data, setData] = useState({
    name: '',
    designation: '',
    number: '',
    email: '',
  });

  const addconcern = () => {
    if (
      data.name === '' ||
      data.number === '' ||
      data.designation === '' ||
      data.email === ''
    ) {
      Alert.alert('Fields Cannot be Empty.');
      return;
    }
    //filed validation for minimum number no should be 10 digit
    if (data.number.length < 10) {
      Alert.alert('number No is Invalid!');
      return;
    }

    const {name, number, designation, email} = data;
    const newconcern: ConcernPerson = {
      name,
      number,
      email,
      designation,
    };
    updateconcernList([...concernList, newconcern]);
    setData({
      name: '',
      email: '',
      designation: '',
      number: '',
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
          <Text style={styles.modalTitle}>Add Concern Person</Text>
     
          {/* </ScrollView> */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Name"
              value={data.name}
              onChangeText={text => setData({...data, name: text})}
              style={styles.input}
              placeholderTextColor={'grey'}
            />
            <TextInput
              placeholder="Designation"
              value={data.designation}
              onChangeText={text => setData({...data, designation: text})}
              style={styles.input}
              placeholderTextColor={'grey'}
              keyboardType="default"
            />
            <TextInput
              placeholder="Contact No"
              value={data.number}
              onChangeText={text => setData({...data, number: text})}
              style={styles.input}
              placeholderTextColor={'grey'}
              keyboardType="numeric"
              maxLength={10}
            />
            <TextInput
              placeholder="Email Address"
              value={data.email}
              onChangeText={text => setData({...data, email: text})}
              style={styles.input}
              placeholderTextColor={'grey'}
              keyboardType="email-address"
            />
          </View>
          <TouchableOpacity onPress={addconcern} style={styles.addButton}>
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
  concernItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: responsiveWidth(2),
  },
  flatList: {
    marginBottom: responsiveHeight(1),
  },
  scrollViewContent: {
    flexGrow: 1, // Allow content to grow to fill the container width
  },
  field: {
    color: 'black',
    marginStart: 10,
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

export default ConcernPerson;
