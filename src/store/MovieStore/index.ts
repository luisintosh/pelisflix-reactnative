import PelisflixApi from "../../services/pelisflix/PelisflixApi";
import {action, observable, runInAction} from "mobx";

export default class MovieStore {
	@observable movies = [];
	@observable genres = [];
	@observable loading = false;
	pelisflixApi: PelisflixApi;

	constructor(pelisflixApi) {
		this.pelisflixApi = pelisflixApi;
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
			}));
		});
	}
}
