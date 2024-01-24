import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectOrderById } from '../../Reducer/slices/ConfirmOrderHistory';
import Header from '../../Component/Common_Component/Header';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FlatList } from 'react-native';

const ViewConfirmOrder = ({ route, navigation }) => {

    const { orderId } = route.params

    const filterData = useSelector(state => selectOrderById(state, orderId));

    useEffect(() => {

        console.log("here reducers dara", filterData)

    }, [])
    return (
        <>

            <Header
                title={"View History"}
                bg={"blue"}
                leftIcon={'arrowleft'}
                DashboardProps={()=>{navigation.navigate("Dashboard")}}
                onLeftPress={() => navigation.goBack()}
            />

            <View style={{ flex: 1,marginBottom:20,backgroundColor:"white" }}>

                    <View style={{ flexDirection: "row", justifyContent: "center", marginHorizontal: 20, marginTop: 10 }}>
                        <Text style={{ fontSize: 22, color: "green" }}>Total Amount: ₹{filterData?filterData.total_amount:''}</Text>
                    </View>


                    <FlatList
                        data={filterData ? filterData.details : []}
                        
                        renderItem={({ item, index }) => (
                            <>

                                <View style={styles.CardContainer}>

                                    <View style={styles.table}>
                                        {/* here school name */}
                                        <View style={styles.row}>
                                            <View style={styles.cell}>
                                                <Text style={{ color:"#787a7c",fontSize: 18, fontWeight: 'bold' }}>School Name:  </Text>
                                            </View>
                                            <View style={[styles.cell, { alignItems: 'center' }]}>
                                                <Text style={{ color:"#787a7c",fontSize: 16 }}>{item.school ? item.school : "No School Name"}</Text>
                                            </View>
                                        </View>


                                        {/* here Class name */}
                                        <View style={styles.row}>
                                            <View style={styles.cell}>
                                                <Text style={{ color:"#787a7c",fontSize: 18, fontWeight: 'bold' }}>Class Name:  </Text>
                                            </View>
                                            <View style={[styles.cell, { alignItems: 'center' }]}>
                                                <Text style={{ color:"#787a7c",fontSize: 16 }}>{item.class ? item.class : "No Class Name"}</Text>
                                            </View>
                                        </View>

                                        {/* here Subject name */}
                                        <View style={styles.row}>
                                            <View style={styles.cell}>
                                                <Text style={{ color:"#787a7c",fontSize: 18, fontWeight: 'bold' }}>Subject Name:  </Text>
                                            </View>
                                            <View style={[styles.cell, { alignItems: 'center' }]}>
                                                <Text  style={{ color:"#787a7c",fontSize: 16 }}>{item.subject ? item.subject : "No Subject Name"}</Text>
                                            </View>
                                        </View>


                                        {/* here price */}
                                        <View style={styles.row}>
                                            <View style={styles.cell}>
                                                <Text style={{ color:"#787a7c",fontSize: 18, fontWeight: 'bold' }}>Actual Price:  </Text>
                                            </View>
                                            <View style={[styles.cell, { alignItems: 'center' }]}>
                                                <Text style={{ color:"#787a7c",fontSize: 18 }}>₹{item.mrp ? item.mrp : "No Price"}</Text>
                                            </View>
                                        </View>

                                           {/* here Quantity */}
                                           <View style={styles.row}>
                                            <View style={styles.cell}>
                                                <Text style={{ color:"#787a7c",fontSize: 18, fontWeight: 'bold' }}>Quantity:  </Text>
                                            </View>
                                            <View style={[styles.cell, { alignItems: 'center' }]}>
                                                <Text style={{ color:"#787a7c",fontSize: 18 }}>{item.quantity ? item.quantity : "No Price"}</Text>
                                            </View>
                                        </View>


                                        {/* Discout value */}

                                        <View style={styles.row}>
                                            <View style={styles.cell}>
                                                <Text style={{ color:"#787a7c",fontSize: 18, fontWeight: 'bold' }}>Discount (%): </Text>
                                            </View>
                                            <View style={[styles.cell, { alignItems: 'center' }]}>
                                                <Text numberOfLines={1} style={{ color:"#787a7c",fontSize: 18 }}>{item.discount ? item.discount : 0} %</Text>

                                            </View>
                                        </View>

                                        {/* Subtotal */}
                                        <View style={styles.row}>
                                            <View style={styles.cell}>
                                                <Text style={{ color:"#787a7c",fontSize: 18, fontWeight: 'bold' }}>SubTotal: </Text>
                                            </View>
                                            <View style={[styles.cell, { alignItems: 'center' }]}>
                                                <Text numberOfLines={1} style={{ color:"#787a7c",fontSize: 18 }}>₹
                                                    {item.mrp && item.mrp && item.quantity
                                                        ? item.discount && parseFloat(item.discount) !== 0
                                                            ? ((parseFloat(item.mrp) * item.quantity) * (1 - parseFloat(item.discount) / 100)).toFixed(2)
                                                            : (parseFloat(item.mrp) * item.quantity).toFixed(2)
                                                        : "N/A"}
                                                </Text>
                                            </View>
                                        </View>



                                    </View>
                                </View>
                            </>

                        )}
                    />

            </View>

   
        </>
    )
}

export default ViewConfirmOrder

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    mainContainer: {
        flex: 1
    },

    CardContainer: {
        width: responsiveWidth(95),

        marginVertical: responsiveHeight(1),
        marginHorizontal: responsiveHeight(1.5),
        backgroundColor: 'white',
        borderRadius: responsiveHeight(1.5),
        padding: responsiveHeight(2.2),
        elevation: responsiveHeight(0.2),
    },
    table: {
        // borderWidth: 0.4,
        borderColor: '#000',
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        flex: 1,
        // borderWidth: 0.5,
        borderColor: '#000',
        // padding: 8,
        marginBottom:15
    },
    plus_minusContainer: {
        backgroundColor: 'blue',
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        marginHorizontal: 10,
    },
    loginBtn: {

        width: responsiveWidth(92),
        backgroundColor: "#4D2DB7",
        borderRadius: responsiveHeight(1),
        height: responsiveHeight(7),
        alignItems: "center",
        justifyContent: "center",
        marginTop: responsiveHeight(5),
        marginBottom: responsiveHeight(1.4),
        marginVertical: responsiveHeight(1.5),
        marginHorizontal: responsiveHeight(1.5),
    },
})
