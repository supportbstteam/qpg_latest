import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Keyboard,
    SectionList,
    RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CheckBox from 'react-native-check-box'; // Import CheckBox
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";

interface DropdownProps {
    data: any[];
    placeholder: string;
    onSelect: (value: any[]) => void;
    title: string;
    selectedItems: any[];
    isLoading?: boolean;
}

const Bootom_Sheet_Dropdown_checkbox: React.FC<DropdownProps> = ({ title, data, placeholder, onSelect, selectedItems, isLoading }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedValues, setSelectedValues] = useState<any[]>([]);

    useEffect(() => {
        setSelectedValues(selectedItems); // Update selected values when selectedItems prop changes
    }, [selectedItems]);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
        setSearchTerm('');
    };

    const handleToggleItem = (item: any) => {
        let updatedSelection;
        if (selectedValues.some((selected) => selected.value === item.value)) {
            updatedSelection = selectedValues.filter((selected) => selected.value !== item.value);
        } else {
            updatedSelection = [...selectedValues, item];
        }
        setSelectedValues(updatedSelection);
    };

    const handleSaveSelection = () => {
        onSelect(selectedValues);
        toggleModal();
        Keyboard.dismiss();
    };

    const filteredData = data.filter((item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <View style={{ marginTop: 10 }}>
                <Text style={styles.textinputlabel}>{title}</Text>
                <TouchableOpacity onPress={toggleModal} style={styles.dropdowncontainer}>
                    <Text style={styles.dropdownText}>
                        {selectedValues.length > 0
                            ? selectedValues.map((item) => item.label).join(', ')
                            : placeholder}
                    </Text>
                    <Icon name="caret-down" size={responsiveFontSize(2)} style={styles.dropdownIcon} />
                </TouchableOpacity>
            </View>

            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={toggleModal}
            >
                <View style={[styles.modalContainer, styles.modalContainerCentered]}>
                    <View style={[styles.modal, { width: responsiveWidth(100), height: responsiveHeight(60) }]}>
                        <View style={{ alignItems: "center" }}>
                            <View style={{ width: '15%', height: responsiveHeight(0.7), backgroundColor: 'blue', marginTop: 10, marginBottom: 20 }} />
                        </View>

                        <TextInput
                            style={styles.searchInput}
                            placeholderTextColor={"#787a7c"}
                            placeholder="Search..."
                            value={searchTerm}
                            onChangeText={setSearchTerm}
                        />
                        <SectionList
                            refreshControl={<RefreshControl refreshing={isLoading} />}
                            sections={[{ data: filteredData }]}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <View style={styles.checkboxContainer}>
                                    <CheckBox
                                        isChecked={selectedValues.some((selected) => selected.value === item.value)}
                                        onClick={() => handleToggleItem(item)}
                                    />
                                    <Text style={styles.itemlabel}>{item.label}</Text>
                                </View>
                            )}
                        />
                        <TouchableOpacity onPress={handleSaveSelection} style={styles.closeButton}>
                            <Text style={{ color: "white", fontSize: responsiveFontSize(2) }}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    // ... existing styles ...
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: responsiveHeight(1),
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainerCentered: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    dropdowncontainer: {
        width: responsiveWidth(95),
        marginVertical: responsiveHeight(1.5),
        marginHorizontal: responsiveHeight(1.5),
        backgroundColor: 'white',
        borderRadius: responsiveHeight(1.5),
        padding: responsiveHeight(2.2),
        elevation: responsiveHeight(0.2),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownText: {
        color: "#787a7c",
        fontSize: responsiveFontSize(2),
    },
    dropdownIcon: {
        color: "#787a7c",
        marginLeft: responsiveWidth(2),
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modal: {
        backgroundColor: 'white',
        borderTopLeftRadius: responsiveHeight(2),
        borderTopRightRadius: responsiveHeight(2),
        paddingHorizontal: responsiveHeight(2.3),
        paddingBottom: responsiveHeight(2.3),
    },
    textinputlabel: {
        marginLeft: responsiveHeight(2.2),
        fontSize: responsiveFontSize(1.9),
        color: "#1A1A18",
    },
    searchInput: {
        borderWidth: responsiveHeight(0.1),
        borderColor: '#ccc',
        borderRadius: responsiveHeight(0.5),
        padding: responsiveHeight(1.2),
        marginBottom: responsiveHeight(1.2),
        color: "#000",
    },
    closeButton: {
        marginTop: responsiveHeight(1.2),
        padding: responsiveHeight(1.3),
        borderWidth: 1,
        borderRadius: responsiveHeight(0.5),
        alignSelf: 'flex-end',
        borderColor: '#ccc',
        backgroundColor: "blue",
    },
    itemlabel: {
        fontSize: responsiveFontSize(1.8),
        color: "#000",
    },
});

export default Bootom_Sheet_Dropdown_checkbox;
