public with sharing class UserAccessController {
	public UserAccessController() {
	}

	@AuraEnabled(cacheable=true)
	public static String getProfileName() {
		// return UserInfo.getName();
		return userinfo.getProfileId();
		// return [SELECT Id, Name FROM User WHERE Id = :profileId WITH SECURITY_ENFORCED ];
	}

	@AuraEnabled(cacheable=true)
	public static Boolean checkUserAccesToSite(String portalAdminProfileId) {
		String userProfileId = userinfo.getProfileId();

		if (userProfileId == portalAdminProfileId) {
			return true;
		} else {
			return false;
		}
	}
}
