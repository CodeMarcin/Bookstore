import { LightningElement, track, wire } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import isGuest from "@salesforce/user/isGuest";
import userId from "@salesforce/user/Id";
import basePath from "@salesforce/community/basePath";

import getProfileOverviewApex from "@salesforce/apex/UserInfoController.getProfileOverview";

import getBookForPreOrder from "@salesforce/apex/BookController.getBookForPreOrder";
import submitOrderApex from "@salesforce/apex/BookController.submitOrder";

import FIELD_CANNOT_BE_EMPTY_ERROR from "@salesforce/label/c.FIELD_CANNOT_BE_EMPTY_ERROR";
import EMAIL_FIELD_NOT_VALID_ERROR from "@salesforce/label/c.EMAIL_FIELD_NOT_VALID_ERROR";
import PHONE_FIELD_VALID_ERROR from "@salesforce/label/c.PHONE_FIELD_VALID_ERROR";
import POSTAL_CODE_VALID_ERROR from "@salesforce/label/c.POSTAL_CODE_VALID_ERROR";

import noItemsToDisplayLabel from "@salesforce/label/c.NoItemsToDisplayText";

import firstNameLabel from "@salesforce/label/c.FirstNameText";
import lastNameLabel from "@salesforce/label/c.LastNameText";
import emailLabel from "@salesforce/label/c.EmailText";
import phoneLabel from "@salesforce/label/c.PhoneText";
import streetLabel from "@salesforce/label/c.StreetText";
import postalCodeLabel from "@salesforce/label/c.PostalCodeText";
import cityLabel from "@salesforce/label/c.CityText";
import stateLabel from "@salesforce/label/c.StateText";

import titleLabel from "@salesforce/label/c.titletext";
import priceLabel from "@salesforce/label/c.pricetext";
import quantityLabel from "@salesforce/label/c.quantitytext";
import totalPriceLabel from "@salesforce/label/c.totalpricetext";
import deleteLabel from "@salesforce/label/c.deletetext";
import submitOrderLabel from "@salesforce/label/c.submitordertext";

import deleteIcn from "@salesforce/resourceUrl/deleteIcon";

export default class ModuleSubUserShoppingCart extends LightningElement {
	noItemsToDisplayText = noItemsToDisplayLabel;

	firstNameText = firstNameLabel;
	lastNameText = lastNameLabel;
	emailText = emailLabel;
	phoneText = phoneLabel;
	streetText = streetLabel;
	postalCodeText = postalCodeLabel;
	cityText = cityLabel;
	stateText = stateLabel;

	titleText = titleLabel;
	priceText = priceLabel;
	quantityText = quantityLabel;
	totalPriceText = totalPriceLabel;
	deleteText = deleteLabel;
	submitOrderText = submitOrderLabel;

	deleteIcon = deleteIcn;

	@track userData = [];

	allOrderData = [];
	filteredOrderData;
	listOfBooksId;

	@track booksData;
	booksDataLength;
	error;

	@track inputsValue = {};
	inputsError = {};
	inputsArray = [];

	userOrderData = {};

	showGuestOrderStatus = false;
	guestOrderId;
	guestOrderPIN;
	guestOrderHref = basePath + "/guest-order";

	get orderTotalPrice() {
		let totalPrice = 0;

		for (const el of this.booksData) {
			totalPrice += el.price * el.quantity;
		}
		let totalPriceNumberFormat = new Intl.NumberFormat("en-Us");
		return totalPriceNumberFormat.format(totalPrice);
	}

	get books() {
		return this.booksData?.map((el) => ({
			id: el.bookId,
			title: el.title,
			price: el.price,
			image: el.image,
			quantity: el.quantity,
			totalPrice: (el.price * el.quantity).toFixed(2),
			amount: el.amount,
			href: basePath + "/book-detail?Id=" + el.bookId,
			handleChangQuantity: (event) => {
				if (event.target.value < 1) {
					event.target.value = 1;
				} else if (event.target.value > el.amount) {
					event.target.value = el.amount;
				}

				this.booksData = this.booksData?.map((item) => {
					if (item.bookId === el.bookId) {
						return { ...item, quantity: event.target.value };
					}
					return item;
				});
			},
			handleDeleteItem: () => {
				let removeItemKey;
				this.booksData = this.booksData.filter((item) => {
					return item.bookId !== el.bookId;
				});
				if (isGuest) {
					removeItemKey = "ORDER_BOOK_ID_" + el.bookId + "_USER_ID_guest";
				} else {
					removeItemKey = "ORDER_BOOK_ID_" + el.bookId + "_USER_ID_" + userId;
				}
				window.localStorage.removeItem(removeItemKey);
				this.assignBooksDataLenght();
			}
		}));
	}

