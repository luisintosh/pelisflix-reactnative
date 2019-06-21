import {observable, action, runInAction} from 'mobx'
import PelisflixApi from "../services/pelisflix/PelisflixApi";

export default class MovieStore {
  @observable movies = [];
  @observable genres = [];
  @observable loading = false;
  pelisflixApi: PelisflixApi;
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    this.pelisflixApi = rootStore.pelisflixApi;
  }

  @action
  loadMovies() {
    this.loading = true;
    // load genres and movies
    return this.pelisflixApi.getAllGenres().then(genres => {
      return this.pelisflixApi.getAllMovies().then(movies => runInAction(() => {
        this.genres = genres;
        this.movies = movies;
        this.loading = false;
      }))
    });
  }
}
