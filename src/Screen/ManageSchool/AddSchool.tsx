import { View, Text, Modal, Alert, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import React from 'react'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import CutomWarning from '../../Component/Common_Component/CutomWarning'
import api from '../../API/api'
import { fetccUserId, fetchToken } from '../../Helpers/fetchDetails'
import Loader from '../../Component/Common_Component/Loader'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import CustomDropdown from '../../Component/Common_Component/CustomDropdown';
import Header from '../../Component/Common_Component/Header'
import CustomTextInput from '../../Component/Common_Component/CustomTextInput'
import { useDispatch } from 'react-redux'
import { addSchool } from '../../Reducer/slices/SchoolSlice'


interface report {
    navigation: any
}

const AddSchool: React.FC<report> = ({ navigation
}) => {

    const [WarmodalVisible, setWarmodalVisible] = React.useState<boolean>(false);
    const [modalMessage, setModalMessage] = React.useState<string>('');
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [Count, SetCount] = React.useState(1);
    const isEmailValid = (email: string): boolean => {
        // Email validation regex pattern
        const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return pattern.test(email);
    };
    const dispatch = useDispatch();

    const [formData, setFormData] = React.useState({
        name: '',
        city: '',
        state: '',
        country: '',
        contact_no: '',
        strength: '',
        email: '',
        Person: ''
    });

    const { name, strength, contact_no, city, state, country, email, Person } = formData;

    const Submit = async () => {

        console.log("submit click")

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
        } else if (!isEmailValid(email)) {
            setModalMessage('Invalid email format');
            setWarmodalVisible(true);
            return;
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
        setIsLoading(true)
        const token = await fetchToken();
        const user_Id = await fetccUserId();
        if (user_Id && token) {

            const user_Report = {

                name: name,
                strength: parseInt(strength),
                contact_no: parseInt(contact_no),
                city: city,
                state: state,
                country: country,
                email: email,
                person: Person


            }

            console.log("user respor", user_Report)

            try {

                const response = await api.user_Report(token, user_Report);
                console.log("here report form", response)
                if (response.data.status === true) {
                    dispatch(addSchool(response.data.data));
                 
                    Toast.show({
                        type: "success",
                        text1: response.data.message,
                        autoHide: false,
                        visibilityTime: 2000,
                        onShow: () => {
                            setTimeout(() => {
                                Toast.hide();
                                setIsLoading(false)
                               navigation.navigate("Manage School")
                            }, 2000); 
                        },
                    });

                 


                }


            } catch (error) {
                setIsLoading(false)
                console.log("Report Error:", error)
            }

        }

    }


    const AddMore = async () => {

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
        } else if (!isEmailValid(email)) {
            setModalMessage('Invalid email format');
            setWarmodalVisible(true);
            return;
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
        setIsLoading(true)
        const token = await fetchToken();
        const user_Id = await fetccUserId();
        if (user_Id && token) {

            const user_Report = {

                name: name,
                strength: parseInt(strength),
                contact_no: parseInt(contact_no),
                city: city,
                state: state,
                country: country,
                email: email,
                person: Person


            }

            console.log("user respor", user_Report)

            try {

                const response = await api.user_Report(token, user_Report);
                console.log("here report form", response)
                if (response.data.status === true) {
                    dispatch(addSchool(response.data.data));
                 
                    Toast.show({
                        type: "success",
                        text1: response.data.message,
                        autoHide: false,
                        visibilityTime: 2000,
                        onShow: () => {
                            setTimeout(() => {
                                Toast.hide();
                                setIsLoading(false)
                                setFormData({
                                    name: '',
                                    city: '',
                                    state: '',
                                    country: '',
                                    contact_no: '',
                                    strength: '',
                                    email: '',
                                    Person: ''
            
                                });
                            }, 2000); 
                        },
                    });

                 
                    SetCount(Count + 1)

                }


            } catch (error) {
                setIsLoading(false)
                console.log("Report Error:", error)
            }

        }


    }


    const closeModal = () => {
        setWarmodalVisible(false);
    };
    return (
        <>

            <View style={styles.container}>
                <Header
                    title={'Add School'}
                    bg={'blue'}
                    leftIcon={'arrowleft'}
                    onLeftPress={() => navigation.goBack()}
                />

                <View style={styles.maincontainer}>
                    <ScrollView>
                        <View>
                            <View style={{ alignItems: "center", marginTop: 10 }}>
                                <Text style={{ fontSize: responsiveFontSize(3), marginBottom: responsiveHeight(3) }}>Add School Detail   {Count}</Text>

                            </View>
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
                                onChangeText={(contact_no) => {
                                    const numericValue = contact_no.replace(/[^0-9]/g, '');
                                    setFormData({ ...formData, contact_no:numericValue })
                                }}
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
                    <View style={{ flexDirection: "row", justifyContent: "center" }}>

                        <View >

                            <TouchableOpacity
                                onPress={Submit}
                                style={[styles.loginBtn, { marginRight: 10 }]}
                            >
                                <Text style={styles.loginText}>Submit Detail</Text>
                            </TouchableOpacity>
                        </View>


                        <View >
                            <TouchableOpacity
                                onPress={AddMore}
                                style={styles.loginBtn}
                            >
                                <Text style={styles.loginText}>Add More</Text>
                            </TouchableOpacity>
                        </View>

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

export default AddSchool

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
        width: responsiveWidth(40),
        backgroundColor: "#4D2DB7",
        borderRadius: responsiveHeight(1),
        height: responsiveHeight(7),
        alignItems: "center",
        justifyContent: "center",
        marginTop: responsiveHeight(3),
        marginBottom: responsiveHeight(1.4),
    },
    loginText: {
        color: "#FFF",
        fontSize: responsiveFontSize(2.3),
        fontWeight: "bold",
    },
});