Test application
==============================================
----------


Get API running
----------------------------
```
npm run start
```

## Routes
!important - All routes must contain a Authentication header for the appname

Service NAME     			| END POINT                  | Description
--------------------------- | ---------------------------|---------------------
 Auth                       | /                          | base Endpoint
                            | /customer                  | POST creates a customer
                            | /customer/login            | POST   log customer in
                            | /contact                   | POST  create contact
                            | /messages                  | POST  send messages
                        

**Sample Request and Response for customer creation:**
```
http://localhost:7500/customer
#Request
{
	"msisdn": "07032748600",
	"firstname": "Mike",
	"lastname": "Ola"
}

#Response
{
    "error": false,
    "code": 201,
    "data": {
        "userId": "1d5ddc9c-e8aa-44df-a856-be69098870fc"
    },
    "message": "Customer created successfully"
}
```

**Sample Request and Response for login customer:**
```
localhost:7500/customer/login
#Request

{
	"msisdn": "07032748600"
}

Response
{
    "error": false,
    "code": 200,
    "data": {
        "userId": "1d5ddc9c-e8aa-44df-a856-be69098870fc",
        "msisdn": "07032748600",
        "token": ""
    },
    "message": "Customer logged in successfully"
}
```

**Sample Request and Response for create contacts:**
```
http://localhost:7500/send_code
#Request
{
	"msisdn": "07032748640",
	"contact_list": "fav"
}

Response
{
    "error": false,
    "code": 201,
    "message": "contact added successfully"
}
```

**Sample Request and Response for send message:**
```
http://localhost:7500/send_code
#Request
authentication header - token
{
	"message": "07032748645",
	"task_id": "Micheal",
	"contact_list": "Ade"
}
#Response
{
    "error": false,
    "code": 200,
    "message": "message pushed successfully"
}
```

```

**Environment Variables:**
```
APP_PORT=7500
MONGODB_HOST=127.0.0.1
MONGODB_PORT=27017
MONGODB_DATABASE_NAME=''
MONGODB_PASSWORD=
MONGODB_USER=
BASE_URL=
SENDGRID_API_KEY=
SECRET=''

```