import React from "react";
import {Dimensions, ScrollView, StyleSheet} from "react-native";
import {Badge, Body, H1, H2, List, ListItem, Right, Spinner, Text, View} from "native-base";
import {Image} from "react-native-expo-image-cache";
import {Stars} from "../components/Stars";
import Log from "../utils/Log";
import * as WebBrowser from "expo-web-browser";
import PelisflixApi from "../services/pelisflix/PelisflixApi";

import * as FacebookAds from "expo-ads-facebook";

import MovieStore from "../store/MovieStore";
import AuthStore from "../store/AuthStore";

import {Analytics, PageHit, Event} from "expo-analytics";
import {Env} from "../env";

interface MovieScreenInterface {
	movieStore: MovieStore;
	authStore: AuthStore;
	navigation: any;
}

export default class MovieScreen extends React.Component<MovieScreenInterface> {
	state = {
		loading: true,
		movie: null,
	};
	// movie id
	movieId;
	// backdrop path
	backdropDim;
	// pelisflix api
	pelisflixApi;

	constructor(props) {
		super(props);
		// Get movie from props
		this.movieId = this.props.navigation.getParam("movieId", null);

		this._getDim();
		this.pelisflixApi = new PelisflixApi();
	}

	componentDidMount(): void {
		if (this.movieId) {
			this.pelisflixApi.getStoredJWT()
				.then(() => this.pelisflixApi.getCurrentUser())
				.then(() => this.pelisflixApi.getMovie(this.movieId))
				.then(movie => {
					this.setState({
						loading: false,
						movie,
					});

					const analytics = new Analytics(Env.GoogleAnalytics);
					return analytics.hit(new PageHit(`${movie.title}`));
				})
				.catch(error => {
					Log.e("MovieScreen :: " + error.toString());
					if (error.toString().indexOf("Request failed") >= 0) {
						this.props.navigation.navigate("AuthLoading");
					} else {
						this.setState({
							loading: false,
							movie: null,
						});
					}
				});
		} else {
			this.setState({
				loading: false,
				movie: null,
			});
		}
	}

	_showFBAds() {
		return FacebookAds.InterstitialAdManager
			.showAd(Env.FacebookInterstitialAdManager)
			.catch(error => Log.e("MovieScreen :: " + error.toString()));
	}

	_getDim() {
		const windowWidth = (Dimensions.get("window")).width;
		this.backdropDim = {
			width: windowWidth,
			height: this._aspectRatioHeightCalc(windowWidth),
		};
	}

	_renderGenres() {
		const genres = this.state.movie.genres;
		return genres.map((g, index) => (<Badge key={index} style={styles.genre}><Text>{g.name}</Text></Badge>));
	}

	_renderLinks() {
		const videos = this.state.movie.videos;
		return videos.map((v) => {
			const url = v.url;
			const domainMatches = url.match(/^https?\:\/\/([^\/:?#]+)(?:[\/:?#]|$)/i);
			let domainName = domainMatches[1];
			domainName = domainName.replace("www.", "");
			domainName = domainName.indexOf("googleapis.com") >= 0 ? "google.com" : domainName;

			let lang = v.lang.toUpperCase();
			lang = lang === "ES_LA" ? "LA" : lang;

			return (
				<ListItem key={v.id} onPress={() => this._onPressServerItem(url)} icon>
					<Body><Text>{domainName}</Text></Body>
					<Right>
						<Badge><Text>{lang}</Text></Badge>
					</Right>
				</ListItem>
			);
		});
	}

	async _onPressServerItem(url) {

		// urls shortener with ads
		// url = "http://adf.ly/11249279/" + url;

		const analytics = new Analytics(Env.GoogleAnalytics);
		analytics.event(new Event('Video', 'Play', this.state.movie.title))
			.then(() => Log.i('Sent to analytics'))
			.catch(e => Log.e(`Analytics: ${e.message}`));

		try {
			await WebBrowser.openBrowserAsync(url, {
				toolbarColor: "#000",
				showTitle: false,
			});
			this._showFBAds();
		} catch (e) {
			Log.e(e);
		}
	}

	render() {
		if (this.state.loading) {
			return (
				<View style={styles.centerContainer}>
					<Spinner/>
				</View>
			);
		}

		if (!this.state.movie) {
			return (
				<View style={styles.centerContainer}>
					<H2>Error!</H2>
				</View>
			);
		}

		const preview = "https://www.pelisflix.info/wp-content/uploads/2019/04/movie-cover-placeholder.png";
		const image = this.state.movie.backdrop_path || this.state.movie.poster_path;
		const releaseYear = new Date(this.state.movie.release_date);

		return (
			<ScrollView>
				<Image
					preview={{uri: preview}}
					uri={image}
					style={this.backdropDim}
				/>
				<View style={styles.container}>
					<H1>{this.state.movie.title} ({releaseYear.getFullYear()})</H1>

					<ScrollView style={styles.genres} horizontal={true}>
						{this._renderGenres()}
					</ScrollView>

					<H2>Sinopsis</H2>
					<Text>{this.state.movie.overview}</Text>

					<View style={{height: 20}}/>

					<H2>Calificación</H2>
					<Stars voteAverage={this.state.movie.vote_average} iconSize={32}/>

					<View style={{height: 20}}/>

					<List>
						<ListItem itemHeader first>
							<Text>Lista de servidores</Text>
						</ListItem>
						{this._renderLinks()}
					</List>
				</View>
			</ScrollView>
		);
	}

	// formula: (original height / original width) * new width = new height
	_aspectRatioHeightCalc(width) {
		const coverOriginalWidth = 500;
		const coverOriginalHeight = 281;
		return (coverOriginalHeight / coverOriginalWidth) * width;
	}
}

const styles = StyleSheet.create({
	container: {
		padding: 10,
	},
	genres: {
		flexDirection: "row",
		marginTop: 10,
		marginBottom: 15,
	},
	genre: {
		marginRight: 7,
	},
	centerContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
