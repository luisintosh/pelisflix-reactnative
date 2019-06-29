import React from "react";
import {StyleSheet} from "react-native";
import {View} from "native-base";
import {Ionicons} from "@expo/vector-icons";

/**
 * Generate stars
 * @param props
 * @returns {*}
 */
export const Stars = (props) => {
	const voteAvg = props.voteAverage;
	const max = 5;
	const shinyStars = Math.round(voteAvg / 2);
	const darkStars = max - shinyStars;

	let iconSize = 16;
	if (props.iconSize) {
		iconSize = props.iconSize;
	}

	return (
		<View style={styles.stars}>
			{Array(shinyStars).fill(0).map((v, i) => (<Ionicons key={i} name="md-star" size={iconSize} style={styles.shinyStar}/>))}
			{Array(darkStars).fill(0).map((v, i) => (<Ionicons key={i + 5} name="md-star-outline" size={iconSize} style={styles.darkStar}/>))}
		</View>
	);
};

const styles = StyleSheet.create({
	stars: {
		flexDirection: "row",
		marginTop: 5,
	},
	shinyStar: {
		color: "#ff5f61",
	},
	darkStar: {
		color: "#000",
	},
});
