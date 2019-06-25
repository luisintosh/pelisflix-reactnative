import React from 'react'
import {inject, observer} from "mobx-react";
import {Container, Header, Content, Tab, Tabs, Text, ScrollableTab, Item, Icon, Input, Button} from 'native-base';
import MovieGridList from '../components/MovieGridList'

interface HomeScreenInterface {
  rootStore: any,
  navigation: any,
}

@observer
class HomeScreen extends React.Component<HomeScreenInterface> {

  state = {
    filter: '',
    movies: [],
  };

  componentDidMount(): void {
    this._filterBySearchTerm('');
  }

  /**
   * Filter
   * @private
   */
  _filterBySearchTerm(filter) {
    const movies = this.props.rootStore
      .movieStore
      .movies
      .filter(m => m.title.indexOf(filter) >= 0);

    this.setState({
      filter,
      movies
    });
  }

  /**
   * Tabs
   * @private
   */
  _renderTabs() {
    return this.props.rootStore.movieStore.genres.map(genre => {
      // console.log(this.props.rootStore.movieStore.movies[0]);
      const movies = this.state.movies
        .filter(m => m.genres.find(mg => mg.id === genre.id));

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
        <Header searchBar rounded>
          <Item>
            <Icon name="ios-search" />
            <Input placeholder="Buscar" onChangeText={text => this._filterBySearchTerm(text)} />
          </Item>
          <Button transparent>
            <Text>Search</Text>
          </Button>
        </Header>
        <Tabs renderTabBar={() => <ScrollableTab />}>
          <Tab heading={'Todos'}>
            <MovieGridList
              navigation={this.props.navigation}
              movies={this.state.movies}
            />
          </Tab>
          {this._renderTabs()}
        </Tabs>
      </Container>
    );
  }
}

export default inject('rootStore')(HomeScreen);
