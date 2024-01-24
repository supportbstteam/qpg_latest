import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { responsiveHeight, responsiveWidth ,responsiveFontSize} from 'react-native-responsive-dimensions';

interface customModelProps {
  visible: boolean;
  message: string;
  closeModal: () => void;
}
const CutomWarning: React.FC<customModelProps> = ({ visible, message, closeModal }) => {
  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={visible}
      onRequestClose={closeModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent} >
          <View style={{ marginBottom:responsiveHeight(1) }}>
            <Text style={{ fontSize: responsiveFontSize(2.2), color: "red", fontWeight: "500" }}>Warning !</Text>
          </View>
          <View >
            <Text style={styles.modalText}>{message}</Text>
            <TouchableOpacity onPress={closeModal}>
              <View style={{marginTop:10,alignItems:"flex-end",justifyContent:"flex-end",marginRight:responsiveHeight(3.3)}} >
              <Text style={{fontSize:responsiveFontSize(2),color:"blue",borderWidth:1,borderColor:"black",paddingHorizontal:responsiveHeight(2.8),marginTop:responsiveHeight(1.2),paddingVertical:responsiveHeight(0.5),borderRadius:responsiveHeight(5)}}>OK</Text>
              </View>

            </TouchableOpacity>
          </View>

        </View>
      </View>


    </Modal>
  )
}

export default CutomWarning;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background


  },
  modalContent: {
    backgroundColor: 'white',
    padding: responsiveHeight(2.3),
    borderRadius: responsiveHeight(1),
    elevation:responsiveHeight(0.5), // Shadow on Android
    marginLeft: responsiveHeight(1.5),
    marginRight: responsiveHeight(1.5),
    width: "90%",
    // height: responsiveHeight(19)
  },
  modalText: {
    marginBottom: 0,
    fontSize: 17,
    color:"#202020"

  },
})