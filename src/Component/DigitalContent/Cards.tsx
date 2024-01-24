import {Dimensions, FlatList, View} from 'react-native';
import React from 'react';
import Card from './Card';

const Cards = ({data, screen}) => {
  const {width, height} = Dimensions.get('window');
  return (
    <View
      style={{
        display: 'flex',
        marginVertical: 15,
      }}>
      <FlatList
        data={data}
        contentContainerStyle={{gap: 10, marginHorizontal: 20}}
        numColumns={2}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        renderItem={({item, index}) => {
          return (
            <Card
              key={index}
              image={
                'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/121px-PDF_file_icon.svg.png'
              }
              desc={'desc'}
              title={item.Title}
              path={item.Book ? item.Book : item.Pdf}
              screen={screen}
            />
          );
        }}
      />
    </View>
  );
};

export default Cards;
