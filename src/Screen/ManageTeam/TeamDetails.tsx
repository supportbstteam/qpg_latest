import { View, Text, StyleSheet, Image, ScrollView } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native';
import Header from '../../Component/Common_Component/Header';
import { CardBase } from '@rneui/base/dist/Card/Card';
import Textlabel from '../../Component/Common_Component/Textlabel';
import { Image_Base_Url } from '../../API/api';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';

const TeamDetails: React.FC<{ navigation: any }> = ({ navigation }) => {
    const route = useRoute();
    const { TeamItem } = route.params;


    const roleMapping = {
        0: 'Admin',
        1: 'Manager',
        2: 'Executive',
        3: 'Teacher',
        4: 'Student',
        5: 'Regional Head',
        6: 'State Head',
        7: 'Tertiary Head'
    };


    
    const departmentMapping = {
        0: 'Sales',
        1: 'Marketing',
        2: 'Account',
        3: 'Human Resources',
        4: 'Digital Content',
        5: 'Information Technology'}


    return (
        <View style={styles.container}>

            <Header
                title={TeamItem.name}
                bg={'blue'}
                leftIcon={'arrow-back'}
                onLeftPress={() => navigation.goBack()}
            />

            <ScrollView style={{ flex: 1 }}>
                <CardBase containerStyle={styles.cardContainer}>
                    {/* <Textlabel title='ID:' value={String(TeamItem.id)} /> */}
                    <Textlabel title='Name:' value={TeamItem.name} />
                    <Textlabel title='Email:' value={TeamItem.email} />
                    <Textlabel title='Designation:' value={TeamItem.designation} />
                    <Textlabel title='Role:' value={roleMapping[TeamItem.role] || 'Unknown'} />
                    {/* <Textlabel title='Parent ID:' value={String(TeamItem.parent)} /> */}
                    <Textlabel title='Department:' value={departmentMapping[TeamItem.department] || 'Unknown'} />
                    <Textlabel title='Contact No:' value={TeamItem.contact_no} />
                    {/* <Textlabel title='Status:' value={TeamItem.status === 1 ? 'Active' : 'Inactive'} /> */}
                    <Textlabel title='Month Salary:' value={TeamItem.month_salary ? String(TeamItem.month_salary) : 'N/A'} />
                    <Textlabel title='Bank Account Number:' value={TeamItem.bank_ac_number ? TeamItem.bank_ac_number : 'N/A'} />
                    <Textlabel title='Bank Name:' value={TeamItem.bank_name ? TeamItem.bank_name : 'N/A'} />

                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: responsiveHeight(2) }}>
                        <Text style={styles.nametitle}>Image:</Text>
                        {TeamItem.profile_pic ? (
                            <Image source={{ uri: `${Image_Base_Url}/${TeamItem.profile_pic}` }} style={{ resizeMode: "contain", width: 200, height: 150 }} />
                        ) : (
                            <Text style={styles.noImageText}>No Image Available</Text>
                        )}
                    </View>
                </CardBase>
            </ScrollView>


        </View>
    )
}

export default TeamDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
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
        color: 'red',
        marginLeft: 10,
    },
});
