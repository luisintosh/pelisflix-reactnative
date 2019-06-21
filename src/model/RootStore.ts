import AuthStore from './AuthStore';
import MovieStore from "./MovieStore";
import PelisflixApi from '../services/pelisflix/PelisflixApi';

export default class RootStore {
  pelisflixApi: PelisflixApi;
  authStore;
  movieStore;

  constructor() {
    this.pelisflixApi = new PelisflixApi();
    this.authStore = new AuthStore(this);
    this.movieStore = new MovieStore(this);
  }
}
