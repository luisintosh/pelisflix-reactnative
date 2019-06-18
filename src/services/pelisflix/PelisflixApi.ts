import axios, {AxiosRequestConfig, AxiosPromise, AxiosInstance} from 'axios';
import { SecureStore } from 'expo';
import Log from "../../utils/Log";

export default class PelisflixApi {

  /**
   * Configurable AXIOS options.
   */
  config: AxiosRequestConfig;

  axios: AxiosInstance;

  currentUser: UserInterface;

  constructor() {
    this.config = {
      // `baseURL` will be prepended to `url` unless `url` is absolute.
      baseURL: 'https://pelisflix.herokuapp.com',
      // `headers` are custom headers to be sent
      headers: {'Accept': 'application/json'},
    };
    this.axios = axios.create(this.config);
    this.getStoredJWT();
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
    const user = await this.axios.get(`/users/me`);
    this.currentUser = user.data;
    return this.currentUser;
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
   * Get Movies
   * @param title
   * @param page
   * @param categoryId
   * @param limit
   * @returns {Promise<AxiosPromise<any>>}
   */
  async getMovies({title = null, genreId = null, orderBy = 'date', page = 0, limit = 9}: MovieFinderInterface) {
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
