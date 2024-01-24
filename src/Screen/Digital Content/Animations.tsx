import { ScrollView, StyleSheet, Text, View,NativeModule } from 'react-native'
import React from 'react'
import VideoPlayer from '../../Component/DigitalContent/VideoPlayer'
import Header from '../../Component/Common_Component/Header'
// import { NativeModule } from 'react-native';

const Animations = ({route,navigation}) => {
    const Video_data_in_loop = route?.params
  


  return (

<View style={{flex:1,backgroundColor:"white"}}>
  


  <Header
     bg={'blue'}
     title={'Animations'}
     leftIcon={'arrowleft'}
     DashboardProps={()=>{navigation.navigate("Dashboard")}}
     onLeftPress={() => navigation.goBack()}
     />
    <ScrollView>
      {Video_data_in_loop ? (
    <View>

      <VideoPlayer videos={Video_data_in_loop} />
    </View>
        
        ) : (
          <Text style={styles.message}>No Animations Found!</Text>
          )}
      </ScrollView>
          </View>
  )
}
export default Animations
const styles = StyleSheet.create({
  message: {
    color: 'darkgray',
    fontSize: 17,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginVertical: 20,
  },
})
