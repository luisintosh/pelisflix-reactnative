import {createSwitchNavigator, createStackNavigator, createAppContainer} from 'react-navigation'
import HomeScreen from "../screens/HomeScreen";
import MovieScreen from "../screens/MovieScreen";
import AuthLoadingScreen from "../screens/auth/AuthLoadingScreen";
import SignInScreen from "../screens/auth/SignInScreen";

const AppStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      title: 'Pelisflix'
    }
  },
  Movie: {
    screen: MovieScreen,
    navigationOptions: {
      title: 'Ver Película'
    }
  }
});

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    Auth: SignInScreen,
    App: AppStack,
  },
  {
    initialRouteName: 'AuthLoading'
  }
));
