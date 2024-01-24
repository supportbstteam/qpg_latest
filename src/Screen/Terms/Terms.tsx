import { View, Text,StyleSheet } from 'react-native'
import React from 'react'

import { CardBase } from '@rneui/base/dist/Card/Card'
import Header from '../../Component/Common_Component/Header'
import { ScrollView } from 'react-native-gesture-handler'

const Terms = ({navigation}) => {
  return (
    <>
      <Header
        bg={'blue'}
        title={'Director Message'}
        leftIcon={'menu-unfold'}
        onLeftPress={() => navigation.toggleDrawer()}
      />
      <ScrollView style={styles.container}>
        <CardBase>
          {/* <Text style={styles.main}> Director Message </Text> */}
          <Text style={styles.para}>
            Every moment in life brings new possibilities and opportunities of
            success and the boundless joy is compounded when we are about to realize our goal.
          </Text>
          <Text style={styles.secondPara}>
            The meticulously nurtured learning environment in Best Way Learning is stress
            free and fear free. It enables and encourages new ideas to flourish. Students
            are encouraged to persist in their quest for learning and acquire the requisite
            skills to excel in our information driven globalised world.
          </Text>
          <Text style={styles.secondPara}>
            Our techniques are learner centric, project based and cater for the holistic
            development of multiple intelligences. Besides this, we also acknowledge and
            encourage our students to learn in their unique mix of Visual, Auditory, Tactile or
            Kinesthetic ways. While every student follows the general curriculum, he or she is
            actively encouraged to develop talents and interests well beyond it.
          </Text>
          <View>
            <Text style={styles.text}> Best Regards </Text>
            <Text style={{ fontSize: 18, marginLeft: 4,color:"#787a7c" }}> Sandeep Garg </Text>
          </View>
        </CardBase>
      </ScrollView>

    </>
  )
}

export default Terms


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
      textAlign: 'justify',
      lineHeight: 20,
      fontWeight: '500',
      marginLeft: 8,
      marginRight: 8,
      color:"#787a7c"
  },

  secondPara: {
      textAlign: 'justify',
      lineHeight: 20,
      marginTop: 7,
      marginLeft: 8,
      marginRight: 8,
      color:"#787a7c"
  },

  text: {
      fontWeight: '600',
      color: '#5272F2',
      fontSize: 18,
      marginTop: 10,
      marginLeft: 4,
      
  }
})