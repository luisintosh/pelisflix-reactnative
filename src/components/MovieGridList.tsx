import React, {Component} from "react";
import {ActivityIndicator, Dimensions, FlatList, StyleSheet, View} from "react-native";
import {Stars} from "./Stars";
import {observer} from "mobx-react";
// components
import MovieGridItem from "./MovieGridItem";
// utils
import Log from "../utils/Log";

interface MovieGridListInterface {
	navigation: any;
	movies: any;
}

class MovieGridList extends Component<MovieGridListInterface> {
	// state
	state = {loading: false};
	itemWidth;
	itemHeight;

	constructor(props) {
		super(props);

		// calculate item dimensions
		const {itemWidth} = this._calculateColumns();
		this.itemWidth = itemWidth;
		this.itemHeight = this._aspectRatioHeightCalc(itemWidth);
	}

	/**
	 * Open a movie"s detail screen
	 * @private
	 * @param movieId
	 */
	_onPressItem(movieId) {
		Log.i(`A Flatlist item with ID (${movieId}) has been clicked`);
		this.props.navigation.navigate("Movie", {movieId});
	}

	/**
	 * Generate a list item
	 * @param item
	 * @returns {*}
	 * @private
	 */
	_renderItem({item}) {
		// Log.i(`Rendering Flatlist item with ID (${item.id})`);
		if (!item.poster_path) {
			item.poster_path = "https://www.pelisflix.info/wp-content/uploads/2019/04/no-cover-placeholder.png";
		}

		return (
			<MovieGridItem
				id={item.id}
				coverUri={item.poster_path}
				onPress={() => this._onPressItem(item.id)}
				width={this.itemWidth}
				height={this.itemHeight}
				vote_average={item.vote_average}
				stars={() => (<Stars voteAverage={item.vote_average}/>)}
			/>
		);
	}

	/**
	 * Render a loading component when flatlist is initializing
	 * @returns {*}
	 * @private
	 */
	_renderEmptyComponent() {
		Log.i("Rendering Empty component");

		return (
			<View style={{...styles.emptyContainer, height: this.itemHeight}}>
				<ActivityIndicator color={"red"}/>
			</View>
		);
	}

	render() {
		Log.i(`MovieGridList -> rendering ${this.props.movies.length} items`);
		const {numColumns} = this._calculateColumns();

		return (
			<View style={styles.container}>
				<FlatList
					ref="flatList"
					numColumns={numColumns}
					data={this.props.movies}
					keyExtractor={this._keyExtractor}
					renderItem={this._renderItem.bind(this)}
					ListEmptyComponent={this._renderEmptyComponent()}
					initialNumToRender={12}
				/>
			</View>
		);
	}

	// formula: (original height / original width) * new width = new height
	_aspectRatioHeightCalc(width) {
		const coverOriginalWidth = 1280;
		const coverOriginalHeight = 1920;
		return (coverOriginalHeight / coverOriginalWidth) * width;
	}

	/**
	 * Calculate list columns and item with
	 * @returns {{itemWidth: number; numColumns: number}}
	 * @private
	 */
	_calculateColumns() {
		const windowWidth = (Dimensions.get("window")).width;
		const itemMargin = 10;
		const numColumns = 3;
		const itemWidth = windowWidth / numColumns - itemMargin;

		return {numColumns, itemWidth};
	}

	/**
	 * Generate an ID for every item in a list
	 * @param item
	 * @param index
	 * @returns {*}
	 * @private
	 */
	_keyExtractor(item) {
		return `${item.id}`;
	}
}

export default observer(MovieGridList);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
	},
	progressBar: {
		height: 10,
		justifyContent: "center",
		alignItems: "stretch",
	},
	H2: {
		marginTop: 10,
		marginBottom: 10,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-end",
	},
	footerContainer: {
		margin: 10,
		flexDirection: "row",
		justifyContent: "center",
	},
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "stretch",
	},
});
