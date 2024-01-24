import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import YoutubeIframe from 'react-native-youtube-iframe';
import Entypo from 'react-native-vector-icons/Entypo'
import { responsiveScreenHeight } from 'react-native-responsive-dimensions';


const VideoPlayer = ({ videos }) => {

  const [playingIndex, setPlayingIndex] = useState(null);

  const handlePlayButtonClick = (index) => {
    setPlayingIndex(index);
  };
  const getVideoId = videoUrl => {
    // Extract video ID from YouTube video URL
    let videoId = '';
    if (videoUrl.includes('youtube.com/watch?v=')) {
      videoId = videoUrl.split('v=')[1].split('&')[0];
    } else if (videoUrl.includes('youtu.be/')) {
      videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
    }
    return videoId ? videoId : videoUrl;
  };

  return (
    <View style={styles.container}>
      {videos?.map((video, index) => {
        return (
          <View key={index}  style={{ marginHorizontal: 20, marginVertical: 6, position: 'relative' }} >
            {/* <TouchableOpacity onPress={console.log(getVideoId(video.Vi),"----------------------------->????")}> */}

            {index !== playingIndex ? (
              <TouchableOpacity onPress={() => handlePlayButtonClick(index)} style={{ position: 'absolute', margin: 'auto', top: responsiveScreenHeight(8.8), zIndex: 99, width: "21%", height: '26%', display: 'flex', alignSelf: 'center', justifyContent: 'center', backgroundColor: "blue", borderRadius: 5 }}>
                <Entypo
                  name="controller-play"
                  size={50}
                  color="white"
                  style={{ textAlign: "center" }}
                />
              </TouchableOpacity>
            ) : ''}

            <View style={{ pointerEvents: index !== playingIndex ? "none" : "auto" }}>
              <YoutubeIframe
                key={index}
                videoId={getVideoId(video.Video)}
                height={210}
                play={playingIndex === index}
                playListStartIndex={false}
                forceAndroidAutoplay={false}
                onContextMenu={(e) => e.preventDefault()}
                onError={(error) => console.error('Youtube Player Error:', error)}
              />
            </View>


            {/* </TouchableOpacity> */}
            <Text
              style={{
                color: 'black',
                fontSize: 16,
                fontWeight: 600,
                alignSelf: 'center',
              }}>
              {video.VideoName}
            </Text>
          </View>
        );
      })}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    backgroundColor: 'white',
  },
  video: {
    overflow: 'hidden',
    position: 'relative',
    marginTop: 10,
    width: '100%',
    height: 230,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowColor: '#000000',
    elevation: 5,
    shadowOpacity: 1.0,
    display: 'flex',
    flexDirection: 'column',
  },
  videoTitle: {
    fontSize: 17,
    color: 'black',
    fontWeight: '600',
    alignSelf: 'center',
  },
});

export default VideoPlayer;
