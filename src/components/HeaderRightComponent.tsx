import React from 'react';
import {Share, Linking, StyleSheet, AsyncStorage} from 'react-native'
import {View, Button, Icon} from 'native-base';
import Log from '../utils/Log';
import { SecureStore } from 'expo/build/deprecated.web';

export default (navigation) => {
  const shareUrl = 'https://play.google.com/store/apps/details?id=info.pelisflix';
  const FBurl = 'https://www.facebook.com/Pelisflix-463649424192586';

  const shareFunc = async () => {
    try {
      await Share.share({
          message:
          '¡Te recomiendo Descargar esta App para ver Películas Gratis! ' + shareUrl,
      });
      Log.i('App shared');
    } catch (error) {
      Log.e(error.message);
    }
  }

  const followFunc = async () => {
    try {
      Linking.openURL(FBurl);
      Log.i('App followed');
    } catch (error) {
      Log.e(error.message);
    }
  }

  const logoutFunc = async () => {
    try {
      await AsyncStorage.clear();
      await SecureStore.setItemAsync('jwt', '');
      navigation.navigate('AuthLoading');
      Log.i('App logout');
    } catch (error) {
      Log.e(error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Button iconLeft transparent onPress={shareFunc}>
        <Icon name="md-share" style={styles.actionBtn} />
      </Button>
      <Button iconLeft transparent onPress={followFunc} >
        <Icon name='logo-facebook' style={styles.actionBtn} />
      </Button>
      <Button iconLeft transparent onPress={logoutFunc} >
        <Icon name='md-exit' style={styles.actionBtn} />
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 10,
  },
  actionBtn: {
    color: '#fff',
    marginRight: 5,
  }
});