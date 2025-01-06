import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

const Card = ({image, desc, title, path, screen}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() =>
        navigation.navigate('ViewBook', {path: path, screen: screen})
      }>
      <View style={styles.cardImgContainer}>
        <Image source={{uri: image}} style={styles.cardImg} alt="PDF" />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>{desc}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 140,
    marginHorizontal:10,
    height: 200,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'lightblue',
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {width: 10, height: 10},
    shadowRadius: 10,
    shadowOpacity: 5,
    elevation: 5,
  },
  cardImgContainer: {
    width: '100%',
    height: '70%',
    paddingVertical: 5,
    borderRadius: 10,
    shadowOffset: {width: -2, height: 4},
    shadowRadius: 10,
    shadowColor: 'lightgray',
    shadowOpacity: 0.2,
  },
  cardImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  title: {
    fontSize: 15,
    marginTop: 10,
    marginLeft: 10,
  },
  desc: {
    fontSize: 12,
    marginLeft: 10,
  },
});

export default Card;
