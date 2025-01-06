import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,

  Platform,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePicker, {
  Image as SelectedImage,
} from 'react-native-image-crop-picker';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import ImageResizer from 'react-native-image-resizer';
import {PERMISSIONS, RESULTS, request} from 'react-native-permissions';

interface ImageSelectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  images: SelectedImage;
  setImages: () => void;
}

const ImageSelectionModal: React.FC<ImageSelectionModalProps> = ({
  isVisible,
  onClose,
  images,
  setImages,
}) => {
  //   const [images, setImages] = useState<SelectedImage[]>([]);

  const addImageFromCamera = async () => {
    try {
      const cameraPermission = Platform.OS === 'android' ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA;

      const permissionResult = await request(cameraPermission);

      if (permissionResult === RESULTS.GRANTED) {
        console.log('Camera permission granted');

        const response = await ImagePicker.openCamera({
          width: 300,
          height: 400,
          cropping: true,
        });

        console.log(response);
        setImages([...images, response.path]); 

      } else {
        console.log('Camera permission denied');
      }
    } catch (error) {
      console.error('Camera Error:', error);
    }
  };

  const addImageFromGallery = async () => {
    try {
      const androidVersion=
        Platform.OS === 'android' ? Platform.Version : null;

      let granted = PermissionsAndroid.RESULTS.DENIED;
      if (androidVersion >= 33) {
        granted = PermissionsAndroid.RESULTS.GRANTED;
      } else {
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
      }
      console.log(granted);
      if (granted) {
        console.log('Gallery permission granted');

        const response = await ImagePicker.openPicker({
          width: 300,
          height: 400,
          cropping: true,
        });
        
        console.log(response.path);
        setImages([...images, response.path]);
        
      } else {
        console.log('Gallery permission denied');
      }
    } catch (error) {
      console.error('Gallery Permission Error:', error);
    }
  };


  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.background} onPress={onClose} />
        <View style={styles.contentContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="times" size={30} color="black" />
          </TouchableOpacity>
       
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={addImageFromCamera}>
              <Text style={styles.buttonText}>Open Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={addImageFromGallery}>
              <Text style={styles.buttonText}>Open Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  background: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  contentContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: responsiveHeight(20), // Minimum height for content container
    justifyContent: 'space-between', // Aligns items along the vertical axis (y-axis)
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: 'skyblue',
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },

});

export default ImageSelectionModal;
