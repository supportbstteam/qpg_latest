import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import Header from '../../Component/Common_Component/Header'
import { fetchToken } from '../../Helpers/fetchDetails'
import api from '../../API/api'
import Bootom_Sheet_Dropdown from '../../Component/Common_Component/Bootom_Sheet_Dropdown'
import Entypo from "react-native-vector-icons/Entypo"
import CustomTextInput from '../../Component/Common_Component/CustomTextInput'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import CutomWarning from '../../Component/Common_Component/CutomWarning'
import Loader from '../../Component/Common_Component/Loader'
import { useDispatch } from 'react-redux'
import { addBook, incrementTotalItemCount } from '../../Reducer/slices/OrderSlice'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler'
import { useFocusEffect } from '@react-navigation/native'





const AddOrder = ({ navigation }) => {

    const [School, SetSchool] = React.useState([]);
    const [classes, setClasses] = React.useState([]);
    const [subjects, setSubjects] = React.useState([]);

    const [WarmodalVisible, setWarmodalVisible] = React.useState<boolean>(false);
    const [modalMessage, setModalMessage] = React.useState<string>('');
    const [isLoading, setSchoolLoading] = React.useState<boolean>(true)
    const [SchoolLoading, setIsLoading] = React.useState<boolean>(false)
    const [SelectedData, SetSelectedData] = React.useState({
        SchoolItem: [],
        ClassItem: [],
        subjectItem: [],
        quantity: 1,

        discount: '',
        mrp: [],
    })


    const dispatch = useDispatch()
    const { SchoolItem, subjectItem, quantity, ClassItem, discount, mrp } = SelectedData



    useFocusEffect(
        React.useCallback(() => {
            console.log("get school")
            const get_school = async () => {
                const token = await fetchToken();
                if (token) {
                    try {
                        const respone = await api.get_school(token)
                        if (respone.data.status === true) {
                            setSchoolLoading(false)
                            SetSchool(respone.data.data)
                        }

                    } catch (error) {
                        console.log("get school error:", error)
                    }
                }
            }
            get_school()

        }, []) // Empty dependency array to run the effect only on mount and unmount
    );




    useEffect(() => {
        const getClasses = async () => {
            try {
                const token = await fetchToken()

                if (token) {
                    let response = await api.class(token);
                    setSchoolLoading(false)
                    // console.log("all clases", response.data)
                    setClasses(response.data);
                }

            } catch (error) {
                console.log(error);
            }
        };
        getClasses();
    }, [SchoolItem]);


    useEffect(() => {
        const getSubjects = async () => {
            try {
                const token = await fetchToken()
                console.log("classitem", ClassItem)
                if (token && ClassItem) {
                    let response = await api.subject(token, ClassItem.value);
                    setSchoolLoading(false)
                    console.log("subject response ", response.data)
                    setSubjects(response.data);
                }

            } catch (error) {
                console.log(error);
            }
        };
        getSubjects();
    }, [ClassItem]);


    useEffect(() => {
        const getPriceList = async () => {
            try {
                const token = await fetchToken()
                if (token && ClassItem && subjectItem) {
                    console.log(token)
                    console.log(ClassItem, subjectItem)
                    let response = await api.get_price(token, ClassItem.value, subjectItem.value);
                    if (response.data.status === true) {
                        SetSelectedData((prevData) => ({
                            ...prevData,
                            mrp: response.data.data,
                        }));

                    }
                    console.log("Price responce", response.data)

                }

            } catch (error) {
                console.log(error);
            }
        };
        getPriceList();

    }, [subjectItem, ClassItem])



    const handleAddBook = async () => {

        if (ClassItem.length === 0 || subjectItem.length === 0 || SchoolItem.length === 0) {
            setModalMessage('All Fields are required');
            setWarmodalVisible(true);
            return;
        }
        if (mrp === null) {
            setModalMessage('Price not exist');
            setWarmodalVisible(true);
            return;
        }
        setIsLoading(true)
        const BookData = {
            ClassItem: ClassItem,
            SubjecItem: subjectItem,
            SchoolItem: SchoolItem,
            quantity: quantity,
            mrp: mrp,
            discount: discount,
        };
        console.log(BookData)

        try {
            await dispatch(addBook(BookData));

            Toast.show({
                type: "success",
                text1: "Book added successfully",
                autoHide: false,
                visibilityTime: 1000,
                onShow: () => {
                    setTimeout(() => {
                        Toast.hide();
                        dispatch(incrementTotalItemCount());

                        SetSelectedData({
                            SchoolItem: [],
                            ClassItem: [],
                            subjectItem: [],
                            quantity: 1,
                            discount: '',
                            mrp: [],
                        });
                        setIsLoading(false)

                    }, 1000); // Wait for 1 second before navigating
                },
            });


        } catch (error) {
            console.error('Error adding book:', error);
            setModalMessage('Error adding book. Please try again.');
            setWarmodalVisible(true);
        }
    };


    const closeModal = () => {
        setWarmodalVisible(false);
    };

    const PriceTable = () => {
        const parsedQuantity = quantity;
        const parsedDiscount = parseInt(discount) || 0;

        const calculatedSubtotal = mrp ? mrp.mrp * parsedQuantity : 0;
        const discountedPrice = calculatedSubtotal - (calculatedSubtotal * parsedDiscount) / 100;
        const calculatedTotalPrice = discountedPrice;
        return (
            <>
                <View style={styles.table}>
                    <View style={styles.row}>
                        <View style={styles.cell}>
                            <Text style={{ color: "#787a7c", fontSize: 18, fontWeight: 'bold' }}>Price:  </Text>
                        </View>
                        <View style={[styles.cell, { alignItems: 'center' }]}>
                            <Text style={{ color: "#787a7c", fontSize: 18 }}>₹{mrp ? mrp.mrp : "No Price"}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.cell}>
                            <Text style={{ color: "#787a7c", fontSize: 18, fontWeight: 'bold' }}>Quantity:  </Text>
                        </View>
                        <View style={[styles.cell, { alignItems: 'center' }]}>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity style={styles.plus_minusContainer} onPress={() => {
                                    if (quantity > 1) {
                                        SetSelectedData((prevData) => ({
                                            ...prevData,
                                            quantity: prevData.quantity - 1
                                        }))
                                    }

                                }}>
                                    <Entypo name="minus" size={15} color={'white'} />
                                </TouchableOpacity>
                                {/* <Text style={{ fontSize: 18, color: 'black' }}> {parsedQuantity} </Text> */}
                                <TextInput
                                    maxLength={6}
                                    value={parsedQuantity.toString()}
                                    keyboardType="phone-pad"
                                    style={{
                                        minWidth: 20,
                                        fontSize: 20,
                                        width: 'auto',
                                        marginLeft: 5,
                                        color: "#000",
                                    }}
                                    onChangeText={(value) => {
                                        // Filter out non-numeric characters
                                        const numericValue = value.replace(/[^0-9]/g, '');

                                        // Update state with the numeric value
                                        SetSelectedData((prevData) => ({
                                            ...prevData,
                                            quantity: numericValue
                                        }));
                                    }}
                                />


                                <TouchableOpacity style={styles.plus_minusContainer} onPress={() => {
                                    SetSelectedData((prevData) => ({
                                        ...prevData,
                                        quantity: prevData.quantity + 1
                                    }))
                                }}>
                                    <Entypo name="plus" size={15} color={'white'} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                </View>

                <View style={{ marginTop: 30, marginVertical: 20, marginHorizontal: 20 }}>
                    <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                        <Text style={{ fontSize: 18, color: "#000" }}>SubTotal: </Text>
                        <Text style={{ fontSize: 18, color: "#000" }}>₹{calculatedSubtotal}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: 'flex-end', marginTop: 10 }}>
                        <Text style={{ fontSize: 18, color: "#000" }}>Discount: </Text>
                        <Text style={{ fontSize: 18, color: "#000" }}>{discount ? discount : 0}%</Text>
                    </View>

                    <View style={{ width: "100%", height: 1, backgroundColor: "#000", flexDirection: "row", justifyContent: 'flex-end', marginTop: 10 }}></View>
                    <View style={{ flexDirection: "row", justifyContent: 'flex-end', marginTop: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: "700", color: "green" }}>Total Price: </Text>
                        <Text style={{ fontSize: 18, fontWeight: "500", color: "green" }}>{'₹' + calculatedTotalPrice}</Text>
                    </View>

                </View>
            </>

        );
    };
    return (
        <>
            <View style={styles.Container}>
                <Header
                    title={"Add Order"}
                    bg={"blue"}
                    leftIcon={'arrowleft'}
                    ViewCardItem={() => navigation.navigate("ViewOrder")}
                    onLeftPress={() => navigation.goBack()}

                />
                <View style={styles.mainConainer}>

                    <ScrollView>
                        <View style={{ marginBottom: 20 }}>
                            <Bootom_Sheet_Dropdown
                                title="School name"
                                data={School ? School.map((School) => ({ label: School.name, value: School.id })) : []}
                                selectedItem={SchoolItem}
                                placeholder="Select School Name"
                                onSelect={(item) => {
                                    SetSelectedData((prevData) => ({
                                        ...prevData,
                                        SchoolItem: item
                                    }))
                                }}
                                isLoading={SchoolLoading}
                            />

                            <Bootom_Sheet_Dropdown
                                title="Class"
                                data={classes ? classes.map((ClassData) => ({ label: ClassData.ClassName, value: ClassData.ClassID })) : []}
                                selectedItem={ClassItem}
                                placeholder="Select Class"
                                onSelect={(item) => {
                                    SetSelectedData((prevData) => ({
                                        ...prevData,
                                        ClassItem: item
                                    }));
                                }}
                                isLoading={SchoolLoading}
                            />


                            <Bootom_Sheet_Dropdown
                                title="Subject"
                                data={subjects ? subjects.map((subject) => ({ label: subject.SubjectName, value: subject.SubjectID })) : []}
                                selectedItem={subjectItem}
                                placeholder="Select Subject"
                                onSelect={(item) => {
                                    SetSelectedData((prevData) => ({
                                        ...prevData,
                                        subjectItem: item
                                    }));
                                }}
                                isLoading={SchoolLoading}
                            />

                            <CustomTextInput
                                title='Discount (%)'
                                value={discount}
                                placeholder='Enter Discount '
                                keyboardType='phone-pad'
                                onChangeText={(discount) => SetSelectedData({ ...SelectedData, discount })}
                                maxLength={2}
                            />
                            {subjectItem.length !== 0 ? (
                                <View style={styles.calculateContainer}>
                                    <View style={{ flex: 1, marginTop: 20 }}>
                                        <Text style={{ fontSize: 18, marginBottom: 30 }} numberOfLines={1} >
                                            Book Name: {subjectItem ? subjectItem.label : "No Subject"}
                                        </Text>
                                    </View>

                                    <GestureHandlerRootView>
                                        {PriceTable()}
                                    </GestureHandlerRootView>



                                </View>
                            )
                                : null}

                        </View>
                    </ScrollView>


                    <View style={{ flexDirection: "row", justifyContent: "center" }}>



                        <TouchableOpacity
                            onPress={handleAddBook}

                            style={[styles.loginBtn, { marginRight: 10 }]}
                        >
                            <Text style={styles.loginText}>Add Book</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.navigate("ViewOrder")}
                            style={styles.loginBtn}
                        >
                            <Text style={styles.loginText}>View Book</Text>
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

export default AddOrder

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: "white"

    },
    mainConainer: {
        flex: 1,
        backgroundColor: "white"

    },

    calculateContainer: {
        width: responsiveWidth(95),

        marginVertical: responsiveHeight(1.5),
        marginHorizontal: responsiveHeight(1.5),
        backgroundColor: 'white',
        borderRadius: responsiveHeight(1.5),
        padding: responsiveHeight(2.2),
        elevation: responsiveHeight(0.2),
    },
    plus_minusContainer: {
        backgroundColor: 'blue',
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        marginHorizontal: 10,
        marginTop: 10
    },
    table: {
        borderWidth: 0.4,
        borderColor: '#000',
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        flex: 1,
        borderWidth: 0.5,
        borderColor: '#000',
        padding: 8,
    },
    loginBtn: {
        width: responsiveWidth(40),
        backgroundColor: "#4D2DB7",
        borderRadius: responsiveHeight(1),
        height: responsiveHeight(7),
        alignItems: "center",
        justifyContent: "center",

        marginBottom: responsiveHeight(1.4),
    },
    loginText: {
        color: "#FFF",
        fontSize: responsiveFontSize(2.3),
        fontWeight: "bold",
    },

})