import React, {useEffect, useState} from 'react';
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
import CustomDropdown from '../../Component/Common_Component/CustomDropdown';

interface Teacher {
  name: string;
  contact: string;
}

interface LocationProp {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  list: any[];
  setid: (val:any)=>void;
}

const SendLocation: React.FC<LocationProp> = ({
  isVisible,
  onClose,
  onSubmit,
  list,
  setid,
}) => {

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
          <Text style={styles.modalTitle}>Send Location</Text>

          <View >
            <Text
              style={{
                fontSize: responsiveFontSize(2),
                color: 'black',
                fontWeight: '500',
                marginLeft: responsiveWidth(3),
              }}>
              Select School
            </Text>
            <CustomDropdown
              data={list?.map(ele => ({
                label: ele.name,
                value: ele.id,
              }))}
              placeholder="Select School"
              onSelect={val => {
                setid(val.value);
              }}
              style={{
                width: responsiveWidth(70),
                margin: 0,
                alignSelf: 'center',
              }}
            />
          </View>

          <TouchableOpacity onPress={onSubmit} style={styles.addButton}>
            <Text style={styles.addButtonText}>Send Location</Text>
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
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: responsiveHeight(1),
    color: 'black',
    marginRight: responsiveWidth(2),
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

export default SendLocation;
