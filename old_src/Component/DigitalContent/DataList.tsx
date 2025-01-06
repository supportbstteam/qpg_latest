import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React, { useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';


const DataList: React.FC<{iconName: any, data: any, screenName: any}> = ({ iconName, data, screenName }) => {
  const navigation = useNavigation();

  const getImageSource = (flag:any) => {
    switch (flag) {
      case 'class':
        return require('../../assets/images/class.png');
      case 'subject':
        return require('../../assets/images/subject.png');




      // Add more cases for other flag options
      default:
        return require('../../assets/images/class.png'); // Provide a default image
    }
  };




  const imageSource = getImageSource(iconName);
  return (
    <View style={{ flex: 1, paddingVertical: 10 }}>
      <FlatList
        contentContainerStyle={{ gap: 7, paddingHorizontal: 10 }}
        data={data}
        renderItem={({ item, index }) => {

          return (
            <TouchableOpacity
              key={index}
              style={styles.listItem}
              onPress={() =>
                navigation.navigate(`${screenName}`, {
                  classId: item?.ClassID,
                  subjectId: item?.SubjectID,
                })
              }>
              <Image
                source={imageSource}
                style={{
                  width: 40,
                  height: 40,
                }}
              />
              <Text
                style={{
                  fontSize: responsiveFontSize(1.6),
                  color: 'black',
                  fontWeight: 'bold',
                  flexShrink: 1,
                }}>
                {item.ClassName ? item.ClassName : item.SubjectName}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    width: '100%',
    height: 70,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 30,
  },
});

export default DataList;