	get users() {
		return this.userData?.map((el) => ({
			Id: el.Id,
			firstName: el.FirstName,
			lastName: el.LastName,
			email: el.Email,
			phone: el.Phone,
			street: "street",
			city: "city",
			postalCode: "postalCode",
			state: "state"
		}));
	}

	connectedCallback() {
		this.getOrderData();
		this.filterOrderData();
		this.setListOfBooksId();
		if (this.listOfBooksId) {
			getBookForPreOrder({ idSet: this.listOfBooksId })
				.then((result) => {
					this.booksData = this.filteredOrderData.map((el) => {
						return { bookId: el.bookId, quantity: el.quantity };
					});
					for (let i = 0; i < this.booksData.length; i++) {
						for (const el of result) {
							if (el.Id === this.booksData[i].bookId) {
								this.booksData[i] = {
									...this.booksData[i],
									price: el.Discount_Price__c ?? el.Price__c,
									title: el.Title__c,
									amount: el.Amount__c,
									image: el.Image__c
								};
							}
						}
					}

					this.assignBooksDataLenght();
				})
				.catch((error) => {
					this.error = error;
					console.log(error);
				});
		}

		if (isGuest) {
			this.userData = [
				{
					Id: "Some_guest",
					FirstName: "",
					LastName: "",
					Email: "",
					Phone: ""
				}
			];
			this.assignInputValueError();
			console.log(this.userData);
		} else {
			getProfileOverviewApex({ userId: userId })
				.then((result) => {
					this.userData = result;
					this.assignInputValueError();
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}

	getOrderData() {
		const keys = Object.keys(localStorage);
		let i = keys.length;

		while (i--) {
			if (localStorage.key([i]).slice(0, 5) === "ORDER") {
				this.allOrderData.push(JSON.parse(localStorage.getItem(keys[i])));
			}
		}
	}

	filterOrderData() {
		this.filteredOrderData = this.allOrderData.filter((el) => {
			if (isGuest) {
				return el.userId === "guest";
			}
			return el.userId === userId;
		});
	}

	setListOfBooksId() {
		this.listOfBooksId = this.filteredOrderData.map((el) => {
			return el.bookId;
		});
	}

	assignBooksDataLenght() {
		if (this.booksData.length === 0) {
			this.booksDataLength = false;
		} else {
			this.booksDataLength = true;
		}
	}

	assignInputValueError() {
		for (const [key, value] of Object.entries(this.users[0])) {
			const upperKey = "user" + key.charAt(0).toUpperCase() + key.slice(1);
			this.inputsValue = { ...this.inputsValue, [upperKey]: value };
			this.inputsError = { ...this.inputsError, [upperKey]: "" };
		}
	}

	checkInputs(event) {
		const inputName = event.target.getAttribute("name");
		const inputValue = event.target.value;

		this.inputsValue = { ...this.inputsValue, [inputName]: inputValue };

		switch (inputName) {
			case "userFirstName":
				if (this.inputsValue[inputName].length < 1) {
					this.addInputError(inputName, FIELD_CANNOT_BE_EMPTY_ERROR);
				} else {
					this.deleteInputError(inputName);
				}
				break;

			case "userLastName":
				if (this.inputsValue[inputName].length < 1) {
					this.addInputError(inputName, FIELD_CANNOT_BE_EMPTY_ERROR);
				} else {
					this.deleteInputError(inputName);
				}
				break;

			case "userEmail":
				if (this.inputsValue[inputName].length < 1) {
					this.addInputError(inputName, FIELD_CANNOT_BE_EMPTY_ERROR);
				} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.inputsValue[inputName])) {
					this.addInputError(inputName, EMAIL_FIELD_NOT_VALID_ERROR);
				} else {
					this.deleteInputError(inputName);
				}
				break;

			case "userPhone":
				if (this.inputsValue[inputName].length < 1) {
					this.addInputError(inputName, FIELD_CANNOT_BE_EMPTY_ERROR);
				} else if (!/^[0-9]*$/.test(this.inputsValue[inputName])) {
					this.addInputError(inputName, PHONE_FIELD_VALID_ERROR);
				} else {
					this.deleteInputError(inputName);
				}
				break;
			case "userStreet":
				if (this.inputsValue[inputName].length < 1) {
					this.addInputError(inputName, FIELD_CANNOT_BE_EMPTY_ERROR);
				} else {
					this.deleteInputError(inputName);
				}
				break;

			case "userCity":
				if (this.inputsValue[inputName].length < 1) {
					this.addInputError(inputName, FIELD_CANNOT_BE_EMPTY_ERROR);
				} else {
					this.deleteInputError(inputName);
				}
				break;

			case "userPostalCode":
				if (inputValue.length < 1) {
					this.addInputError(inputName, FIELD_CANNOT_BE_EMPTY_ERROR);
				} else if (!/^[0-9]{2}-[0-9]{3}$/.test(inputValue)) {
					this.addInputError(inputName, POSTAL_CODE_VALID_ERROR);
				} else {
					this.deleteInputError(inputName);
				}
				break;

			case "userState":
				if (this.inputsValue[inputName].length < 1) {
					this.addInputError(inputName, FIELD_CANNOT_BE_EMPTY_ERROR);
				} else {
					this.deleteInputError(inputName);
				}
				break;

			default:
				break;
		}
	}

	addInputError(inputName, textError) {
		this.inputsError = { ...this.inputsError, [inputName]: textError };
	}

	deleteInputError(inputName) {
		this.inputsError = { ...this.inputsError, [inputName]: "" };
	}

	handleSubmitOrder() {
		if (this.checkIfNoErrors()) {
			this.assignUserOrderData();

			submitOrderApex({ orderData: this.userOrderData, orderItems: this.booksData })
				.then((result) => {
					this.deleteOrderData();
					if (isGuest) {
						console.log(result);
						this.guestOrderId = result;
						this.guestOrderPIN = this.userOrderData.userPIN;
						this.showGuestOrderStatus = true;
					} else {
						window.open(basePath + "/my-shopping", "_self");
					}
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}

	assignUserOrderData() {
		if (isGuest) {
			this.userOrderData = {
				...this.inputsValue,
				userPIN: Math.floor(1000 + Math.random() * 9000).toString(),
				userGuest: true
			};
		} else {
			this.userOrderData = {
				...this.inputsValue,
				userGuest: false
			};
		}
	}

	checkIfNoErrors() {
		const inputsWrapper = this.template.querySelector(".contactAddressInfo");
		const inputsText = inputsWrapper.querySelectorAll('input[type="text"]');
		const inputsEmail = inputsWrapper.querySelectorAll('input[type="email"]');
		const inputs = [...inputsText, ...inputsEmail];
		inputs.forEach((element) => {
			this.inputsArray.push(element.getAttribute("name"));
		});

		for (const el of this.inputsArray) {
			if (this.inputsError[el].length > 0) {
				return false;
			}
		}
		return true;
	}

	deleteOrderData() {
		let removeItemKey;
		this.booksData.forEach((el) => {
			if (isGuest) {
				removeItemKey = "ORDER_BOOK_ID_" + el.bookId + "_USER_ID_guest";
			} else {
				removeItemKey = "ORDER_BOOK_ID_" + el.bookId + "_USER_ID_" + userId;
			}
			window.localStorage.removeItem(removeItemKey);
		});
		this.booksData = {};
	}

	handleCloseModal() {
		this.showLoginRegisterModal = false;
	}

	// handleChangQuantity(event) {
	// 	const dataBookAmount = parseInt(event.target.getAttribute("data-amount"), 2);
	// 	const dataBookId = event.target.getAttribute("data-book-id");
	// 	if (event.target.value > dataBookAmount) {
	// 		event.target.value = dataBookAmount;
	// 	} else if (event.target.value < 1) {
	// 		event.target.value = 1;
	// 	}

	// 	this.booksData.forEach((el, index) => {
	// 		if (el.bookId === dataBookId) {
	// 			this.booksData[index] = { ...this.booksData[index], quantity: event.target.value };
	// 		}
	// 	});
	// }

	// handleDeleteItem(event) {
	// 	const bookIdToDelete = event.target.getAttribute("data-book-id");
	// 	let removeItemKey;
	// 	this.booksData = this.booksData.filter((el) => {
	// 		return el.bookId !== bookIdToDelete;
	// 	});

	// 	if (isGuest) {
	// 		removeItemKey = "ORDER_BOOK_ID_" + bookIdToDelete + "_USER_ID_guest";
	// 	} else {
	// 		removeItemKey = "ORDER_BOOK_ID_" + bookIdToDelete + "_USER_ID_" + userId;
	// 	}
	// 	window.localStorage.removeItem(removeItemKey);
	// }
}
