import axios, {AxiosRequestConfig, AxiosPromise, AxiosInstance} from 'axios';
import * as SecureStore from 'expo-secure-store';
import { AsyncStorage } from 'react-native';
import Log from "../../utils/Log";

export default class PelisflixApi {

  /**
   * Configurable AXIOS options.
   */
  config: AxiosRequestConfig;

  axios: AxiosInstance;

  constructor() {
    this.config = {
      // `baseURL` will be prepended to `url` unless `url` is absolute.
      baseURL: 'https://pelisflix.herokuapp.com',
      // `headers` are custom headers to be sent
      headers: {'Accept': 'application/json'},
    };
    this.axios = axios.create(this.config);
  }

  /**
   * Get stored JWT
   * @returns {Promise<null|*>}
   */
  async getStoredJWT() {
    const jwt = await SecureStore.getItemAsync('jwt');
    if (jwt) {
      this.axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
      return jwt;
    } else {
      return null;
    }
  }

  /**
   * Facebook login
   * @param access_token
   * @returns {Promise<*>}
   */
  async login(access_token): Promise<UserInterface> {
    this.axios.defaults.headers.common['Authorization'] = '';
    const response = await this.axios.get('/auth/facebook/callback?access_token='+access_token);

    this.axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.jwt}`;

    await SecureStore.setItemAsync('jwt', response.data.jwt);
    return response.data.user;
  }

  /**
   * Delete JWT key
   */
  async logout() {
    await SecureStore.setItemAsync('jwt', null);
  }

  /**
   * Get current user
   * @returns {AxiosPromise<any>}
   */
  async getCurrentUser(): Promise<UserInterface> {
    await this.getStoredJWT();
    const user = await this.axios.get(`/users/me`);
    return user.data;
  }

  async getAllGenres(force = false) {
    let genreList = [];
    // get the next check time
    const now = new Date().getTime();
    const aMonth = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    const nextGenreCheck = await AsyncStorage.getItem('nextGenreCheck');
    const nmCheck = nextGenreCheck !== null ? parseInt(nextGenreCheck) : 0;

    if (now >= nmCheck || force) {
      const response = await this.axios.get('/genres'); // request

      if (Array.isArray(response.data)) {
        genreList = response.data;
        await AsyncStorage.setItem('genreList', JSON.stringify(genreList)); // save
        await AsyncStorage.setItem('nextGenreCheck', `${now + aMonth}`); // save last check time
      }
    } else {
      const response = await AsyncStorage.getItem('genreList'); // get from local
      genreList = JSON.parse(response);
    }

    return genreList;
  }

  /**
   * Get all movies from local storage updated every 24 hours
   * @param force
   */
  async getAllMovies(force = false) {
    let movieList = [];
    // get the next check time
    const now = new Date().getTime();
    const aDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const nextMovieCheck = await AsyncStorage.getItem('nextMovieCheck');
    const nmCheck = nextMovieCheck !== null ? parseInt(nextMovieCheck) : 0;

    if (now >= nmCheck || force) {
      const response = await this.axios.get('/movies/all'); // request

      if (Array.isArray(response.data)) {
        movieList = response.data;
        await AsyncStorage.removeItem('movieList');
        await AsyncStorage.setItem('movieList', JSON.stringify(movieList)); // save
        await AsyncStorage.setItem('nextMovieCheck', `${now + aDay}`); // save last check time
        Log.i('Movies loaded from remote: ' + movieList.length);
      }
    } else {
      const response = await AsyncStorage.getItem('movieList'); // get from local
      movieList = JSON.parse(response);
      Log.i('Movies loaded from local: ' + movieList.length);
    }

    return movieList;
  }

  /**
   * Get Movies
   * @param title
   * @param page
   * @param categoryId
   * @param limit
   * @returns {Promise<AxiosPromise<any>>}
   */
  /*async getMovies({title = null, genreId = null, orderBy = 'date', page = 0, limit = 100}: MovieFinderInterface) {
    const start = page * limit;

    const params: any = {};
    params._limit = limit;
    params._start = start;
    if (orderBy) {
      switch (orderBy) {
        case 'popularity':
          params._sort = 'vote_average:DESC';
          break;
        case 'date':
        default:
          params._sort = 'release_date:DESC';
          break;
      }
    }
    if (genreId) {
      params.genres_in = genreId;
    }
    if (title) {
      params.title_contains = title;
    }

    Log.i(`PelisflixApi: url: '/movies', params: ${JSON.stringify(params)}`);

    const response = await this.axios.get('/movies', {
      params
    });

    Log.i(response.data.length);

    return response.data;
  }*/

  async getMovie(movieId) {
    const endpoint = '/movies/' + movieId;
    const response = await this.axios.get(endpoint);
    return response.data;
  }
}

export interface UserInterface {
  id: string,
  socialId: string,
  username: string,
  email: string,
  provider: string,
  confirmed: false,
  blocked: false,
  role: {
    id: string,
    name: string,
    description: string,
    type: string,
    permissions: [
      string
      ],
    users: [
      string
      ]
  }
}

export interface MovieFinderInterface {
  title?: string,
  genreId?: string,
  orderBy?: string,
  page: number,
  limit?: number
}
