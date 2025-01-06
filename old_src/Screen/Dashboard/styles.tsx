
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
const styles = StyleSheet.create({
    btn: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: 20,
      backgroundColor: 'white',
      width: '95%',
      minHeight:90,
      paddingHorizontal: 30,
      alignItems: 'center',
      borderRadius: 10,
      shadowColor: 'black',
      shadowOffset: {width: 5, height: 5},
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 2,
    },
    line: {
      width:1.5, backgroundColor:"#e2e5eb",
      marginHorizontal: 20,
      borderRightColor: 'gray',
      borderRightWidth: 1,
      height: '70%',
    },
    txt: {
      flex:1,
      fontSize: 18,
      color: '#000',
      fontWeight: '500',
      // marginLeft: 20,
    },
  });
  export default styles;