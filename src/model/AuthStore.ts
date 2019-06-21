import PelisflixApi, {UserInterface} from '../services/pelisflix/PelisflixApi';
import {observable, action} from 'mobx';

export default class AuthStore {
  @observable user: UserInterface;
  @observable jwt;
  pelisflixApi: PelisflixApi;

  // root
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    this.pelisflixApi = rootStore.pelisflixApi;
  }

  /**
   * Login user with stored JWT
   * @returns {Promise<*>|Promise<* | AxiosResponse<any> | never>}
   */
  @action
  loginUser() {
    return this.pelisflixApi.getStoredJWT()
      .then(jwt => this.pelisflixApi.getCurrentUser())
      .then(this.setUserModel);
  }

  /**
   * Authenticate user with access_token
   * @param access_token
   * @returns {Promise<*>|Promise<* | never>}
   */
  @action
  authUser(access_token) {
    return this.pelisflixApi.login(access_token)
      .then(this.setUserModel);
  }

  /**
   * Set user
   * @param user
   */
  @action.bound
  setUserModel(user) {
    this.user = user;
  }
}
