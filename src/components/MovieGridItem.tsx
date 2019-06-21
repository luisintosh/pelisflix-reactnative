import React from 'react'
import { View, StyleSheet } from 'react-native';
import {Image} from "react-native-expo-image-cache";
import {TouchableHighlight} from 'react-native';

interface MovieGridItemInterface {
  id: any,
  coverUri: string,
  width: number,
  height: number,
  vote_average: number,
  onPress: any,
  stars: any,
}

export default (props: MovieGridItemInterface) => {
  const { coverUri, width, height } = props;
  const contentSize = { width, height };

  /**
   * On tap component
   * @returns {*}
   * @private
   */
  const _onPress = () => props.onPress();

  const preview = 'https://www.pelisflix.info/wp-content/uploads/2019/04/movie-cover-placeholder.png';

  return (
    <TouchableHighlight
      onPress={_onPress}
      style={styles.itemContainer}>
      <View>
        <Image
          preview={{uri: preview}}
          uri={coverUri}
          style={contentSize}
        />
        { props.stars() }
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    marginRight: 5,
    marginLeft: 5
  }
});
