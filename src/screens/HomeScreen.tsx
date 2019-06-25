import React from 'react'
import {inject, observer} from "mobx-react";
import {Container, Header, Content, Tab, Tabs, Text, ScrollableTab, Item, Icon, Input, Button, View} from 'native-base';
import MovieGridList from '../components/MovieGridList'
import Colors from '../theme/colors';
import {StyleSheet} from "react-native";

interface HomeScreenInterface {
  rootStore: any,
  navigation: any,
}

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
      //console.log(this.state.movies[0]);
      // console.log(genre);
      const movies = this.state.movies
        .filter(m => m.genres.find(mg => mg === genre.id));

      return (
        <Tab key={genre.tmdb_id} heading={genre.name} tabStyle={styles.topBackground} textStyle={styles.topText} activeTabStyle={styles.topBackground}>
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
        <Header searchBar rounded style={styles.topBackground}>
          <Item>
            <Icon name="ios-search" />
            <Input placeholder="Buscar" onChangeText={text => this._filterBySearchTerm(text)} />
          </Item>
          <Button transparent>
            <Text>Search</Text>
          </Button>
        </Header>
        <Tabs renderTabBar={() => <ScrollableTab />}>
          <Tab heading={'Todos'} tabStyle={styles.topBackground} textStyle={styles.topText} activeTabStyle={styles.topBackground}>
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
    backgroundColor: Colors.background
  },
  topBackground: {
    backgroundColor: Colors.black
  },
  topText: {
    color: Colors.text
  }
});

export default inject('rootStore')(observer(HomeScreen));
