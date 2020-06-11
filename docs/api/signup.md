# Create User's Account

Create a new user in the database if it does not already exist.

**URL** : `/api/signup/`

**Method** : `POST`

**Auth required** : NO

**Permissions required** : None

**Data constraints**

Must provide the required user info.


**Data example**

```json
{
  "fName": "George",
  "lName": "Potter",
  "email": "awesome@gmail.com",
  "password": "Hextech12!?",
  "phone": "123-456-7890",
  "address": {
    "street": "12345 N Awesome St",
    "city": "Seattle",
    "state": "Washington",
    "zip": 12345
  },
  "deliveryDay": "Monday"
}
```

## Success Response

**Condition** : If everything is OK and a User didn't already exist.

**Code** : `201 CREATED`

**Content example**

```json
{
  "fName": "George",
  "lName": "Potter",
  "email": "awesome@gmail.com",
  "password": "Hextech12!?",
  "phone": "123-456-7890",
  "address": {
    "street": "12345 N Awesome St",
    "city": "Seattle",
    "state": "Washington",
    "zip": 12345
  },
  "deliveryDay": "Monday"
}
```

## Error Responses

**Condition** : If Account already exists for User.

**Code** : `403 FORBIDDEN`

**Content example**

```json
{
    "email": [
        "This email already exists."
    ]
}
```

### Or

**Condition** : If fields are missed.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "email": [
        "This field is required."
    ]
}
```