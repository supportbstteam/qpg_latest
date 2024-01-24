import {StyleSheet} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";


const styles=StyleSheet.create({
  
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'center',
       
    
    
      },
      
    
      inputView: {
        width: responsiveWidth(95),
        marginRight:20,
        position:"relative",
    
      },
      inputText: {
        width:responsiveWidth(95),
        height: responsiveHeight(8),
    
        marginVertical: responsiveHeight(1.5),
        marginHorizontal: responsiveHeight(1.5),
        backgroundColor: 'white',
        borderRadius:responsiveHeight(1.5),
        padding: responsiveHeight(1.5),
      
        elevation: 2,
        color:"#000"
    
      },
      psswordtextinput:{
        width:responsiveWidth(95),
        height: responsiveHeight(8),
    
        marginVertical: responsiveHeight(1.5),
        marginHorizontal: responsiveHeight(1.5),
        backgroundColor: 'white',
        borderRadius:responsiveHeight(1.5),
        padding: responsiveHeight(1.5),
      
        elevation: 2,
        color:"#000"

      },

      loginBtn: {
        width: responsiveWidth(92),
        backgroundColor: "#4D2DB7",
        borderRadius: responsiveHeight(1),
        height:responsiveHeight(7),
        alignItems: "center",
        justifyContent: "center",
        marginTop:responsiveHeight(3),
        marginBottom: responsiveHeight(1.4)
      },
      loginText: {
        color: "#FFF",
        fontSize: responsiveFontSize(2.3),
        fontWeight: "bold",
      },
      ortext: {
        marginTop: responsiveHeight(2.1),
        fontSize:responsiveFontSize(2.5) ,
        marginBottom: responsiveHeight(2.5)
    
      },
      logo: {
        // width: responsiveWidth(50),
        height: responsiveHeight(13),
        resizeMode: 'contain',
        marginTop:"30%",
        marginBottom: 32,
        // alignSelf: 'center',
      },

    icon: {
      // marginLeft: 10,
      position:"absolute",
      right:responsiveHeight(2),
      top:responsiveHeight(7.4)
  },
  bottom:{
    flexDirection:"row",justifyContent:"space-between",marginTop:responsiveHeight(1.3),marginHorizontal:14
  },
  textinputlabel:{
    marginLeft:responsiveHeight(2.2), fontSize: responsiveFontSize(2), color: "#1A1A18" 
},

})
export default styles;