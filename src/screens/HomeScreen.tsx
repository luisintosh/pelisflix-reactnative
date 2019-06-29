import React from "react";
import {inject, observer} from "mobx-react";
import {Button, Container, Header, Icon, Input, Item, ScrollableTab, Tab, Tabs, Text, View} from "native-base";
import MovieGridList from "../components/MovieGridList";
import {StyleSheet} from "react-native";
import MovieStore from "../store/MovieStore";
import AuthStore from "../store/AuthStore";
import * as FacebookAds from "expo-ads-facebook";
import Log from "../utils/Log";

interface HomeScreenInterface {
	movieStore: MovieStore;
	authStore: AuthStore;
	navigation: any;
}

class HomeScreen extends React.Component<HomeScreenInterface> {

	state = {
		filter: "",
		movies: [],
	};

	componentDidMount(): void {
		this._filterBySearchTerm("");
		this._showFBAds();
	}

	_showFBAds() {
		return FacebookAds.InterstitialAdManager
			.showAd("449969829167954_449972429167694")
			.catch(error => Log.e("MovieScreen :: " + error.toString()));
	}

	/**
	 * Filter
	 * @private
	 */
	_filterBySearchTerm(filter) {
		const movies = this.props
			.movieStore
			.movies
			.filter(m => m.title.indexOf(filter) >= 0);

		this.setState({
			filter,
			movies,
		});
	}

	/**
	 * Tabs
	 * @private
	 */
	_renderTabs() {
		return this.props.movieStore.genres.map(genre => {
			// console.log(this.state.movies[0]);
			// console.log(genre);
			const movies = this.state.movies
				.filter(m => m.genres.find(mg => mg === genre.id));

			return (
				<Tab key={genre.tmdb_id} heading={genre.name} tabStyle={{backgroundColor: "#F44336"}}
						 activeTabStyle={{backgroundColor: "#D32F2F"}} textStyle={{color: "#FFF"}}>
					<View style={styles.container}>
						<MovieGridList
							navigation={this.props.navigation}
							movies={movies}
						/>
					</View>
				</Tab>
			);
		});
	}

	render() {
		// @ts-ignore
		return (
			<Container style={styles.container}>
				<Header searchBar rounded style={{backgroundColor: "#F44336"}}>
					<Item>
						<Icon name="ios-search"/>
						<Input placeholder="Buscar" onChangeText={text => this._filterBySearchTerm(text)}/>
					</Item>
					<Button transparent>
						<Text>Search</Text>
					</Button>
				</Header>
				<Tabs renderTabBar={() => <ScrollableTab/>}>
					<Tab heading={"Todos"} tabStyle={{backgroundColor: "#F44336"}} activeTabStyle={{backgroundColor: "#D32F2F"}} textStyle={{color: "#FFF"}}>
						<View style={styles.container}>
							<MovieGridList
								navigation={this.props.navigation}
								movies={this.state.movies}
							/>
						</View>
					</Tab>
					{this._renderTabs()}
				</Tabs>
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default inject("movieStore", "authStore")(observer(HomeScreen));
