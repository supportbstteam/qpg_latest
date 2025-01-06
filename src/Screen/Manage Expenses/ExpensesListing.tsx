import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Alert, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fetchToken } from '../../Helpers/fetchDetails'
import api, { Image_Base_Url } from '../../API/api'
import Header from '../../Component/Common_Component/Header'
import { CardBase } from '@rneui/base/dist/Card/Card'
import Textlabel from '../../Component/Common_Component/Textlabel'
import Icon from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import EvilIcons from 'react-native-vector-icons/MaterialIcons'
import { useRoute } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions'
const ExpensesListing: React.FC<{ navigation: any }> = ({ navigation }) => {

    const [Expenses, SetExpenses] = useState([]);
    const [isLoading, setSchoolLoading] = useState<boolean>(true);

    useEffect(() => {
        get_expenses()
    }, [])
    const route = useRoute();

    useEffect(() => {
        // Check if newInvoice data is present
        if (route.params?.newExpenses) {
            SetExpenses(PrevesExpenses => [route.params.newExpenses, ...PrevesExpenses]);
        }
    }, [route.params?.newExpenses]);

    useEffect(() => {
        // Check if updatedExpenses data is present
        if (route.params?.updatedExpenses) {
            const updatedExpensesArray = route.params.updatedExpenses;
            SetExpenses(prevExpenses =>
                prevExpenses.map(expense =>
                    updatedExpensesArray.find(updated => updated.id === expense.id) || expense
                )
            );
        }
    }, [route.params?.updatedExpenses]);

    const get_expenses = async () => {
        const token = await fetchToken();
        if (token) {
            try {
                const response = await api.get_expenses(token);
                if (response.data.status === true) {
                    SetExpenses(response.data.data);
                    setSchoolLoading(false);
                }
                console.log("get_expenses response", response.data);
            } catch (error) {
                console.error("school user error:", error);
            }
        }
    };

    const handleApprove = async (reportId: number) => {
        try {
            // Replace with your API endpoint to update report status
            const formdata = {
                status: 1
            }
            const token = await fetchToken()
            if (token) {
                const response = await api.Expenses_Approve_reject(reportId, token, formdata)
                Toast.show({
                    type: 'success',
                    text1: "Status Approve",
                    autoHide: false,
                    visibilityTime: 2000,
                    onShow: () => {
                        setTimeout(() => {
                            Toast.hide();


                        }, 2000);
                    },
                });
                console.log("response", response.data)
            }
            // Alert.alert('Success', 'Report approved.');
            get_expenses(); // Refresh the data
        } catch (error) {
            console.error("Approval error:", error);
            Alert.alert('Error', 'Failed to approve report.');
        }
    };

    const handleReject = async (reportId: number) => {
        try {
            // Replace with your API endpoint to update report status
            const formdata = {
                status: 0
            }
            const token = await fetchToken()
            if (token) {
                const response = await api.Expenses_Approve_reject(reportId, token, formdata)
                Toast.show({
                    type: 'success',
                    text1: "Status Reject",
                    autoHide: false,
                    visibilityTime: 2000,
                    onShow: () => {
                        setTimeout(() => {
                            Toast.hide();


                        }, 2000);
                    },
                });
                console.log("response", response.data)
            }
            // Alert.alert('Success', 'Report approved.');
            get_expenses(); // Refresh the data
        } catch (error) {
            console.error("Approval error:", error);
            Alert.alert('Error', 'Failed to approve report.');
        }
    };

    const DeleteExpenses = async (ExpensesId) => {

        const token = await fetchToken()
        if (token) {
            try {
                const respone = await api.delete_expenses(ExpensesId, token)
                if (respone.data.status === true) {
                    Toast.show({
                        type: 'success',
                        text1: respone.data.message,
                        autoHide: false,
                        visibilityTime: 2000,
                        onShow: () => {
                            setTimeout(() => {
                                Toast.hide();

                            }, 2000);
                        },

                    });
                    SetExpenses(prevExpenses =>
                        prevExpenses.filter(expense => expense.id !== ExpensesId)
                    );
                }

            } catch (error) {
                console.error("delete expenses error:", error)
            }
        }
        console.log(ExpensesId)

    }
    const getStatusLabel = (status) => {
        if (status === "1") {
            return "Approved";
        } else if (status === "0") {
            return "Rejected";
        } else {
            return "Pending";
        }
    };
    
    const renderItem = ({ item }) => (
        <CardBase containerStyle={styles.cardContainer}>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                <TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={() => { navigation.navigate("EditExpenses", { ExpensesItem: item }) }}>
                    <Icon name='edit' size={24} color={'black'} />
                </TouchableOpacity>
                <TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={() => DeleteExpenses(item.id)}>
                    <MaterialCommunityIcons name='delete' size={28} color={'black'} />
                </TouchableOpacity>
            </View>
    
            <Textlabel title='Name:' value={item.name} />
            <Textlabel title='Category:' value={item.category} />
            <Textlabel title='Date:' value={item.date} />
            
            <Textlabel title='Status:' value={getStatusLabel(item.status)} />
    
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={styles.nametitle}>Image:</Text>
                {item.attachment ? (
                    <Image source={{ uri: `${Image_Base_Url}/storage/${item.attachment}` }} style={{ width: 200, height: 200 }} />
                ) : (
                    <Text style={styles.noImageText}>No Image Available</Text>
                )}
            </View>
    
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.approveButton}
                    onPress={() => handleApprove(item.id)}
                >
                    <Text style={styles.buttonText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() => handleReject(item.id)}
                >
                    <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
            </View>
        </CardBase>
    );
    
    return (
        <View style={styles.container}>
            <Header
                title={'Manage Expenses'}
                bg={'blue'}
                leftIcon={'menu'}
                onLeftPress={() => navigation.toggleDrawer()}
            />

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 10, }}>

                <TouchableOpacity style={{ marginHorizontal: 20, borderWidth: 1, padding: 10, borderRadius: 10 }} onPress={() => { navigation.navigate("AddExpenses") }}>

                    <Text style={{ fontSize: 17, color: "#000" }}>Add Expenses</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ marginHorizontal: 20, marginVertical: 6 }} onPress={get_expenses}>

                    <EvilIcons name='refresh' size={30} color={"#000"} />
                </TouchableOpacity>


            </View>
            <View style={styles.listContainer}>
                <FlatList
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={get_expenses} />
                    }
                    data={Expenses}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.flatListContent}
                />
            </View>
        </View>
    )
}

