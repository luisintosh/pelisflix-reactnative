import React from 'react'
import {Text, View, Button} from 'native-base'

export default function (props) {
  return (
    <View>
      <Text>Auth loading</Text>
      <Button onPress={() => props.navigation.navigate('App')}>
        <Text>Go</Text>
      </Button>
    </View>
  );
}
