import { View, Text, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { fetchToken } from '../../Helpers/fetchDetails'
import api from '../../API/api'
import Header from '../../Component/Common_Component/Header'
import { FlatList } from 'react-native-gesture-handler'
import EvilIcons from 'react-native-vector-icons/MaterialIcons'
import { useDispatch } from 'react-redux'
import { setTotalOrderHistory } from '../../Reducer/slices/ConfirmOrderHistory'

interface orderType {
    created_at: string,
    status: number,
    total_amount: number,
    id: number
}

const ConfirmOrderHistory = ({ navigation }) => {

    const [orderHistory, setOrderHistory] = React.useState<orderType[]>([])
    const [isLoading, setIsLoading] = React.useState(true);
    const [searchOrder, setSearchOrder] = React.useState('');


    const dispatch = useDispatch()


    useEffect(() => {

        console.log("run")

        getHistory();

    }, [])
    const getHistory = async () => {
        try {
            const token = await fetchToken();
            if (token) {
                console.log(token)
                const response = await api.getOrderHistory(token);
                setOrderHistory(response.data.data)
                dispatch(setTotalOrderHistory(response.data.data))
                setIsLoading(false)
                console.log("order history", response.data)

            }


        } catch (error) {
            setIsLoading(false)
            console.log("order history error :", error)
        }

    }

    const dateTimeFormat = (date) => {
        const orderDate = new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: "numeric",
            day: "numeric",
        })

        return orderDate; // Return the formatted date
    }

    const getStatusText = (status: number) => {
        switch (status) {
            case 0:
                return "Pending";
            case 1:
                return "Confirm";
            case 2:
                return "Cancelled";
            default:
                return "";
        }
    };

    const filterorderHistory = orderHistory.filter(item => {
        const orderIdString = item.id.toString();
        const formattedDate = dateTimeFormat(item.created_at);
        return (
            formattedDate.toLowerCase().includes(searchOrder.toLowerCase()) ||
            orderIdString.toLowerCase().includes(searchOrder.toLowerCase()) ||
            getStatusText(item.status).toLowerCase().includes(searchOrder.toLowerCase())
        );
    });


    const OrderItem = ({ item, index }) => {
        // Define an array of vibrant RGB colors
        let randomHex = () => {
            let letters = "0123456789ABCDEF";
            let color = "#";
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        };

        // Determine text color based on background brightness
        const backgroundColor = randomHex();


        return (
            <>
                <TouchableOpacity style={[styles.cardContainer, { backgroundColor }]} onPress={() => navigation.navigate("ViewConfirmOrder", { orderId: item.id })}>
                    <View style={styles.eyeIconContainer}>
                        <TouchableOpacity style={[styles.eyeIconBackground]} onPress={() => navigation.navigate("ViewConfirmOrder", { orderId: item.id })}>
                            <Text style={{ color: backgroundColor }}>
                                View
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardText}>Order No: {item.id}</Text>
                        <Text style={styles.cardText}>Date: {dateTimeFormat(item.created_at)}</Text>
                        <Text style={styles.cardText}>Total Amt: ₹{item.total_amount}</Text>
                        <Text style={styles.cardText}>
                            Status: {item.status === 0 ? "Pending" : item.status === 1 ? "Confirm" : item.status === 2 ? "Cancelled" : ""}
                        </Text>
                    </View>
                </TouchableOpacity>

            </>

        );
    };

    // Your existing styles remain unchanged


    return (
        <>
            <View style={styles.container}>
                <Header
                    SearchBarchangeText={(value) => setSearchOrder(value)}
                    bg={"blue"}
                    leftIcon={'arrowleft'}
                    onLeftPress={() => navigation.goBack()}
                />

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 10, }}>

                    <TouchableOpacity style={{ marginHorizontal: 20, borderWidth: 1, padding: 10, borderRadius: 10 }} onPress={() => { navigation.navigate("AddOrder") }}>

                        <Text style={{ fontSize: 17, color: "#000" }}>Add Order</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ marginHorizontal: 20, marginVertical: 6 }} onPress={() => getHistory()}>

                        <EvilIcons name='refresh' size={30} color={"#000"} />
                    </TouchableOpacity>


                </View>

                <FlatList
                    numColumns={2}
                    refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => getHistory()} />}
                    data={filterorderHistory}
                    renderItem={OrderItem}
                />

            </View>
        </>

    )
}

export default ConfirmOrderHistory

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white"
    },
    cardContainer: {
        flex: 1,

        // width:"95%",
        justifyContent: "center",
        marginVertical: 10,
        marginHorizontal: 5,
        alignSelf: "center",
        borderRadius: 10,
    },
    cardContent: {
        marginHorizontal: 14,
        marginVertical: 10,
    },
    cardText: {
        color: "white",
        fontSize: 18,
        marginBottom: 5,
    },

    eyeIconContainer: {
        flex: 1,
        alignItems: "flex-end",
    },
    eyeIconBackground: {
        backgroundColor: "white",
        borderRadius: 15,
        padding: 8,
        marginHorizontal: 10,
        marginTop: 10

    },
})