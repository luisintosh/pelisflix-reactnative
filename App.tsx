import React from 'react';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import {Provider} from 'mobx-react';

import AppNavigator from './src/navigation/AppNavigator';
import RootStore from "./src/model/RootStore";

const rootStore = new RootStore();

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  render() {
    if (!this.state.isLoadingComplete) {
      // @ts-ignore
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync.bind(this)}
          onError={this._handleLoadingError.bind(this)}
          onFinish={this._handleFinishLoading.bind(this)}
        />
      );
    } else {
      return (
        <Provider rootStore={rootStore}>
          <AppNavigator/>
        </Provider>
      );
    }
  }

  async _loadResourcesAsync() {
    return Promise.all([
      Asset.loadAsync([
        // require('./assets/images/robot-dev.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        'Roboto': require('native-base/Fonts/Roboto.ttf'),
        'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
        ...Ionicons.font,
      }),
    ]);
  };

  _handleLoadingError(error) {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading() {
    this.setState({ isLoadingComplete: true });
  };
}
