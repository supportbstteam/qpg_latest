import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {ScrollView} from 'react-native';
import {
  responsiveFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/FontAwesome';
import Share from 'react-native-share';
import Header from '../../Component/Common_Component/Header';

interface shareOptions {
  title: string;
  message: string;
  url: string;
  social: any;
}

const ShareApp:React.FC<{navigation:any}> = ({navigation}) => {
  const shareData = async () => {
    try {
      const playStoreLink = 'https://play.google.com/store/apps/details?id=qpg';
      await Share.open({
        message:
          'Check out my Best Way Learning app on the Google Play Store: ',
        url: playStoreLink, // Add the URL to the share data
      });
      // navigation.goBack();
    } catch (error:any) {
      console.log(error.message);
    }
  };

  const handleFacebookShare = () => {
    const shareOptions: shareOptions = {
      title: 'Share via Facebook',
      message: 'Check out my Best Way Learning app on the Google Play Store:',
      url: 'https://play.google.com/store/apps/details?id=qpg',
      social: Share.Social.FACEBOOK,
    };
    Share.shareSingle(shareOptions);
  };
  
  const handleWhatsappShare = () => {
    const shareOptions: shareOptions = {
      title: 'Share via WhatsApp',
      message: 'Check out my Best Way Learning app on the Google Play Store:',
      url: 'https://play.google.com/store/apps/details?id=qpg',
      social: Share.Social.WHATSAPP,
    };
    Share.shareSingle(shareOptions);
  };
  
  const handleInstaShare = () => {
    const shareOptions: shareOptions = {
      title: 'Share via Snapchat',
      message: 'Check out my Best Way Learning app on the Google Play Store:',
      url: 'https://play.google.com/store/apps/details?id=qpg',
      social: Share.Social.SNAPCHAT,
    };
    Share.shareSingle(shareOptions);
  };
  
  const handleTwitterShare = () => {
    const shareOptions: shareOptions = {
      title: 'Share via Twitter',
      message: 'Check out my Best Way Learning app on the Google Play Store:',
      url: 'https://play.google.com/store/apps/details?id=qpg',
      social: Share.Social.TWITTER,
    };
    Share.shareSingle(shareOptions);
  };

  // useEffect(() => {
  //   const handleFocus = () => {
  //     shareData();
  //   };

  //   const focusListener = navigation.addListener('focus', handleFocus);

  //   return () => {
  //     focusListener.remove();
  //   };
  // }, [navigation]);

  return (
    <>
      <Header
        bg={'blue'}
        title={'Share App'}
        leftIcon={'arrow-back'}
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView style={{flex: 1}} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.header}>Share App</Text>
          <Text style={styles.content}>
            Welcome to our awesome app! Share it with your friends.
          </Text>

          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={handleFacebookShare}>
              <Icon
                name="facebook"
                size={30}
                color="#1877f2"
                style={styles.icon}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleWhatsappShare}>
              <Icon
                name="whatsapp"
                size={30}
                color="#25D366"
                style={styles.icon}
              />
            </TouchableOpacity> 

            <TouchableOpacity onPress={handleInstaShare}>
              <Icon
                name="snapchat-ghost"
                size={30}
                color="#FFD700"
                style={styles.icon}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleTwitterShare}>
              <Icon
                name="twitter"
                size={30}
                color="#1DA1F2"
                style={styles.icon}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={shareData}>
              <Icon
                name="ellipsis-h"
                size={30}
                color="black"
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default ShareApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    height: '30%',
    margin: responsiveScreenHeight(1.5),
    borderRadius: 10,
  },
  header: {
    fontSize: responsiveFontSize(3.4),
    fontWeight: 'bold',
    textAlign: 'center',
    margin: responsiveScreenHeight(1),
    color: '#2483ff',
  },
  content: {
    fontSize: responsiveFontSize(2),
    margin: responsiveScreenHeight(1.8),
    color: 'black',
    letterSpacing: 0.4,
    lineHeight: 22,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  icon: {
    marginBottom: responsiveScreenHeight(1.5),
    margin: responsiveScreenHeight(1.8),
  },
});
