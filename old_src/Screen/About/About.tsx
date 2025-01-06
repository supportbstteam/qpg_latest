import { View, Text,StyleSheet } from 'react-native'
import React from 'react'
import Header from '../../Component/Common_Component/Header'
import { CardBase } from '@rneui/base/dist/Card/Card'
import { responsiveFontSize, responsiveScreenHeight } from 'react-native-responsive-dimensions'

const About = ({navigation}) => {
  return (
   <>
   <Header
        bg={'blue'}
        title={'About US'}
        leftIcon={'menu'}
        onLeftPress={() => navigation.toggleDrawer()}
      />
         <View style={styles.container}>
            <CardBase>
                {/* <Text style={styles.main}>About US </Text> */}
                <Text style={styles.para}>
                    In Best Way Learning all books are prepared with the
                    vision of providing all the relevant content with futuristic approach so that
                    student can learn with fun and happiness.
                </Text>
            </CardBase>
        </View>
   </>
  )
}

export default About

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    marginTop: responsiveScreenHeight(5),
  },

  main: {
    fontSize: responsiveFontSize(1.9),
    color: '#5272F2',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 12,
    lineHeight:2,
  },

  para: {
    fontSize: responsiveFontSize(1.9),
    textAlign: 'justify',
    lineHeight: 20,
    color:"#787a7c",
    letterSpacing:1,
  },
});
