import {createSwitchNavigator, createStackNavigator, createAppContainer} from 'react-navigation'
import HomeScreen from "../screens/HomeScreen";
import MovieScreen from "../screens/MovieScreen";
import AuthLoadingScreen from "../screens/auth/AuthLoadingScreen";
import SignInScreen from "../screens/auth/SignInScreen";
import HeaderRightComponent from '../components/HeaderRightComponent';

import Colors from '../theme/colors';

const AppStack = createStackNavigator({
  AuthLoading: {
    screen: AuthLoadingScreen,
  },
  Auth: {
    screen: SignInScreen,
  },
  App: {
    screen: HomeScreen,
    navigationOptions: {
      title: 'Pelisflix',
      headerTintColor: Colors.text,
      headerStyle: {
        backgroundColor: Colors.black
      },
      headerRight: HeaderRightComponent(),
    },
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
}, {
  initialRouteName: 'AuthLoading',
});

export default createAppContainer(AppStack);
