import React from 'react'
import {SafeAreaView, StyleSheet, ActivityIndicator} from 'react-native'
import {View} from 'native-base'
import Log from "../../utils/Log";
import RootStore from "../../model/RootStore";
import {inject, observer} from "mobx-react";

interface AuthLoadingProps {
  rootStore: RootStore,
  navigation: any,
}

@observer
class AuthLoadingScreen extends React.Component<AuthLoadingProps> {

  componentDidMount(): void {
    this._authStatusObserver();
  }

  async _authStatusObserver() {
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.

    try {
      // trying to get user info
      await this.props.rootStore.authStore.loginUser();
      await this.props.rootStore.movieStore.loadMovies();
    } catch(error) {
      Log.e(error);
    }
    // check user info
    const user = this.props.rootStore.authStore.user;
    // redirect to next screen
    this.props.navigation.navigate(user ? 'App' : 'Auth');
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <ActivityIndicator size="large"/>
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
  }
});

export default inject('rootStore')(AuthLoadingScreen);
