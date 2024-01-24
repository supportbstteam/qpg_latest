// CustomTextInput.js
import React from 'react';
import { StyleSheet, TextInput, View, Text } from 'react-native';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";


interface CustomTextInputProps {
    value: string,
    placeholder: string,
    title: string,
    onChangeText: (text: string) => void;
    keyboardType: string
    secureTextEntry: boolean,
    maxLength: number

}

const CustomTextInput: React.FC<CustomTextInputProps> = ({ title, value, placeholder, onChangeText, keyboardType = 'default', secureTextEntry = false, maxLength, ...rest }) => {
    return (

        <View style={styles.inputView}>

            <Text style={styles.textinputlabel}>{title}</Text>

            <TextInput
                style={styles.inputText}
                placeholderTextColor={"#787a7c"}
                autoCapitalize='none'
                autoCorrect={false}
                value={value}
                placeholder={placeholder}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                maxLength={maxLength}
                secureTextEntry={secureTextEntry}
                {...rest}
            />
        </View>
    );
};

export default CustomTextInput;


const styles = StyleSheet.create({
    inputText: {
        width: responsiveWidth(95),
        height: responsiveHeight(8),

        marginVertical: responsiveHeight(0.5),
        marginHorizontal: responsiveHeight(1.5),
        backgroundColor: 'white',
        borderRadius: responsiveHeight(1.5),
        padding: responsiveHeight(1.5),

        elevation: responsiveHeight(0.2),
        color: "#000"
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

})
