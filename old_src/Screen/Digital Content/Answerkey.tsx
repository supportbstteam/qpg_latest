import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../../Component/Common_Component/Header'
import Cards from '../../Component/DigitalContent/Cards'

const Answerkey = ({route,navigation}) => {
    const pdfs = route?.params
  return (
    <View style={{flex:1,backgroundColor:"white"}}>
  


    <Header
       bg={'blue'}
       title={'Answer Key'}
       leftIcon={'arrow-back'}
       DashboardProps={()=>{navigation.navigate("Dashboard")}}
       onLeftPress={() => navigation.goBack()}
       />
         {pdfs ? (
          <Cards data={pdfs} screen={'pdf'} />
          ) : (
            <Text style={styles.message}>No Answer Keys Found!</Text>
            )}
            </View>
  )
}

export default Answerkey

const styles = StyleSheet.create({
    message: {
        color: 'darkgray',
        fontSize: 17,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginVertical: 20,
      },
})