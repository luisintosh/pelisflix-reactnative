import React from "react";
import {createAppContainer, createStackNavigator, createSwitchNavigator} from "react-navigation";
import {Root} from "native-base";
import HomeScreen from "./screens/HomeScreen";
import HeaderRightComponent from "./components/HeaderRightComponent";
import MovieScreen from "./screens/MovieScreen";
import SignInScreen from "./screens/auth/SignInScreen";
import AuthLoadingScreen from "./screens/auth/AuthLoadingScreen";

const AppStack = createStackNavigator({
	Home: {
		screen: HomeScreen,
		navigationOptions: ({navigation}) => {
			return {
				title: "Pelisflix",
				headerTintColor: "#FFF",
				headerStyle: {
					backgroundColor: "#F44336",
				},
				headerRight: HeaderRightComponent(navigation),
			};
		},
	},
	Movie: {
		screen: MovieScreen,
		navigationOptions: {
			title: "Ver Película",
			headerTintColor: "#FFF",
			headerStyle: {
				backgroundColor: "#F44336",
			},
		},
	},
}, {
	initialRouteName: "Home",
	headerMode: "screen",
});

const AuthStack = createStackNavigator({
	SignIn: {
		screen: SignInScreen,
		navigationOptions: {
			header: undefined,
		},
	},
}, {
	initialRouteName: "SignIn",
	headerMode: "none",
});

const App = createAppContainer(createSwitchNavigator({
	AuthLoading: AuthLoadingScreen,
	App: AppStack,
	Auth: AuthStack,
}, {
	initialRouteName: "AuthLoading",
}));

export default () => (
	<Root>
		<App/>
	</Root>
);
