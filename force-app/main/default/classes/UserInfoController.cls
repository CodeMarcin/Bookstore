public with sharing class UserInfoController {
	public class BasicInfoWrapper {
		@AuraEnabled
		public string userFirstName { get; set; }
		@AuraEnabled
		public string userLastName { get; set; }
		@AuraEnabled
		public string userEmail { get; set; }
		@AuraEnabled
		public string userPhone { get; set; }
	}

	public class AddressInfoWrapper {
		@AuraEnabled
		public string userStreet { get; set; }
		@AuraEnabled
		public string userCity { get; set; }
		@AuraEnabled
		public string userPostalCode { get; set; }
		@AuraEnabled
		public string userState { get; set; }
	}

	public UserInfoController() {
	}

	@AuraEnabled
	public static List<User> getProfileOverview(Id userId) {
		return [
			SELECT
				User.Id,
				User.FirstName,
				User.LastName,
				User.Email,
				User.Phone,
				Contact.MailingStreet,
				Contact.MailingCity,
				Contact.MailingPostalCode,
				Contact.MailingState
			FROM User
			WHERE User.Id = :userId
			WITH SECURITY_ENFORCED
			LIMIT 1
		];
	}

	@AuraEnabled
	public static void updateBasicProfileInfo(BasicInfoWrapper basicInfo, Id userId) {
		try {
			User userToUpdate = [SELECT User.Id FROM User WHERE User.Id = :userId WITH SECURITY_ENFORCED LIMIT 1];
			userToUpdate.FirstName = basicInfo.userFirstName;
			userToUpdate.LastName = basicInfo.userLastName;
			userToUpdate.Email = basicInfo.userEmail;
			userToUpdate.Phone = basicInfo.userPhone;

			update userToUpdate;
		} catch (Exception e) {
			throw new AuraHandledException('Some error');
		}
	}

	@AuraEnabled
	public static void updateAddresProfileInfo(AddressInfoWrapper addressInfo, Id userId) {
		try {
			User userToUpdate = [
				SELECT User.Id, Contact.Id
				FROM User
				WHERE User.Id = :userId
				WITH SECURITY_ENFORCED
				LIMIT 1
			];

			userToUpdate.Contact.MailingStreet = addressInfo.userStreet;
			userToUpdate.Contact.MailingCity = addressInfo.userCity;
			userToUpdate.Contact.MailingPostalCode = addressInfo.userPostalCode;
			userToUpdate.Contact.MailingState = addressInfo.userState;
			
			update userToUpdate.Contact;
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}
}
