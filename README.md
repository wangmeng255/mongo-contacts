#Contacts based on Mongoose
##How to use it
1.  add Contact
![alt text][add-contact]
[add-contact]: https://github.com/wangmeng255/mongo-contacts/blob/dev/img/add-contact.png "add contact"

2.  edit information
![alt text][edit-information]
[add-contact]: https://github.com/wangmeng255/mongo-contacts/blob/dev/img/edit-information.png "edit information"

3.  delete Contact
![alt text][delete-contact]
[add-contact]: https://github.com/wangmeng255/mongo-contacts/blob/dev/img/delete-contact.png "delete contact"

4.  view Contact detailed information
![alt text][view-contact]
[view-contact]: https://github.com/wangmeng255/mongo-contacts/blob/dev/img/view-contact.png "view contact"

##API
1.  get
    * Endpoint  
      _GET afternoon-coast-84211.herokuapp.com/items_
    * Request Parameters  
      _none_
    * Response Format  
      On success, the HTTP status code in the response header is 200 OK and the response body contains an array of objects in JSON format. On error, the header status code is 500 and the response body contains an error object key message whose value is 'Internal Server Error'.
    * Example  
      curl -X "GET afternoon-coast-84211.herokuapp.com/items"  

      ```javascript
      [{  
         firstName: 'bright',  
         lastName: 'horizons',  
         phoneNumber: ['(310) 445-8993'],    
         Address: ['2114 Pontius Avenue Los Angeles, CA 90025']  
      },
      {
         firstName: 'century', 
         lastName: 'city', 
         phoneNumber: ['(310) 557-1447'], 
         Address: ['Beverly Hills, 90210, Los Angeles, CA']
      }]
      ```
      
2.  post
    * Endpoint  
      _POST afternoon-coast-84211.herokuapp.com/items_
    * Request Parameters  
    
      QUERY PARAMETER | VALUE
      --------------- | -----
      firstName | _Required_. String
      lastName | _Required_. String
      phoneNumber| _Required_. Array
      Address | _Not Required_. Array

    * Response Format  
      On success, the HTTP status code in the response header is 201 CREATED and the response body contains an object in JSON format. On error, the header status code is 500 and the response body contains an error object key message whose value is 'Internal Server Error'.
    * Example  
      curl -X "POST afternoon-coast-84211.herokuapp.com/items"  
      
      ```javascript
      {  
         __v: 0, //The versionKey is a property set on each document when first created by Mongoose. This keys value contains the internal revision of the document.
         firstName: 'bright',  // user submit object
         lastName: 'horizons',  
         phoneNumber: ['(310) 445-8993'],    
         Address: ['2114 Pontius Avenue Los Angeles, CA 90025']  
      }
      ```
      
3.  put
    * Endpoint  
      _PUT afternoon-coast-84211.herokuapp.com/items/{id}_
    * Request Parameters  
    
      QUERY PARAMETER | VALUE
      --------------- | -----
      firstName | _Required_. String
      lastName | _Required_. String
      phoneNumber| _Required_. Array
      Address | _Not Required_. Array

    * Response Format  
      On success, the HTTP status code in the response header is 200 OK and the response body contains an object in JSON format. On error, the header status code is 500 and the response body contains an error object key message whose value is 'Internal Server Error'.
    * Example  
      curl -X "PUT afternoon-coast-84211.herokuapp.com/items/579f411220f80a7fc29d0e92"  
      
      ```javascript
      { 
         ok: 1, //if ok is 1, there is no error. if ok is 0, there is an error
         nModified: 1, // if nModified is 1, update success. if nModified is 0, updata fail
         n: 1, // if n is 0, the item cannot be found.
         lastOp: Timestamp { _bsontype: 'Timestamp', low_: 1, high_: 1473355882 }, //lastOp is the optime timestamp in the oplog of the change. bsontype is definition is here (https://docs.mongodb.com/manual/reference/bson-types/)
         electionId: 579f411220f80a7fc29d0e92  //the if of updated item 
      }
      ```
      
4.  delete
    * Endpoint  
      _DELETE afternoon-coast-84211.herokuapp.com/items/{id}_
    * Request Parameters  
      _none_
    * Response Format  
      On success, the HTTP status code in the response header is 200 OK and the response body contains an object in JSON format. On error, the header status code is 500 and the response body contains an error object key message whose value is 'Internal Server Error'.
    * Example  
      curl -X "DELETE afternoon-coast-84211.herokuapp.com/items/579f411220f80a7fc29d0e92"  
      
      ```javascript
      {
         _id: 579f411220f80a7fc29d0e92
      }
      ```
      
##Summary 
In this app, users can CRUD(Create, Read, Update, Delete) person's name, phone numbers and addresses to a mongodb.
