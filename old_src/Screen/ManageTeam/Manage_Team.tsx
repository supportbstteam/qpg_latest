import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fetchToken } from '../../Helpers/fetchDetails';
import api, { Image_Base_Url } from '../../API/api';
import Header from '../../Component/Common_Component/Header';
import EvilIcons from 'react-native-vector-icons/MaterialIcons'
import { RefreshControl } from 'react-native';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import { CardBase } from '@rneui/base/dist/Card/Card';
import Textlabel from '../../Component/Common_Component/Textlabel';

const Manage_Team : React.FC<{ navigation: any }> = ({ navigation }) => {

    const [isLoading, setSchoolLoading] = useState<boolean>(true);
    const [TeamData, SetTeamData] = useState([]);

    useEffect(() => {
        get_teamData()

    }, [])


    const get_teamData = async () => {
        const token = await fetchToken();
        if (token) {
            try {
                const response = await api.get_teamData(token);
                // if (response.data.status === true) {

                // }
                SetTeamData(response.data.data)
                setSchoolLoading(false)
                console.log("get_teamData response", response.data.data);
            } catch (error) {
                console.error("school user error:", error);
            }
        }
    };

    const renderItem = ({ item }) => (
   
        <CardBase containerStyle={styles.cardContainer}>
          

                <TouchableOpacity style={{ alignSelf: "flex-end",marginBottom:12 }} onPress={() => { navigation.navigate("TeamDetails", { TeamItem: item }) }}>
                   <Text style={{fontSize:16,borderRadius:5,backgroundColor:"blue",color:"white",padding:5}}>Full Details</Text>
                </TouchableOpacity>
         
            <Textlabel title='Name:' value={item.name} />
            <Textlabel title='Email:' value={item.email} />
            {/* <Textlabel title='Date:' value={item.date} /> */}
            <Textlabel title='Designation:' value={item.designation} />
    
            {/* <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={styles.nametitle}>Image:</Text>
                {item.profile_pic ? (
                    <Image source={{ uri: `${Image_Base_Url}/${item.profile_pic}` }} style={{resizeMode:"contain", width: 200, height: 150 }} />
                ) : (
                    <Text style={styles.noImageText}>No Image Available</Text>
                )}
            </View> */}
    
          
        </CardBase>
    );
    return (
        <View style={styles.container}>
            <Header
                title={'Team listing'}
                bg={'blue'}
                leftIcon={'menu'}
                onLeftPress={() => navigation.toggleDrawer()}
            />

         
            <View style={styles.listContainer}>
                <FlatList
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={get_teamData} />
                    }
                    data={TeamData}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.flatListContent}
                />
            </View>
        </View>
    )
}

export default Manage_Team

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