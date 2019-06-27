import React from 'react'
import {SafeAreaView, StyleSheet, ActivityIndicator} from 'react-native'
import {Spinner, View, Text} from 'native-base'
import Log from "../../utils/Log";
import RootStore from "../../model/RootStore";
import {inject, observer} from "mobx-react";

import Colors from '../../theme/colors';
import { SecureStore } from 'expo/build/deprecated.web';

interface AuthLoadingProps {
  rootStore: RootStore,
  navigation: any,
}

class AuthLoadingScreen extends React.Component<AuthLoadingProps> {

  componentDidMount(): void {
    this._authStatusObserver();
  }

  async _authStatusObserver() {
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    try {
      const jwt = await SecureStore.getItemAsync('jwt');
      if (typeof jwt === 'string' && jwt.length === 0) {
        throw 'No JWT token found'
      }
      // trying to get user info
      await this.props.rootStore.authStore.loginUser();
      await this.props.rootStore.movieStore.loadMovies();
      // redirect to next screen
      this.props.navigation.navigate('App');
    } catch(error) {
      Log.e(error);
      this.props.navigation.navigate('Auth');
    }
    
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <Spinner color={Colors.primary} />
          <Text style={styles.text}>Cargando lista de películas...</Text>
        </View>
      </SafeAreaView>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background
  },
  text: {
    color: Colors.text
  }
});

export default inject('rootStore')(observer(AuthLoadingScreen));
