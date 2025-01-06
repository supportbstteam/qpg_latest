import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native'
import React from 'react'
import Header from '../../Component/Common_Component/Header'
import { CardBase } from '@rneui/base/dist/Card/Card'
import { responsiveFontSize, responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions'
const Contectus = ({ navigation }) => {

    const phoneNumber = "011-47073550";
    const emailAddress = "info@bestwaypublications.com";

    const handlePhonePress = () => {
        Linking.openURL(`tel:${phoneNumber}`);
    };

    const handleEmailPress = () => {
        Linking.openURL(`mailto:${emailAddress}`);
    };

    return (
        <>
            <Header
                bg={'blue'}
                title={'Contact us'}
                leftIcon={'menu'}
                onLeftPress={() => navigation.toggleDrawer()}
            />
            <View style={styles.container}>
                <CardBase>
                    {/* <Text style={styles.main}> Contact Us </Text> */}
                    <Text style={styles.para}>
                        Best way Publications, A-1/50 B, Keshav Puram, Delhi-110035
                    </Text>
                    <View style={styles.contact}>
                        <Text style={styles.text}> Contact No - </Text>
                        <TouchableOpacity onPress={handlePhonePress}>
                            <Text style={{ color: "#5272F2" }}>{phoneNumber}</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={styles.email}>
                        <Text style={styles.text}> Email Id - </Text>
                        <TouchableOpacity
                        onPress={handleEmailPress}
                        >
                            <Text style={{ color: "#5272F2",fontSize:responsiveFontSize(1.8) }}> {emailAddress} </Text>
                        </TouchableOpacity>

                    </View>
                </CardBase>
            </View>

        </>
    )
}

export default Contectus

const styles = StyleSheet.create({
    container: {
        marginTop: responsiveScreenHeight(2)
    },

    main: {
        fontSize:responsiveFontSize(2),
        color: '#5272F2',
        textAlign: 'center',
        fontWeight: '500',
        marginBottom: 12
    },

    para: {
        fontSize: responsiveFontSize(2),
        textAlign: 'center',
        lineHeight: 20,
        color: "#787a7c"
    },

    contact: {
        display: 'flex',
        flexDirection: "row",
        marginTop: 8,
        // marginLeft: 11
    },

    email: {
        display: 'flex',
        flexDirection: "row",
        marginTop: 5,
        // marginLeft: responsiveScreenWidth(0)
    },

    text: {
        fontWeight: '600',
        color: '#000',
        fontSize: responsiveFontSize(1.8),

    }
})