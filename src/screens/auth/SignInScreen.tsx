import React from "react";
import {ImageBackground, SafeAreaView, StyleSheet} from "react-native";
import {Button, Icon, Text, View} from "native-base";
import * as Facebook from "expo-facebook";
import {inject, observer} from "mobx-react";

import MovieStore from "../../store/MovieStore";
import AuthStore from "../../store/AuthStore";

import {Analytics, PageHit} from "expo-analytics";
import Constants from 'expo-constants'

import Log from "../../utils/Log";
import {Env} from "../../env";

interface SignInProps {
	movieStore: MovieStore;
	authStore: AuthStore;
	navigation: any;
}

class SignInScreen extends React.Component<SignInProps> {
	state = {
		dialogVisible: false,
		dialogMessage: "",
	};

	componentDidMount(): void {
		const analytics = new Analytics(Env.GoogleAnalytics);
		analytics.hit(new PageHit('Login'))
			.then(() => Log.i('Sent to analytics'))
			.catch(e => Log.e(`Analytics: ${e.message}`));
	}

	async _loginWithFacebook() {
		try {
			const {type, token} = await Facebook.logInWithReadPermissionsAsync(
				Constants.manifest.facebookAppId,
				{permissions: ["public_profile", "email"]},
			);

			if (type === "success") {
				// Sign in with credential
				await this.props.authStore.authUser(token);
				this.props.navigation.navigate("AuthLoading");
			}
		} catch (error) {
			this._showDialog(error.toString());
		}
	}

	_showDialog = (message) => this.setState({dialogVisible: true, dialogMessage: message});

	render() {
		return (
			<ImageBackground
				source={require("../../../assets/splash-wo-logo.png")}
				style={styles.imgBackground}
				resizeMode="cover">
				<SafeAreaView style={styles.container}>
					<View style={{flexDirection: "column"}}>
						<Button iconLeft onPress={this._loginWithFacebook.bind(this)} style={styles.facebookButton}>
							<Icon name="logo-facebook"/>
							<Text>Entrar con Facebook</Text>
						</Button>
						{this.state.dialogVisible && <Text style={{color: "#a0a0a0"}}>Error: {this.state.dialogMessage}</Text>}
					</View>
				</SafeAreaView>
			</ImageBackground>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	imgBackground: {
		flex: 1,
		width: "100%",
		height: "100%",
	},
	facebookButton: {
		backgroundColor: "#3B559A",
		color: "#fff",
	},
});

export default inject("movieStore", "authStore")(observer(SignInScreen));
