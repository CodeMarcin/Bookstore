import { LightningElement } from "lwc";

import basePath from "@salesforce/community/basePath";

import doLogin from "@salesforce/apex/UserAuthController.doLogin";
import registerUser from "@salesforce/apex/UserAuthController.registerUser";

import loginLabel from "@salesforce/label/c.login";
import passwordLabel from "@salesforce/label/c.passwordText";
import registerLabel from "@salesforce/label/c.register";
import noAccountLabel from "@salesforce/label/c.noaccounttext";
import forgotPasswordLabel from "@salesforce/label/c.forgotpasswordtext";

import WRONG_LOGIN_OR_PASSWORD_ERROR_LABEL from "@salesforce/label/c.WRONG_LOGIN_OR_PASSWORD_ERROR";

export default class ModuleSubLoginRegisterForm extends LightningElement {

	registerURL = basePath + "/new-account";
	
	loginText = loginLabel;
	passwordText = passwordLabel;
	registerText = registerLabel;
	noAccountText = noAccountLabel;
	forgotPasswordText = forgotPasswordLabel;

	loginInput;
	passwordInput;
	disableLoginButton = true;
	loginPasswordLength = { loginLength: null, passwordLength: null };

	error = false;
	errorMessage = null;

	firstName;
	lastName;
	userName;
	nickName;
	registerPassword;

	connectedCallback() {}

	handleLoginInput(event) {
		this.loginInput = event.target.value;
		this.loginPasswordLength = { ...this.loginPasswordLength, loginLength: event.target.value.length };
		this.checkLoginPasswordLength();
	}

	handlePasswordInput(event) {
		this.passwordInput = event.target.value;
		this.loginPasswordLength = { ...this.loginPasswordLength, passwordLength: event.target.value.length };
		this.checkLoginPasswordLength();
	}

	checkLoginPasswordLength() {
		this.disableLoginButton =
			this.loginPasswordLength.loginLength >= 5 && this.loginPasswordLength.passwordLength >= 8 ? false : true;
	}

	handleLoginButton(event) {
		event.preventDefault();
		doLogin({ username: this.loginInput, password: this.passwordInput })
			.then((result) => {
				this.error = false;
				console.log(result, "RE12SULT");
				// window.location = result;
				window.open(result, "_self");
			})
			.catch((error) => {
				this.error = true;
				this.errorMessage = WRONG_LOGIN_OR_PASSWORD_ERROR_LABEL;
			});
	}

	handleFirstName(event) {
		this.firstName = event.target.value;
	}

	handleLastName(event) {
		this.lastName = event.target.value;
	}

	handleUserName(event) {
		this.userName = event.target.value;
	}

	handleEmail(event) {
		this.email = event.target.value;
	}

	handleNickName(event) {
		this.nickName = event.target.value;
	}

	handleRegisterPassword(event) {
		this.registerPassword = event.target.value;
	}

	handleRegisterButton(event) {
		event.preventDefault();
		registerUser({
			firstName: this.firstName,
			lastName: this.lastName,
			userName: this.userName,
			email: this.email,
			communityNickname: this.nickName,
			password: this.registerPassword
		})
			.then((result) => {
				console.log(result, "RESULT");
			})
			.catch((error) => {
				this.error = error;
				this.errorMessage = error.body.message;
				console.log(this.error);
			});
	}
}
