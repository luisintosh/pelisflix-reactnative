import PelisflixApi, {UserInterface} from "../../services/pelisflix/PelisflixApi";
import {action, observable} from "mobx";

export default class AuthStore {
	@observable user: UserInterface;
	@observable jwt;
	pelisflixApi: PelisflixApi;

	constructor(pelisflixApi) {
		this.pelisflixApi = pelisflixApi;
	}

	/**
	 * Login user with stored JWT
	 * @returns {Promise<*>|Promise<* | AxiosResponse<any> | never>}
	 */
	@action
	loginUser() {
		return this.pelisflixApi.getStoredJWT()
			.then(() => this.pelisflixApi.getCurrentUser())
			.then(this.setUserModel);
	}

	/**
	 * Authenticate user with access_token
	 * @param accessToken
	 * @returns {Promise<*>|Promise<* | never>}
	 */
	@action
	authUser(accessToken) {
		return this.pelisflixApi.login(accessToken)
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
