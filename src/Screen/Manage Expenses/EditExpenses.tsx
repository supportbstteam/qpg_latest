import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../Component/Common_Component/Header';
import CustomTextInput from '../../Component/Common_Component/CustomTextInput';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import DatePicker from 'react-native-date-picker';
import api, { Image_Base_Url } from '../../API/api';
import { TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomImageModal from '../../Component/Common_Component/CustomImageModal';
import CutomWarning from '../../Component/Common_Component/CutomWarning';
import CustomDropdown from '../../Component/Common_Component/CustomDropdown';
import Toast from 'react-native-toast-message';
import Loader from '../../Component/Common_Component/Loader';
import { useRoute } from '@react-navigation/native';
import { fetchToken } from '../../Helpers/fetchDetails';

const EditExpenses: React.FC<{ navigation: any }> = ({ navigation }) => {
  const route = useRoute();
  const { ExpensesItem } = route.params;

  const [open, setOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [WarmodalVisible, setWarmodalVisible] = useState<boolean>(false);
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [ExpensesformData, setFormData] = useState({
    id: ExpensesItem.id,
    name: ExpensesItem.name,
    date: ExpensesItem.date,
    Category: ExpensesItem.category,
    attachment: ExpensesItem.attachment ? { uri: `${Image_Base_Url}/storage/${ExpensesItem.attachment}` } : null,
  });

  const CategoryList = [
    { label: 'Food', value: 'Food' },
    { label: 'Travel', value: 'Travel' },
    { label: 'Miscellaneous', value: 'Miscellaneous' },
    { label: 'Unknown', value: 'Unknown' },
  ];

  const { id, name, date, Category, attachment } = ExpensesformData;

  useEffect(() => {
    console.log(ExpensesItem);
  }, [ExpensesItem]);

  const handleEditExpenses = async () => {
    if (name === '') {
      setModalMessage('Name is required');
      setWarmodalVisible(true);
      return;
    }
    if (Category === '') {
      setModalMessage('Category is required');
      setWarmodalVisible(true);
      return;
    }

    const token = await fetchToken();

    const EditExpenses = new FormData();
    EditExpenses.append('name', name);
    EditExpenses.append('date', date);
    EditExpenses.append('category', Category);

    // Check if the attachment is new and add it to the form data
    if (attachment && attachment.uri !== ExpensesItem.attachment) {
      EditExpenses.append('attachment', {
        uri: attachment.uri,
        name: `attachment_${Date.now()}.jpg`,
        type: 'image/jpeg', // or other type if necessary
      });
    }

    if (token) {
      setIsLoading(true);
      try {
        const response = await api.update_Expenses_data(id, token, EditExpenses);
        if (response.data.status === true) {
          Toast.show({
            type: 'success',
            text1: response.data.message,
            autoHide: false,
            visibilityTime: 2000,
            onShow: () => {
              setTimeout(() => {
                Toast.hide();
                setIsLoading(false);
                navigation.navigate('Manage Expenses', { updatedExpenses: response.data.data });
              }, 2000);
            },
          });
        }
      } catch (error) {
        setIsLoading(false);
        console.error('Edit expenses error:', error);
      }
    } else {
      console.error('Token not found');
    }
  };

  const handleImageModalVisible = () => {
    setImageModalVisible(!isImageModalVisible);
  };

  const closeModal = () => {
    setWarmodalVisible(false);
  };

  const handelImage = async (item) => {
    const updatedAttachment = {
      uri: item.path, // Use the path as the URI
      name: `attachment_${Date.now()}`, // Generate a name for the file
      type: item.mime, // Use the mime type provided
    };
  
    setFormData({ ...ExpensesformData, attachment: updatedAttachment });
    handleImageModalVisible();
  };
  

  return (
    <>
      <View style={styles.container}>
        <Header
          title={'Edit Expenses'}
          bg={'blue'}
          leftIcon={'arrow-back'}
          onLeftPress={() => navigation.goBack()}
        />

        <View style={styles.maincontainer}>
          <ScrollView keyboardShouldPersistTaps='handled'>
            <View>
              <CustomTextInput
                title="Name"
                value={name}
                placeholder="Enter Name"
                onChangeText={(name) => setFormData({ ...ExpensesformData, name })}
              />

              <View style={styles.inputView}>
                <Text style={styles.textinputlabel}>Category</Text>
                <CustomDropdown
                  data={CategoryList?.map(ele => ({
                    label: ele.label,
                    value: ele.value,
                  }))}
                  placeholder={Category === '' ? 'Select Category' : Category}
                  onSelect={val => {
                    setFormData({ ...ExpensesformData, Category: val.value });
                  }}
                />
              </View>

              <TouchableWithoutFeedback onPress={() => setOpen(true)}>
                <View>
                  <CustomTextInput
                    title="Date"
                    value={date}
                    placeholder="Select Date"
                    editable={false}
                  />
                  <Icon
                    name={'date-range'}
                    size={30}
                    color={'black'}
                    style={{ position: 'absolute', right: 20, top: 55 }}
                  />
                </View>
              </TouchableWithoutFeedback>

              <TouchableOpacity onPress={handleImageModalVisible} style={styles.ImageContainer}>
                <Text style={{ fontSize: 17, color: "#333" }}>Attachment</Text>
                <Icon color={"black"} name="camera" size={responsiveHeight(4)} />
              </TouchableOpacity>
              {attachment && (
                <View style={styles.imagePreviewContainer}>
                  <Image
                    source={{ uri: attachment.uri }}
                    style={styles.imagePreview}
                  />
                  <Text>{attachment.mime || 'image/jpeg'}</Text>
                </View>
              )}

              <TouchableOpacity
                onPress={handleEditExpenses}
                style={[styles.loginBtn, { marginVertical: 10, marginHorizontal: 10 }]}>
                <Text style={styles.loginText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          {isImageModalVisible && (
            <CustomImageModal
              togglevisible={isImageModalVisible}
              onclose={handleImageModalVisible}
              multipleImage={false}
              handelImage={(item) => handelImage(item)}
            />
          )}
        </View>
      </View>

      <CutomWarning
        visible={WarmodalVisible}
        message={modalMessage}
        closeModal={closeModal}
      />

      <DatePicker
        title={'Select Date'}
        modal
        open={open}
        date={new Date(date)}
        mode="date"
        minimumDate={new Date()}
        onConfirm={(selectedDate) => {
          setOpen(false);
          const formattedDate = selectedDate.toISOString().split('T')[0];
          setFormData((prevData) => ({
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
export default EditExpenses;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  maincontainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  loginText: {
    color: '#FFF',
    fontSize: responsiveFontSize(2.3),
    fontWeight: 'bold',
  },
  loginBtn: {
    backgroundColor: '#4D2DB7',
    borderRadius: responsiveHeight(1),
    height: responsiveHeight(7),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveHeight(1.4),
  },
  ImageContainer: {
    marginVertical: responsiveHeight(1.5),
    marginHorizontal: responsiveHeight(1.5),
    borderRadius: responsiveHeight(1.5),
    padding: responsiveHeight(1.3),
    paddingLeft: responsiveHeight(1.7),
    borderWidth: 1,
    borderColor: "#797979",
    flexDirection: "row",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  imagePreviewContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  imagePreview: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  inputView: {
    marginTop: responsiveHeight(1.7),
    width: responsiveWidth(95),
    marginRight: responsiveHeight(2),
    position: 'relative',
  },
  textinputlabel: {
    marginLeft: responsiveHeight(2.2),
    fontSize: responsiveFontSize(1.9),
    color: '#1A1A18',
  },
});
