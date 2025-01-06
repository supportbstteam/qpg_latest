import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Header from '../../Component/Common_Component/Header';
import {Button} from 'react-native';
import CustomTextInput from '../../Component/Common_Component/CustomTextInput';

const Accounts: React.FC<{navigation: any}> = ({navigation}) => {
  return (
    <>
      <Header
        title="Accounts"
        leftIcon={'arrow-back'}
        onLeftPress={() => navigation.goBack()}
        bg={'blue'}
      />
      <ScrollView>
        {/* Add Button to Add Entry  */}
        <View
          style={{
            marginHorizontal: 10,
            marginTop: 10,
            borderWidth: 2,
            borderRadius: 50,
            padding: 0,
            overflow: 'hidden',
          }}>
          <Button
            onPress={() => {}}
            title="Add Entry"
            color="#2196F3"
            accessibilityLabel="Learn more about this purple button"
          />
        </View>

        {/* Add A separator  */}
        <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: 1,
            marginVertical: 10,
            width: '80%',
            alignSelf: 'center',
          }}
        />

        <Text
          style={{
            color: 'black',
            alignSelf: 'center',
            fontSize: 20,
            textTransform: 'uppercase',
            fontStyle: 'italic',
            fontWeight: 'bold',
            textShadowOffset: {width: 0, height: 0},
            textShadowColor: 'blue',
            textShadowRadius: 5,
            textDecorationLine: 'underline',
          }}>
          Work In Progress
        </Text>
        {/* Shows every entry of the user which fetched from the api */}

        <CustomTextInput
          title="Order Item"
          placeholder="Enter Order Item"
          value="Order"
          onChangeText={text => {}}
        />
        <CustomTextInput
          title="Total Amount"
          placeholder="Enter Total Amount"
          value="Amount"
          onChangeText={text => {}}
        />
        <CustomTextInput
          title="Order Item"
          placeholder="Enter Order Item"
          value="Item"
          onChangeText={text => {}}
        />
        <CustomTextInput
          title="Receipt"
          placeholder="Enter Receipt No."
          value="Receipt"
          onChangeText={text => {}}
        />
      </ScrollView>
    </>
  );
};

export default Accounts;

const styles = StyleSheet.create({});
