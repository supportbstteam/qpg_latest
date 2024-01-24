import { View, Text, SafeAreaView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { TextInput } from 'react-native-gesture-handler';
import { getHistory } from '../../Reducer/slices/SaveOrderHistory';

const { width, height } = Dimensions.get('window');


const Header = ({
    bg,
    title,
    leftIcon,
    rightIcon,
    onLeftPress,
    onRightPress,
    ViewCardItem,
    SearchBarchangeText,
    DashboardProps,
}) => {
    const totalItemCount = useSelector((state) => state.totalItemCount);

    const [ItemLength,SetItemLength]=React.useState('')

    useEffect(() => {

        getBookHistory()
      }, [ViewCardItem]);
    const getBookHistory = async () => {
        const HistoryData = await getHistory();
        SetItemLength(HistoryData.length)
        

    
      }

    return (
        <SafeAreaView>
            <View style={[styles.header, { backgroundColor: bg }]}>
                <Icon
                    name={leftIcon}
                    size={30}
                    color={'white'}
                    onPress={onLeftPress}
                    style={{ marginRight: 'auto' }}
                />
                {title ? <Text style={styles.title}>{title}</Text> : ''}


                {SearchBarchangeText ? (
                    <TextInput
                        placeholder="Search By Order No or Date,Status"
                        placeholderTextColor={"#787a7c"}
                        style={styles.searchInput}
                        onChangeText={(value) => SearchBarchangeText(value)}
                        autoFocus={true}
                    />
                ) : (
                    ''
                )}

                <Icon
                    name={rightIcon}
                    size={30}
                    color={'white'}
                    onPress={onRightPress}
                    style={{ marginLeft: 'auto' }}
                />
                {ViewCardItem ? (
                    <TouchableOpacity onPress={ViewCardItem}>
                        <Text style={{ color: 'white', fontSize: 17, fontWeight: '500' }}>
                        Booked Orders: {ItemLength}
                        </Text>
                    </TouchableOpacity>
                ) : ''}
                {DashboardProps ? (
                    <TouchableOpacity onPress={DashboardProps}>
                        <MaterialIcons name='dashboard' size={30} color={"white"} />
                    </TouchableOpacity>

                ) : ''}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        width: width,
        height: 60,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
    },
    searchInput: {
        width: '85%',
        marginLeft:10,
        padding: 8,
        backgroundColor: 'white',
        borderRadius: 10,
        color:"#000"
    },
});

export default Header;
