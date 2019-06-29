import AuthStore from "../store/AuthStore";
import MovieStore from "../store/MovieStore";
import PelisflixApi from "../services/pelisflix/PelisflixApi";

export default function () {
	const pelisflixApi = new PelisflixApi();
	const authStore = new AuthStore(pelisflixApi);
	const movieStore = new MovieStore(pelisflixApi);

	return {
		authStore,
		movieStore,
	};
}
