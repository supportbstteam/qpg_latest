import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
  } from "react-native-responsive-dimensions";
interface DropdownProps {
    data: any[];
    placeholder: string;
    onSelect: (value: any) => void;
    iconName: string;
}

const CustomDropdown: React.FC<DropdownProps> = ({ data, placeholder, onSelect, iconName }) => {

    const [selectedValue, setSelectedValue] = React.useState("");

    const handleSelectItem = (item: any) => {
        setSelectedValue(item.value);
        onSelect(item);
    };

    return (
        <Dropdown
        itemTextStyle={{color:"#000"}}
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={data}
            maxHeight={300}
            labelField="label" // Assuming "label" is the key in the data object
            valueField="value"
        
            placeholder={placeholder}
            searchPlaceholder="Search..."
            value={selectedValue}
            onChange={(item) => handleSelectItem(item)}
            renderLeftIcon={() => (
                <Icon style={styles.icon} color="black" name={iconName} size={20} />
            )}
        />
    );
}

const styles = StyleSheet.create({
    dropdown: {
        width:responsiveWidth(95),
        height: responsiveHeight(8),
    
    
        marginVertical: responsiveHeight(1.5),
        marginHorizontal: responsiveHeight(1.5),
        backgroundColor: 'white',
        borderRadius: responsiveHeight(1.5),
        padding: responsiveHeight(1.5),
        shadowColor: '#000',
        elevation: responsiveHeight(0.4),
        color:"#000"
    },
    placeholderStyle: {
        color:"#787a7c",
   
        fontSize:responsiveFontSize(2),
    },
    selectedTextStyle: {
        color:"#000",
        fontSize:responsiveFontSize(2),
    },
    iconStyle: {
        width:responsiveHeight(2) ,
        height: responsiveHeight(3),
    },
    inputSearchStyle: {
        height:responsiveHeight(5) ,
        fontSize:responsiveFontSize(2),
    },
    icon: {
        // marginRight: responsiveHeight(1),
    },
})
export default CustomDropdown