export default ExpensesListing


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    listContainer: {
        flex: 1,
        // paddingHorizontal: 16,
    },
    cardContainer: {
        borderRadius: 10,
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#f8f9fa',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        // marginTop:10
    },
    sectionTitle: {
        marginTop: 16,
        marginBottom: 8,
        fontSize: 16,
        fontWeight: '600',
        color: '#343a40',
    },
    reportContainer: {
        marginVertical: 8,
        padding: 12,
        backgroundColor: '#e9ecef',
        borderRadius: 8,
    },
    reportTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#495057',
    },
    reportDetail: {
        fontSize: 14,
        marginTop: 8,
        color: '#6c757d',
        marginVertical: 2,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    approveButton: {
        flex: 1,
        padding: 10,
        backgroundColor: '#28a745',
        borderRadius: 5,
        marginRight: 8,
        alignItems: 'center',
    },
    rejectButton: {
        flex: 1,
        padding: 10,
        backgroundColor: '#dc3545',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    flatListContent: {
        paddingBottom: 20,
    },
    nametitle: {
        marginRight: responsiveHeight(1),
        fontSize: responsiveFontSize(2),
        fontWeight: "600",
        color: "#202020",
        marginBottom: 13
    },
    noImageText: {
        fontSize: 14,
        color: 'red', // You can adjust the color to match your design
        marginLeft: 10,
    },
});
