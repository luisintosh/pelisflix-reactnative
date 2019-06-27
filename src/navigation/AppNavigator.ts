import {createSwitchNavigator, createStackNavigator, createAppContainer} from 'react-navigation'
import HomeScreen from "../screens/HomeScreen";
import MovieScreen from "../screens/MovieScreen";
import AuthLoadingScreen from "../screens/auth/AuthLoadingScreen";
import SignInScreen from "../screens/auth/SignInScreen";
import HeaderRightComponent from '../components/HeaderRightComponent';

import Colors from '../theme/colors';

const AppStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => {
      return {
        title: 'Pelisflix',
        headerTintColor: Colors.text,
        headerStyle: {
          backgroundColor: Colors.black
        },
        headerRight: HeaderRightComponent(navigation),
      };
    }
  },
  Movie: {
    screen: MovieScreen,
    navigationOptions: {
      title: 'Ver Película',
      headerTintColor: Colors.text,
      headerStyle: {
        backgroundColor: Colors.black
      }
    }
  }
});

const AuthStack = createStackNavigator({
  SignIn: {
    screen: SignInScreen,
    navigationOptions: {
      header: null,
    }
  }
});

export default createAppContainer(createSwitchNavigator({
  AuthLoading: AuthLoadingScreen,
  App: AppStack,
  Auth: AuthStack,
}, {
  initialRouteName: 'AuthLoading'
}));
