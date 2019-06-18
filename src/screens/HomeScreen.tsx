import React from 'react'
import {Button, Text, View} from 'native-base'

export default function (props) {
  return (
    <View>
      <Text>Auth loading</Text>
      <Button onPress={() => props.navigation.navigate('Movie')}>
        <Text>Go</Text>
      </Button>
    </View>
  );
}
