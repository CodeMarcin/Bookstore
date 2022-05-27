public without sharing class UserAuthController {
	public class NewUserWrapper {
		@AuraEnabled
		public string registerFirstName { get; set; }
		@AuraEnabled
		public string registerLastName { get; set; }
		@AuraEnabled
		public string registerPassword { get; set; }
		@AuraEnabled
		public string registerConfirmPassword { get; set; }
		@AuraEnabled
		public string registerPhone { get; set; }
		@AuraEnabled
		public string registerEmail { get; set; }
		@AuraEnabled
		public string registerStreet { get; set; }
		@AuraEnabled
		public string registerCity { get; set; }
		@AuraEnabled
		public string registerPostalCode { get; set; }
		@AuraEnabled
		public string registerState { get; set; }
	}
	public UserAuthController() {
	}

	@AuraEnabled
	public static Boolean checkIsEmailExist(String email) {
		try {
			Integer emailCount = [SELECT COUNT() FROM User WHERE User.Email = :email];
			if (emailCount > 0) {
				return true;
			} else {
				return false;
			}
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}

	@AuraEnabled
	public static string doLogin(String username, String password) {
		try {
			// String startUrl = System.currentPageReference().getParameters().get('startURL');
			ApexPages.PageReference pageRef = Site.login(username, password, null);

			if (pageRef != null) {
				return pageRef.getUrl();
			}

			throw new CalloutException();
		} catch (Exception e) {
			throw new AuraHandledException('WRONG_LOGIN_OR_PASSWORD_ERROR');
		}
	}

	@AuraEnabled
	public static String registerNewUser(NewUserWrapper userData) {
		try {
			User newUser = new User();
			newUser.Email = userData.registerEmail;
			newUser.FirstName = userData.registerFirstName;
			newUser.LastName = userData.registerLastName;
			newUser.UserName = userData.registerEmail;
			newUser.CommunityNickname = newUser.Username;

			String newUserPassword = userData.registerPassword;

			Id newUserId = Site.createExternalUser(newUser, null, newUserPassword);

			User newUserContact = [SELECT User.Id, Contact.Id FROM User WHERE User.Id = :newUserId LIMIT 1];

			newUserContact.Contact.MailingStreet = userData.registerStreet;
			newUserContact.Contact.MailingCity = userData.registerCity;
			newUserContact.Contact.MailingPostalCode = userData.registerPostalCode;
			newUserContact.Contact.MailingState = userData.registerState;
			newUserContact.Contact.Phone = userData.registerPhone;

			update newUserContact.Contact;

			if (newUserId != null) {
                ApexPages.PageReference pageRef = Site.login(userData.registerEmail, newUserPassword, null);
                if(pageRef != null) {
                   return pageRef.getUrl(); 
                }
                
                else {
                    ApexPages.PageReference page = System.Page.SiteRegisterConfirm;
                    page.setRedirect(true);
                    return page.getUrl();
                }
            }

			return null;
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}

}
