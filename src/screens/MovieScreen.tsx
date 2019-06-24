import React from 'react'
import {Dimensions, ScrollView, StyleSheet} from 'react-native'
import {View, Text, ListItem, List, Badge, H1, H2, Right, Button, Body, Icon, Left} from 'native-base'
import {Image} from "react-native-expo-image-cache"
import {Stars} from "../components/Stars";
import Log from "../utils/Log";
import {WebBrowser} from "expo/build/deprecated.web";

interface MovieScreenInterface {
  navigation: any,
}

export default class MovieScreen extends React.Component<MovieScreenInterface> {
  // movie object
  movie;
  // backdrop path
  backdropDim;

  constructor(props) {
    super(props);
    // Get movie from props
    this.movie = this.props.navigation.getParam('movie', {});

    this._getDim();
  }

  _getDim() {
    const windowWidth = (Dimensions.get('window')).width;
    this.backdropDim = {
      width: windowWidth,
      height: this._aspectRatioHeightCalc(windowWidth),
    };
  }

  _renderGenres() {
    const genres = this.movie.genres;
    return genres.map((g, index) => (<Badge key={index} style={styles.genre}><Text>{g.name}</Text></Badge>));
  }

  _renderLinks() {
    const links = this.movie.videos;
    return links.map((l) => {
      const url = l.url;
      const domainMatches = url.match(/^https?\:\/\/([^\/:?#]+)(?:[\/:?#]|$)/i);
      let domainName = domainMatches[1];
      domainName = domainName.replace('www.', '');
      domainName = domainName.indexOf('googleapis.com') >= 0 ? 'google.com' : domainName;

      return (
        <ListItem key={l.id} onPress={() => this._onPressServerItem(url)} icon>
          <Body><Text>{domainName}</Text></Body>
          <Right>
            <Button bordered iconLeft small>
              <Icon name="md-thumbs-up"/>
              <Text>{l.likes}</Text>
            </Button>
            <Button bordered iconLeft small>
              <Icon name="md-thumbs-down"/>
              <Text>{l.dislikes}</Text>
            </Button>
          </Right>
        </ListItem>
      );
    });
  }

  async _onPressServerItem(serverUrl) {
    try {
      await WebBrowser.openBrowserAsync(serverUrl, {
        toolbarColor: '#000',
        showTitle: false,
      });
    } catch (e) {
      Log.e(e);
    }
  }

  render() {
    if (!this.movie || !this.movie.title) {
      return (
        <H2>Error!</H2>
      );
    }

    const preview = 'https://www.pelisflix.info/wp-content/uploads/2019/04/movie-cover-placeholder.png';
    const image = this.movie.backdrop_path || this.movie.poster_path;
    const releaseYear = new Date(this.movie.release_date);

    return (
      <ScrollView>
        <Image
          preview={{uri: preview}}
          uri={image}
          style={this.backdropDim}
        />
        <View style={styles.container}>
          <H1>{this.movie.title} ({releaseYear.getFullYear()})</H1>

          <ScrollView style={styles.genres} horizontal={true}>
            {this._renderGenres()}
          </ScrollView>

          <H2>Sinopsis</H2>
          <Text>{this.movie.overview}</Text>

          <View style={{height: 20}} />

          <H2>Calificación</H2>
          <Stars voteAverage={this.movie.vote_average} iconSize={32} />

          <View style={{height: 20}} />

          <List>
            <ListItem itemHeader first>
              <Text>Lista de servidores</Text>
            </ListItem>
            {this._renderLinks()}
          </List>
        </View>
      </ScrollView>
    );
  };

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
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 15,
  },
  genre: {
    marginRight: 7,
  }
});
