import React from 'react'
import {ActivityIndicator, Dimensions, ScrollView, StyleSheet} from 'react-native'
import {View, Text, ListItem, List, Badge, H1, H2, Right, Button, Body, Icon, Left, Spinner} from 'native-base'
import {Image} from "react-native-expo-image-cache"
import {Stars} from "../components/Stars";
import Log from "../utils/Log";
import {WebBrowser} from "expo/build/deprecated.web";
import PelisflixApi from "../services/pelisflix/PelisflixApi";

import Colors from '../theme/colors';

interface MovieScreenInterface {
  navigation: any,
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
    this.movieId = this.props.navigation.getParam('movieId', null);

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
        })
        .catch(error => {
          if (error.toString().indexOf('Request failed')) {
            this.props.navigation.navigate('AuthLoading');
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

  _getDim() {
    const windowWidth = (Dimensions.get('window')).width;
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
      domainName = domainName.replace('www.', '');
      domainName = domainName.indexOf('googleapis.com') >= 0 ? 'google.com' : domainName;

      let lang = v.lang.toUpperCase();
      lang = lang === 'ES_LA' ? 'LA' : lang;

      return (
        <ListItem key={v.id} onPress={() => this._onPressServerItem(url)} icon>
          <Body><Text style={styles.text}>{domainName}</Text></Body>
          <Right>
            <Badge><Text>{lang}</Text></Badge>
          </Right>
        </ListItem>
      );
    });
  }

  async _onPressServerItem(url) {
    try {
      await WebBrowser.openBrowserAsync(url, {
        toolbarColor: '#000',
        showTitle: false,
      });
    } catch (e) {
      Log.e(e);
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.centerContainer}>
          <Spinner color={Colors.primary} />
        </View>
      );
    }

    if (!this.state.movie) {
      return (
        <View style={styles.centerContainer}>
          <H2 style={styles.text}>Error!</H2>
        </View>
      );
    }

    const preview = 'https://www.pelisflix.info/wp-content/uploads/2019/04/movie-cover-placeholder.png';
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
          <H1 style={styles.text}>{this.state.movie.title} ({releaseYear.getFullYear()})</H1>

          <ScrollView style={styles.genres} horizontal={true}>
            {this._renderGenres()}
          </ScrollView>

          <H2 style={styles.text}>Sinopsis</H2>
          <Text style={styles.text}>{this.state.movie.overview}</Text>

          <View style={{height: 20}} />

          <H2 style={styles.text}>Calificación</H2>
          <Stars voteAverage={this.state.movie.vote_average} iconSize={32} />

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
    backgroundColor: Colors.background,
  },
  text: {
    color: Colors.text
  },
  genres: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 15,
  },
  genre: {
    marginRight: 7,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  }
});
