public without sharing class BookController {
	public class OrderDataWrapper {
		@AuraEnabled
		public Boolean userGuest { get; set; }
		@AuraEnabled
		public string userId { get; set; }
		@AuraEnabled
		public string userFirstName { get; set; }
		@AuraEnabled
		public string userLastName { get; set; }
		@AuraEnabled
		public string userEmail { get; set; }
		@AuraEnabled
		public string userPhone { get; set; }
		@AuraEnabled
		public string userStreet { get; set; }
		@AuraEnabled
		public string userCity { get; set; }
		@AuraEnabled
		public string userPostalCode { get; set; }
		@AuraEnabled
		public string userState { get; set; }
		@AuraEnabled
		public String userPIN { get; set; }
	}

	public class OrderItemsWrapper {
		@AuraEnabled
		public String bookId { get; set; }
		@AuraEnabled
		public Double price { get; set; }
		@AuraEnabled
		public Integer quantity { get; set; }
		// @AuraEnabled
		// public Integer amount { get; set; }
		// @AuraEnabled
		// public string image { get; set; }
		// @AuraEnabled
		// public String title { get; set; }
	}

	public BookController() {
	}

	@AuraEnabled
	public static void decreaseAmount(Id bookId, Integer amount) {
		Book__c book = [SELECT Book__c.Amount__c FROM Book__c WHERE Book__c.Id = :bookId WITH SECURITY_ENFORCED];

		if (book.Amount__c - amount < 0) {
			book.Amount__c = 0;
		} else {
			book.Amount__c -= amount;
		}
		update book;
	}

	@AuraEnabled(cacheable=true)
	public static List<Book__c> getBookForPreOrder(List<Id> idSet) {
		return [
			SELECT
				Book__c.Id,
				Book__c.Title__c,
				Book__c.Price__c,
				Book__c.Image__c,
				Book__c.Discount_price__c,
				Book__c.Amount__c
			FROM Book__c
			WHERE Book__c.Id = :idSet
			WITH SECURITY_ENFORCED
		];
	}

	@AuraEnabled
	public static String submitOrder(OrderDataWrapper orderData, OrderItemsWrapper[] orderItems) {
		try {
			Book_Order__c newOrder = new Book_Order__c();

			if (orderData.userGuest == true) {
				newOrder.Customer__c = 'GUEST';
				newOrder.Guest_Order_PIN__c = orderData.userPIN;
			} else {
				newOrder.Customer__c = orderData.userId;
			}
			newOrder.Customer_First_Name__c = orderData.userFirstName;
			newOrder.Customer_Last_Name__c = orderData.userLastName;
			newOrder.Customer_Email__c = orderData.userEmail;
			newOrder.Customer_Phone__c = orderData.userPhone;
			newOrder.Customer_Street__c = orderData.userStreet;
			newOrder.Customer_City__c = orderData.userCity;
			newOrder.Customer_Postal_Code__c = orderData.userPostalCode;
			newOrder.Customer_State__c = orderData.userState;
			newOrder.Order_Date_Time__c = Datetime.now();

			insert newOrder;

			List<Book_Order_Item__c> orderItemsList = new List<Book_Order_Item__c>();
			List<Book__c> booksList = new List<Book__c>();

			for (OrderItemsWrapper orderItem : orderItems) {
				Book_Order_Item__c newOrderItem = new Book_Order_Item__c();
				newOrderItem.Book_Order__c = newOrder.Id;
				newOrderItem.Book__c = orderItem.bookId;
				newOrderItem.Price__c = orderItem.price;
				newOrderItem.Quantity__c = orderItem.quantity;
				newOrderItem.Total_Price__c = orderItem.price * orderItem.quantity;
				orderItemsList.add(newOrderItem);

				Book__c bookToUpdate = [
					SELECT Book__c.Id, Book__c.Sold__c, Book__c.Amount__c
					FROM Book__c
					WHERE Book__c.Id = :orderItem.bookId

					LIMIT 1
				];
				bookToUpdate.Sold__c = bookToUpdate.Sold__c + orderItem.quantity;
				bookToUpdate.Amount__c = bookToUpdate.Amount__c - orderItem.quantity;
				booksList.add(bookToUpdate);
			}

			insert orderItemsList;
			update booksList;

			return newOrder.Id;
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}

	@AuraEnabled
	public static List<Book_Order__c> getUserOrders(Id userId, String status) {
		try {
			if (status == 'All') {
				return [
					SELECT
						Book_Order__c.Name,
						Book_Order__c.Order_Date_Time__c,
						Book_Order__c.Status__c,
						Book_Order__c.Total_Order_Price__c
					FROM Book_Order__c
					WHERE Book_Order__c.Customer__c = :userId
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
					WHERE Book_Order__c.Customer__c = :userId AND Book_Order__c.Status__c = :status
					ORDER BY Book_Order__c.Order_Date_Time__c DESC
				];
			}
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}

	@AuraEnabled
	public static List<Book_Order__c> getUserOrderDetails(Id orderId) {
		try {
			return [
				SELECT
					Book_Order__c.Name,
					Book_Order__c.Customer__c,
					Book_Order__c.Status__c,
					Book_Order__c.Customer_Email__c,
					Book_Order__c.Customer_First_Name__c,
					Book_Order__c.Customer_Last_Name__c,
					Book_Order__c.Customer_Street__c,
					Book_Order__c.Customer_City__c,
					Book_Order__c.Customer_Postal_Code__c,
					Book_Order__c.Customer_State__c,
					Book_Order__c.Customer_Phone__c,
					Book_Order__c.Order_Date_Time__c,
					Book_Order__c.Total_Order_Price__c,
					(
						SELECT
							Book_Order_Item__c.Price__c,
							Book_Order_Item__c.Quantity__c,
							Book_Order_Item__c.Total_Price__c,
							Book_Order_Item__c.Book__r.Image__c,
							Book_Order_Item__c.Book__r.Title__c
						FROM Books_Orders_Items__r
					)
				FROM Book_Order__c
				WHERE Book_Order__c.Id = :orderId
				LIMIT 1
			];
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}

	@AuraEnabled
	public static List<Book_Order__c> getGuestOrderDetails(Id orderId, String guestPIN) {
		try {
			return [
				SELECT
					Book_Order__c.Name,
					Book_Order__c.Customer__c,
					Book_Order__c.Status__c,
					Book_Order__c.Customer_Email__c,
					Book_Order__c.Customer_First_Name__c,
					Book_Order__c.Customer_Last_Name__c,
					Book_Order__c.Customer_Street__c,
					Book_Order__c.Customer_City__c,
					Book_Order__c.Customer_Postal_Code__c,
					Book_Order__c.Customer_State__c,
					Book_Order__c.Customer_Phone__c,
					Book_Order__c.Order_Date_Time__c,
					Book_Order__c.Total_Order_Price__c,
					(
						SELECT
							Book_Order_Item__c.Price__c,
							Book_Order_Item__c.Quantity__c,
							Book_Order_Item__c.Total_Price__c,
							Book_Order_Item__c.Book__r.Image__c,
							Book_Order_Item__c.Book__r.Title__c
						FROM Books_Orders_Items__r
					)
				FROM Book_Order__c
				WHERE
					Book_Order__c.Id = :orderId
					AND Book_Order__c.Customer__c = 'GUEST'
					AND Book_Order__c.Guest_Order_PIN__c = :guestPIN
				LIMIT 1
			];
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}

	@AuraEnabled
	public static Boolean checkGuestOrder(String orderId, String orderPIN) {
		try {
			Integer guestOrder = [
				SELECT COUNT()
				FROM Book_Order__c
				WHERE Book_Order__c.Id = :orderId AND Book_Order__c.Guest_Order_PIN__c = :orderPIN
				WITH SECURITY_ENFORCED
			];

			if (guestOrder > 0) {
				return true;
			} else {
				return false;
			}
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}

	@AuraEnabled
	public static List<List<sObject>> search(String textToSearch) {
		try {
			List<List<sObject>> searchList = [
				FIND :textToSearch
				IN ALL FIELDS
				RETURNING Book__c(Title__c, Id, Author__r.Name), Author__c(Name, Id)
			];

			return searchList;
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}
}
