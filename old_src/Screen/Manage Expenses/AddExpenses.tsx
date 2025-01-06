import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import React from 'react';
import Header from '../../Component/Common_Component/Header';
import CustomTextInput from '../../Component/Common_Component/CustomTextInput';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { fetchToken } from '../../Helpers/fetchDetails';
import DatePicker from 'react-native-date-picker';
import api from '../../API/api';
import { TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomImageModal from '../../Component/Common_Component/CustomImageModal';
import CutomWarning from '../../Component/Common_Component/CutomWarning';
import CustomDropdown from '../../Component/Common_Component/CustomDropdown';
import Toast from 'react-native-toast-message';
import Loader from '../../Component/Common_Component/Loader';

const AddExpenses: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [open, setOpen] = React.useState(false);
    const [modalMessage, setModalMessage] = React.useState<string>('');
    const [WarmodalVisible, setWarmodalVisible] = React.useState<boolean>(false);
    const [isImageModalVisible, setImageModalVisible] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [ExpensesformData, setFormData] = React.useState({
        name: '',
        date: new Date().toISOString().split('T')[0], // Store date as string
        Category: '',
        attachment: null, // Initialized to null
    });

    const CategoryList = [
        {
            label: 'Food', value: 'Food'
        },
        { label: 'Travel', value: 'Travel' },
        { label: 'Miscellaneous', value: 'Miscellaneous' },
        { label: 'Unknown', value: 'Unknown' },

    ];
    const { name, date, Category, attachment } = ExpensesformData;

    const handleExpenses = async () => {
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

        const AddExpenses = new FormData();
        AddExpenses.append('name', name);
        AddExpenses.append('date', date);
        AddExpenses.append('category', Category);

        // Check if attachment exists and add it to the form data
        if (attachment) {
            AddExpenses.append('attachment', {
                uri: attachment.path,
                name: attachment.filename || `attachment_${Date.now()}`,
                type: attachment.mime,
            });
        }

        if (token) {
            try {
                setIsLoading(true);
                const response = await api.add_Expenses(token, AddExpenses);
                console.log(response.data);
                if(response.data.status===true){
                    Toast.show({
                        type: 'success',
                        text1: response.data.message,
                        autoHide: false,
                        visibilityTime: 2000,
                        onShow: () => {
                          setTimeout(() => {
                            Toast.hide();
                            setIsLoading(false);
                            navigation.navigate('Manage Expenses', { newExpenses: response.data.data });
                          }, 2000);
                        },
                      });
                }
            } catch (error) {
                console.error('Add expenses error:', error);
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
        setFormData({ ...ExpensesformData, attachment: item });
        handleImageModalVisible();
    };

    return (
        <>
            <View style={styles.container}>
                <Header
                    title={'Add Expenses'}
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
                                    placeholder="Select Category"
                                    onSelect={val => {
                                        setFormData({ ...ExpensesformData, Category:val.value })
                                    }}
                                />
                            </View>
                            <TouchableWithoutFeedback onPress={() => setOpen(true)}>
                                <View>
                                    <CustomTextInput
                                        title="Date"
                                        value={date} // Display the selected date
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
                                        source={{ uri: attachment.path }}
                                        style={styles.imagePreview}
                                    />
                                    <Text>{attachment.mime}</Text>
                                </View>
                            )}

                            <TouchableOpacity
                                onPress={handleExpenses}
                                style={[styles.loginBtn, { marginVertical: 10, marginHorizontal: 10 }]}>
                                <Text style={styles.loginText}>Add Expenses</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                    <CustomImageModal
                        togglevisible={isImageModalVisible}
                        onclose={handleImageModalVisible}
                        multipleImage={true}
                        handelImage={(item) => handelImage(item)}
                    />
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
                date={new Date(date)} // Convert date string back to Date object
                mode="date"
                minimumDate={new Date()} // Restrict to future dates
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

export default AddExpenses;


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
