import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectSchoolById, updateSchoolById } from '../../Reducer/slices/SchoolSlice'
import Header from '../../Component/Common_Component/Header'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import CustomTextInput from '../../Component/Common_Component/CustomTextInput'
import Loader from '../../Component/Common_Component/Loader'
import { fetchToken } from '../../Helpers/fetchDetails'
import api from '../../API/api'
import CutomWarning from '../../Component/Common_Component/CutomWarning'
import { Toast } from 'react-native-toast-message/lib/src/Toast'

const EditSchool = ({ route, navigation }) => {
    const { Id } = route.params;
    const selectedSchool = useSelector((state) => selectSchoolById(state, Id));
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [WarmodalVisible, setWarmodalVisible] = React.useState<boolean>(false);
    const [modalMessage, setModalMessage] = React.useState<string>('');
    const [formData, setFormData] = React.useState({
        name: selectedSchool?.name || '',
        strength: selectedSchool?.strength?.toString() || '',
        email: selectedSchool?.email || '',
        Person: selectedSchool?.person || '', // Make sure to use 'person' instead of 'Person'
        contact_no: selectedSchool?.contact_no?.toString() || '',
        city: selectedSchool?.city || '',
        state: selectedSchool?.state || '',
        country: selectedSchool?.country || '',
    });
    const { name, strength, contact_no, city, state, country, email, Person } = formData;

    const dispatch = useDispatch();
    const updateSchool = async () => {
        try {
            if (name === '') {
                setModalMessage('School Name is required');
                setWarmodalVisible(true);
                return
            }

            if (strength === '') {
                setModalMessage('strength is required');
                setWarmodalVisible(true);
                return
            }


            if (email === '') {
                setModalMessage('Email is required');
                setWarmodalVisible(true);
                return
            }

            if (Person === '') {
                setModalMessage('Contact Person is required');
                setWarmodalVisible(true);
                return
            }

            if (contact_no === '') {
                setModalMessage('Contact Number is required');
                setWarmodalVisible(true);
                return
            }

            if (city === '') {
                setModalMessage('City is required');
                setWarmodalVisible(true);
                return
            }

            if (state === '') {
                setModalMessage('State is required');
                setWarmodalVisible(true);
                return
            }
            if (country === '') {
                setModalMessage('Country is required');
                setWarmodalVisible(true);
                return
            }
            const UpdateSchool = {

                name: name,
                strength: parseInt(strength),
                contact_no: parseInt(contact_no),
                city: city,
                state: state,
                country: country,
                email: email,
                person: Person


            }
            setIsLoading(true)

            const token = await fetchToken();
            if (token) {
                const respone = await api.Update_School(Id, token, UpdateSchool)
                if (respone.data.status === true) {
              
                    Toast.show({
                        type: "success",
                        text1: respone.data.message,
                        autoHide: false,
                        visibilityTime: 2000,
                        onShow: () => {
                            setTimeout(() => {
                                Toast.hide();
                                setIsLoading(false)
                                dispatch(updateSchoolById({ ...selectedSchool, ...UpdateSchool }));
                                navigation.goBack();
                            }, 2000); // Wait for 1 second before navigating
                        },
                    });
                }
                console.log(respone.data)
            }
        } catch (error) {
            console.log("edit shop error", error)
        }

    }

    const closeModal = () => {
        setWarmodalVisible(false);
    };
    return (
        <>

            <View style={styles.container}>
                <Header
                    title={'Edit School'}
                    bg={'blue'}
                    leftIcon={'arrowleft'}
                    onLeftPress={() => navigation.goBack()}
                />


                <View style={styles.maincontainer}>
                    <ScrollView>
                        <View>
                            <CustomTextInput
                                title='School Name'
                                value={name}
                                placeholder='Enter School Name'
                                onChangeText={(name) => setFormData({ ...formData, name })}
                            />

                            <CustomTextInput
                                title='Strength'
                                value={strength}
                                keyboardType='phone-pad'
                                placeholder='Enter Strength'
                                onChangeText={(strength) => setFormData({ ...formData, strength })}
                            />

                            <CustomTextInput
                                title='Email'
                                value={email}
                                placeholder='Enter Email'
                                onChangeText={(email) => setFormData({ ...formData, email })}
                            />

                            <CustomTextInput
                                title='Contact Person'
                                value={Person}
                                placeholder='Enter Contact Person'
                                onChangeText={(Person) => setFormData({ ...formData, Person })}
                            />




                            <CustomTextInput
                                title='Contact No'
                                value={contact_no}
                                keyboardType='phone-pad'
                                placeholder='Enter Contact No'
                                onChangeText={(contact_no) => setFormData({ ...formData, contact_no })}
                                maxLength={10}
                            />



                            <CustomTextInput
                                title='City'
                                value={city}
                                placeholder='Enter City'
                                onChangeText={(city) => setFormData({ ...formData, city })}
                            />


                            <CustomTextInput
                                title='State'
                                value={state}
                                placeholder='Enter State'
                                onChangeText={(state) => setFormData({ ...formData, state })}
                            />


                            <CustomTextInput
                                title='Country'
                                value={country}
                                placeholder='Enter Country'
                                onChangeText={(country) => setFormData({ ...formData, country })}
                            />

                        </View>

                    </ScrollView>

                    <View>

                        <TouchableOpacity
                            onPress={updateSchool}
                            style={styles.loginBtn}>
                            <Text style={styles.loginText}>Update School</Text>
                        </TouchableOpacity>
                    </View>

                </View>


            </View>
            <CutomWarning
                visible={WarmodalVisible}
                message={modalMessage}
                closeModal={closeModal}
            />
            {
                isLoading ? (
                    <Loader Loading={isLoading} />
                ) : null
            }

        </>
    )
}

export default EditSchool

const styles = StyleSheet.create({
    container: {
        flex: 1,

        // marginVertical: 19
    },
    maincontainer: {
        flex: 1,
        backgroundColor: "white",

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
        width: responsiveWidth(85),
        marginRight: 20,
        position: "relative",

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
        fontSize: responsiveFontSize(2), color: "#1A1A18"
    },

    loginBtn: {
        width: responsiveWidth(92),
        backgroundColor: "#4D2DB7",
        borderRadius: responsiveHeight(1),
        height: responsiveHeight(7),
        alignItems: "center",
        justifyContent: "center",
        // marginTop:responsiveHeight(3),
        marginBottom: responsiveHeight(1.4),
        marginVertical: responsiveHeight(1.5),
        marginHorizontal: responsiveHeight(1.5),
    },
    loginText: {
        color: "#FFF",
        fontSize: responsiveFontSize(2.3),
        fontWeight: "bold",
    },
});