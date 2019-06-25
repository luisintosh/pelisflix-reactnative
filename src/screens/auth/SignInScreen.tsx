import React from 'react'
import {StyleSheet, ImageBackground, SafeAreaView} from 'react-native'
import {Text, View, Button, Icon} from 'native-base'
import * as Facebook from 'expo-facebook'
import RootStore from "../../model/RootStore";
import {inject, observer} from "mobx-react";

import Colors from '../../theme/colors';

interface SignInProps {
  rootStore: RootStore,
  navigation: any,
}

@observer
class SignInScreen extends React.Component<SignInProps> {
  state = {
    dialogVisible: false,
    dialogMessage: ''
  };

  async _loginWithFacebook() {
    try {
      const { type, token } = await Facebook.logInWithReadPermissionsAsync(
        '1012718225604097',
        { permissions: ['public_profile'] }
      );

      if (type === 'success') {
        // Sign in with credential
        await this.props.rootStore.authStore.authUser(token);
        this.props.navigation.navigate('AuthLoading');
      }
    }
    catch(error) {
      console.log('OOPS!!', error);
      this._showDialog(error.toString());
    }
  }

  _showDialog = (message) => this.setState({dialogVisible: true, dialogMessage: message});

  render() {
    return (
      <ImageBackground
        source={ require('../../../assets/splash-wo-logo.png') }
        style={styles.imgBackground}
        resizeMode='cover'>
        <SafeAreaView style={ styles.container }>
          <View>
            <Button iconLeft onPress={ this._loginWithFacebook.bind(this) } style={styles.facebookButton}>
              <Icon name='logo-facebook' />
              <Text>Entrar con Facebook</Text>
            </Button>
            {this.state.dialogVisible && <Text style={styles.text}>Error: {this.state.dialogMessage}</Text>}
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  facebookButton: {
    backgroundColor: '#3B559A',
    color: '#fff',
  },
  text: {
    color: Colors.text,
  }
});

export default inject('rootStore')(SignInScreen);
