import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
// import { Header } from '@react-navigation/stack'
import Header from '../../Component/Common_Component/Header'
import Cards from '../../Component/DigitalContent/Cards'


const Ebooks = ({route,navigation}) => {
    const books = route?.params

    console.log("here e-books",books)
 
  return (
    <View style={{flex:1,backgroundColor:"white"}}>
  


    <Header
       bg={'blue'}
       title={'E-Books'}
       leftIcon={'arrowleft'}
       DashboardProps={()=>{navigation.navigate("Dashboard")}}
       onLeftPress={() => navigation.goBack()}
       />
        
      {books ? (
          <Cards data={books} screen={'book'} />
        ) : (
          <Text style={styles.message}>No E-Books Found!</Text>
        )}
          
          
            </View>
    )
  
  
}

export default Ebooks

const styles = StyleSheet.create({
    message: {
        color: 'darkgray',
        fontSize: 17,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginVertical: 20,
      },
})