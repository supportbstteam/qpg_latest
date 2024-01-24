import { View, Text, RefreshControl } from 'react-native'
import React, { useEffect } from 'react'
import Header from '../../Component/Common_Component/Header'
import { TouchableOpacity } from 'react-native'
import EvilIcons from 'react-native-vector-icons/MaterialIcons'
import { StyleSheet } from 'react-native'
import { fetchToken } from '../../Helpers/fetchDetails'
import api from '../../API/api'
import { FlatList } from 'react-native-gesture-handler'
import Textlabel from '../../Component/Common_Component/Textlabel'
import { CardBase } from '@rneui/base/dist/Card/Card'
import { useDispatch, useSelector } from 'react-redux'
import { schoolListData, setSchoolList } from '../../Reducer/slices/SchoolSlice'

const SchoolList = ({ navigation }) => {
    const [isLoading, setSchoolLoading] = React.useState<boolean>(true)
    const selectedSchool = useSelector((state: any) => state.schoolListData);



    const dispatch=useDispatch()
    useEffect(() => {

        get_school()
    }, [])

    const get_school = async () => {
        const token = await fetchToken();
        if (token) {
            try {
                const respone = await api.get_school(token)
                if (respone.data.status === true) {
                    console.log(respone.data.data)
                   
                    setSchoolLoading(false)
                    dispatch(setSchoolList(respone.data.data))
                }

            } catch (error) {
                console.log("get school error:", error)
            }
        }
    }

    const EditSchool = (id) => {
       navigation.navigate("EditSchool",{"Id":id})
    }

    const renderItem = ({ item }) => {

        return (
            <CardBase>
                <Textlabel title='Name:' value={item.name} />
                <Textlabel title='Email:' value={item.email} />
                <Textlabel title='Person:' value={item.person} />
                <Textlabel title='Contact Number:' value={item.contact_no} />
                <TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={() => EditSchool(item.id)}>
                    <Text style={{ fontSize: 17, color: "blue" }}>Edit</Text>
                </TouchableOpacity>
            </CardBase>
        )
    }
    return (
        <>
            <View style={styles.Container}>
                <Header
                    title={'Add School'}
                    bg={'blue'}
                    leftIcon={'menu-unfold'}
                    onLeftPress={() => navigation.toggleDrawer()}
                />
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 10, }}>

                    <TouchableOpacity style={{ marginHorizontal: 20, borderWidth: 1, padding: 10, borderRadius: 10 }} onPress={() => { navigation.navigate("AddSchool") }}>

                        <Text style={{ fontSize: 17, color: "#000" }}>Add School</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ marginHorizontal: 20, marginVertical: 6 }} onPress={get_school}>

                        <EvilIcons name='refresh' size={30} color={"#000"} />
                    </TouchableOpacity>


                </View>
                <View style={{flex:1}}>
                    <FlatList
                        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => get_school()} />}
                        style={{ flex: 1, marginBottom: 20 }}
                        data={selectedSchool}
                        renderItem={renderItem}
                        keyExtractor={item => (item && item.id ? item.id.toString() : 'defaultKey')}

                    />
                </View>


            </View>
        </>
    )
}

export default SchoolList


const styles = StyleSheet.create({

    Container: {
        flex: 1,
        backgroundColor: "white"
    }
})