import { View, Text, Share } from 'react-native';
import React, { useEffect } from 'react';

const ShareApp = ({ navigation }) => {
  const shareData = async () => {
    try {
      const playStoreLink = 'https://play.google.com/store/apps/details?id=qpg';
      await Share.share({
        message: 'Check out my Best Way Learning app on the Google Play Store: ' + playStoreLink,
        url: playStoreLink, // Add the URL to the share data
      });
      navigation.goBack();
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const handleFocus = () => {
      shareData();
    };

    const focusListener = navigation.addListener('focus', handleFocus);

    return () => {
      focusListener.remove();
    };
  }, [navigation]);

  return (
    <View>
      <Text>Share</Text>
    </View>
  );
};

export default ShareApp;
