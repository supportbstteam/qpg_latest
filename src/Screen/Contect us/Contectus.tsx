import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native'
import React from 'react'
import Header from '../../Component/Common_Component/Header'
import { CardBase } from '@rneui/base/dist/Card/Card'
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
                leftIcon={'menu-unfold'}
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
                            <Text style={{ color: "#5272F2" }}> {emailAddress} </Text>
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
        marginTop: 80
    },

    main: {
        fontSize: 30,
        color: '#5272F2',
        textAlign: 'center',
        fontWeight: '500',
        marginBottom: 12
    },

    para: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 20,
        color: "#787a7c"
    },

    contact: {
        display: 'flex',
        flexDirection: "row",
        marginTop: 8,
        marginLeft: 11
    },

    email: {
        display: 'flex',
        flexDirection: "row",
        marginTop: 5,
        marginLeft: 11
    },

    text: {
        fontWeight: '600',
        color: '#000',


    }
})