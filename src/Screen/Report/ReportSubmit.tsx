import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import Bootom_Sheet_Dropdown from '../../Component/Common_Component/Bootom_Sheet_Dropdown';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { StyleSheet } from 'react-native';
import CustomTextInput from '../../Component/Common_Component/CustomTextInput';
import Header from '../../Component/Common_Component/Header';
import { fetccUserId, fetchToken } from '../../Helpers/fetchDetails';
import api from '../../API/api';
import CutomWarning from '../../Component/Common_Component/CutomWarning';
import Loader from '../../Component/Common_Component/Loader';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

const ReportSubmit = ({ navigation }) => {
    const [School, SetSchool] = React.useState([]);
    const [WarmodalVisible, setWarmodalVisible] = React.useState<boolean>(false);
    const [modalMessage, setModalMessage] = React.useState<string>('');
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    const [SelectedData, SetSelectedData] = React.useState({
        vendor_id: null,
        city: '',
        state: '',
        country: '',
        contact_no: '',
        strength: '',
        email: '',
        person: '',
        remark: '',
        SchoolItem:[],

    })

    useEffect(() => {
        get_school()

    }, [])

    const { vendor_id, strength, contact_no, city, state, country, email, person, remark,SchoolItem } = SelectedData;
    const get_school = async () => {
        const token = await fetchToken();
        if (token) {
            try {
                const respone = await api.get_school(token)
                if (respone.data.status === true) {
                    SetSchool(respone.data.data)
                }
                console.log(respone)

            } catch (error) {
                console.log("get school error:", error)
            }
        }
    }

    const submitReport = async () => {
        if (vendor_id === null) {
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

        if (person === '') {
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
        if (remark === undefined) {
            setModalMessage('Remark is required');
            setWarmodalVisible(true);
            return
        }
        const token = await fetchToken();
        const user_Id = await fetccUserId();
        if (token && user_Id) {

            
            setIsLoading(true)
            const user_Report = {

                vendor_id: vendor_id,
                user_id: user_Id,
                strength: parseInt(strength),
                contact_no: parseInt(contact_no),
                city: city,
                state: state,
                country: country,
                email: email,
                person: person,
                remark: remark

            }
            console.log(user_Report)
            try{

                const response=await api.submit_Report(token,user_Report)
                if(response.data.status===true){
                    setIsLoading(false)
                    Toast.show({
                        type: "success",
                        text1: response.data.message,
                        autoHide: false,
                        visibilityTime: 2000,
                        onShow: () => {
                            setTimeout(() => {
                                Toast.hide();

                                navigation.navigate("PunchScreen")
                            }, 2000); // Wait for 1 second before navigating
                        },
                    });

                }
            }catch(error){
                console.log("submit report error:",error)
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
                    title={'Submit Report'}
                    bg={'blue'}
                    leftIcon={'arrowleft'}
                    onLeftPress={() => navigation.goBack()}
                />

                <View style={styles.maincontainer}>
                    <ScrollView>
                        <View>


                            <Bootom_Sheet_Dropdown
                                title="School name"
                                data={School.map((School) => ({ label: School.name, value: School.id, allData: School }))}
                                placeholder="Select School Name"
                                selectedItem={SchoolItem}
                                onSelect={(item) => {
                                    SetSelectedData(item.allData), SetSelectedData((prevData) => ({
                                        ...prevData,
                                        vendor_id: item.allData.id,
                                        SchoolItem:item
                                    }))
                                }}
                            />

                            <CustomTextInput
                                title='Strength'
                                value={strength.toString()}
                                keyboardType='phone-pad'
                                placeholder='Enter Strength'
                                onChangeText={(strength) => SetSelectedData({ ...SelectedData, strength })}
                            />

                            <CustomTextInput
                                title='Email'
                                value={email}
                                placeholder='Enter Email'
                                onChangeText={(email) => SetSelectedData({ ...SelectedData, email })}
                            />

                            <CustomTextInput
                                title='Contact Person'
                                value={person}
                                placeholder='Enter Contact Person'
                                onChangeText={(person) => SetSelectedData({ ...SelectedData, person })}
                            />

                            <CustomTextInput
                                title='Contact No'
                                value={contact_no.toString()}
                                keyboardType='phone-pad'
                                placeholder='Enter Contact No'
                                onChangeText={(contact_no) => SetSelectedData({ ...SelectedData, contact_no })}
                            />



                            <CustomTextInput
                                title='City'
                                value={city}
                                placeholder='Enter City'
                                onChangeText={(city) => SetSelectedData({ ...SelectedData, city })}
                            />


                            <CustomTextInput
                                title='State'
                                value={state}
                                placeholder='Enter State'
                                onChangeText={(state) => SetSelectedData({ ...SelectedData, state })}
                            />


                            <CustomTextInput
                                title='Country'
                                value={country}
                                placeholder='Enter Country'
                                onChangeText={(country) => SetSelectedData({ ...SelectedData, country })}
                            />

                            <View style={styles.inputView}>
                                <Text style={styles.textinputlabel}>Remark</Text>
                                <TextInput
                                    style={styles.inputText}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    multiline
                                    numberOfLines={4}
                                    value={remark}
                                    placeholder="Enter Remark"
                                    onChangeText={(remark) => SetSelectedData({ ...SelectedData, remark })}
                                />
                            </View>


                        </View>

                    </ScrollView>

                    <View>
                        <TouchableOpacity style={styles.loginBtn} onPress={submitReport}>
                            <Text style={{ color: "white", fontSize: 18 }}>Submit Report</Text>
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
    );
};

export default ReportSubmit;

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    maincontainer: {
        flex: 1,
        backgroundColor: "white",

    },
    inputText: {
        width: responsiveWidth(95),


        marginVertical: responsiveHeight(0.5),
        marginHorizontal: responsiveHeight(1.5),
        backgroundColor: 'white',
        borderRadius: responsiveHeight(1.5),
        padding: responsiveHeight(1.5),

        elevation: responsiveHeight(0.2),

    },
    textinputlabel: {
        marginLeft: responsiveHeight(2.2), fontSize: responsiveFontSize(1.9), color: "#1A1A18"
    },
    inputView: {
        marginTop: responsiveHeight(1.7),
        width: responsiveWidth(95),
        marginRight: responsiveHeight(2),

        position: "relative",

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
});
