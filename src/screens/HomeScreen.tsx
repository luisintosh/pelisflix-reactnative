import React from 'react'
import {inject, observer} from "mobx-react";
import {Container, Header, Content, Tab, Tabs, Text, ScrollableTab} from 'native-base';
import MovieGridList from '../components/MovieGridList'

interface HomeScreenInterface {
  rootStore: any,
  navigation: any,
}

@observer
class HomeScreen extends React.Component<HomeScreenInterface> {

  _renderTabs() {
    return this.props.rootStore.movieStore.genres.map(genre => {
      // console.log(this.props.rootStore.movieStore.movies[0]);
      const movies = this.props.rootStore
        .movieStore
        .movies
        .filter(m => m.genres.find(g => g.id === genre.id));

      return (
        <Tab key={genre.tmdb_id} heading={genre.name}>
          <MovieGridList
            navigation={this.props.navigation}
            movies={movies}
          />
        </Tab>
      );
    });
  }

  render() {
    return (
      <Container>
        <Tabs renderTabBar={() => <ScrollableTab />}>
          {this._renderTabs()}
        </Tabs>
      </Container>
    );
  }
}

export default inject('rootStore')(HomeScreen);
