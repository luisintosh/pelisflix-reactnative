import React from 'react'
import {SafeAreaView, StyleSheet} from 'react-native'
import { Text, View, Button } from 'native-base'
import * as Facebook from 'expo-facebook'
import RootStore from "../../model/RootStore";
import {inject, observer} from "mobx-react";

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
      <SafeAreaView style={styles.container}>
        <View>
          <Button onPress={ this._loginWithFacebook.bind(this) }>
            <Text>Entrar con Facebook</Text>
          </Button>
          {this.state.dialogVisible && <Text>Error: {this.state.dialogMessage}</Text>}
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

export default inject('rootStore')(SignInScreen);
