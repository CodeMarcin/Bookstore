public with sharing class AdminController {
	public AdminController() {
	}

	@AuraEnabled(cacheable=true)
	public static String checkIfUserIsLoggedInApex() {
		String loggedUserId = 'Some string';

		return loggedUserId;
	}

	@AuraEnabled
	public static Map<String, Integer> getSummary() {
		try {
			Map<String, Integer> summary = new Map<String, Integer>();

			summary.put('allUsersCount', [SELECT COUNT() FROM User WITH SECURITY_ENFORCED]);
			summary.put('activeUsersCount', [SELECT COUNT() FROM User WHERE IsActive = TRUE WITH SECURITY_ENFORCED]);
			summary.put(
				'nonActiveUsersCount',
				[SELECT COUNT() FROM User WHERE IsActive = FALSE WITH SECURITY_ENFORCED]
			);

			return summary;
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}

	@AuraEnabled
	public static void addAuthor(String authorFullName) {
		try {
			Author__c newAuthor = new Author__c();
			newAuthor.name = authorFullName;
			insert newAuthor;
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}

	@AuraEnabled
	public static List<Author__c> getAllAuthors() {
		try {
			return [
				SELECT Author__c.Id, Author__c.Name
				FROM Author__c
				WITH SECURITY_ENFORCED
				ORDER BY Author__c.Name ASC
			];
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}

	@AuraEnabled
	public static List<Author__c> getSingleAuthor(Id authorId) {
		try {
			return [
				SELECT Author__c.Id, Author__c.Name
				FROM Author__c
				WHERE Author__c.Id = :authorId
				WITH SECURITY_ENFORCED
				LIMIT 1
			];
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}

	@AuraEnabled
	public static void editSingleAuthor(Id authorId, String authorName) {
		try {
			Author__c authorToEdit = [
				SELECT Author__c.Id
				FROM Author__c
				WHERE Author__c.Id = :authorId
				WITH SECURITY_ENFORCED
				LIMIT 1
			];
			authorToEdit.Name = authorName;
			update authorToEdit;
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}

	@AuraEnabled
	public static void addCategory(String categoryName) {
		try {
			Category__c newCategory = new Category__c();
			newCategory.Name = categoryName;
			insert newCategory;
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}

	@AuraEnabled
	public static List<Category__c> getAllCategory() {
		try {
			return [
				SELECT Category__c.Id, Category__c.Name
				FROM Category__c
				WITH SECURITY_ENFORCED
				ORDER BY Category__c.Name ASC
			];
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}

	@AuraEnabled
	public static List<Category__c> getSingleCategory(Id categoryId) {
		try {
			return [
				SELECT Category__c.Id, Category__c.Name
				FROM Category__c
				WHERE Category__c.Id = :categoryId
				WITH SECURITY_ENFORCED
				LIMIT 1
			];
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}

	@AuraEnabled
	public static void editSingleCategory(Id categryId, String categoryName) {
		try {
			Category__c categoryToEdit = [
				SELECT Category__c.Id
				FROM Category__c
				WHERE Category__c.Id = :categryId
				WITH SECURITY_ENFORCED
				LIMIT 1
			];

			categoryToEdit.Name = categoryName;
			update categoryToEdit;
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}

	@AuraEnabled
	public static List<Book__c> getAllBooks() {
		try {
			return [
				SELECT
					Book__c.Id,
					Book__c.Amount__c,
					Book__c.Discount_Price__c,
					Book__c.Price__c,
					Book__c.Title__c,
					Book__c.Sold__c
				FROM Book__c
				WITH SECURITY_ENFORCED
				ORDER BY Book__c.Title__c ASC
			];
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}

	@AuraEnabled
	public static List<Book_Order__c> getUsersOrders(String orderStatus) {
		try {
			if (orderStatus == 'All') {
				return [
					SELECT
						Book_Order__c.Name,
						Book_Order__c.Order_Date_Time__c,
						Book_Order__c.Status__c,
						Book_Order__c.Total_Order_Price__c
					FROM Book_Order__c
					WITH SECURITY_ENFORCED
					ORDER BY Book_Order__c.Order_Date_Time__c DESC
				];
			} else {
				return [
					SELECT
						Book_Order__c.Name,
						Book_Order__c.Order_Date_Time__c,
						Book_Order__c.Status__c,
						Book_Order__c.Total_Order_Price__c
					FROM Book_Order__c
					WHERE Book_Order__c.Status__c = :orderStatus
					WITH SECURITY_ENFORCED
					ORDER BY Book_Order__c.Order_Date_Time__c DESC
				];
			}
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}

	@AuraEnabled
	public static void changeOrderStatus(Id orderId, String newStatus) {
		try {
			Book_Order__c orderToChange = [
				SELECT Book_Order__c.Id, Book_Order__c.Status__c
				FROM Book_Order__c
				WHERE Book_Order__c.Id = :orderId
				WITH SECURITY_ENFORCED
				LIMIT 1
			];
			if (newStatus == 'Canceled') {
				List<Book_Order_Item__c> booksOrdersItem = [
					SELECT
						Book_Order_Item__c.Id,
						Book_Order_Item__c.Book__c,
						Book_Order_Item__c.Quantity__c,
						Book_Order_Item__c.Book__r.Id,
						Book_Order_Item__c.Book__r.Amount__c,
						Book_Order_Item__c.Book__r.Sold__c
					FROM Book_Order_Item__c
					WHERE Book_Order_Item__c.Book_Order__c = :orderId
				];

				for (Book_Order_Item__c book : booksOrdersItem) {
					book.Book__r.Amount__c = book.Book__r.Amount__c + book.Quantity__c;
					book.Book__r.Sold__c = book.Book__r.Sold__c - book.Quantity__c;

					update book.Book__r;
				}
			}

			if (orderToChange.Status__c == 'Canceled') {
				List<Book_Order_Item__c> booksOrdersItem = [
					SELECT
						Book_Order_Item__c.Id,
						Book_Order_Item__c.Book__c,
						Book_Order_Item__c.Quantity__c,
						Book_Order_Item__c.Book__r.Id,
						Book_Order_Item__c.Book__r.Amount__c,
						Book_Order_Item__c.Book__r.Sold__c
					FROM Book_Order_Item__c
					WHERE Book_Order_Item__c.Book_Order__c = :orderId
				];

				for (Book_Order_Item__c book : booksOrdersItem) {
					book.Book__r.Amount__c = book.Book__r.Amount__c - book.Quantity__c;
					book.Book__r.Sold__c = book.Book__r.Sold__c + book.Quantity__c;

					update book.Book__r;
				}
			}

			orderToChange.Status__c = newStatus;
			update orderToChange;

		
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}
}
