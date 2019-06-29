import React from "react";
import {SafeAreaView, StyleSheet} from "react-native";
import {Spinner, Text, View} from "native-base";
import Log from "../../utils/Log";
import {inject, observer} from "mobx-react";

import * as SecureStore from "expo-secure-store";
import MovieStore from "../../store/MovieStore";
import AuthStore from "../../store/AuthStore";

interface AuthLoadingProps {
	movieStore: MovieStore;
	authStore: AuthStore;
	navigation: any;
}

class AuthLoadingScreen extends React.Component<AuthLoadingProps> {

	componentDidMount(): void {
		this._authStatusObserver();
	}

	async _authStatusObserver() {
		// This will switch to the App screen or Auth screen and this loading
		// screen will be unmounted and thrown away.
		try {
			const jwt = await SecureStore.getItemAsync("jwt");
			if (typeof jwt === "string" && jwt.length === 0) {
				throw "No JWT token found";
			}
			// trying to get user info
			await this.props.authStore.loginUser();
			await this.props.movieStore.loadMovies();
			// redirect to next screen
			this.props.navigation.navigate("App");
		} catch (error) {
			Log.e(error);
			this.props.navigation.navigate("Auth");
		}

	}

	render() {
		return (
			<SafeAreaView style={styles.container}>
				<View>
					<Spinner color="#F44336" />
					<Text style={{color: "#F44336"}}>Cargando lista de películas...</Text>
				</View>
			</SafeAreaView>
		);
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});

export default inject("movieStore", "authStore")(observer(AuthLoadingScreen));
