# Update Current User

Allow the Authenticated User to update their details.

**URL** : `/api/user/`

**Method** : `PUT`

**Auth required** : YES

**Permissions required** : None

**Data constraints**

```json
{
    "fName": "[1 to 30 chars]",
    "lName": "[1 to 30 chars]"
}
```

**Data examples**

Partial data is allowed. An empty string can be used to "delete" data, i.e. a user moves and no longer has a gate code.

```json
{
    "fName": "John",
    "deliveryInstructions": ""
}
```

## Success Response

**Condition** : Data provided is valid and User is Authenticated.

**Code** : `200 OK`

**Content example** : Response will reflect back the updated information.

```json
{
  "fName": "John",
  "lName": "Potter",
  "email": "awesome@gmail.com",
  "password": "Hextech12!?",
  "phone": "123-456-7890",
  "verifiedEmail": true,
  "familyMembers": {
    "person": {
      "fname": "George",
      "child": false
    },
    "person": {
      "fname": "Jade",
      "child": true
    }
  },
  "address": {
    "street": "12345 N Awesome St",
    "aptSte": "Apt 1354",
    "city": "Seattle",
    "states": "Washington",
    "zip": 12345
  },
  "dietaryRestrictions": "My child has an allergy to bananas.",
  "specialNotes": "An adult must answer the door to receive our order.",
  "deliveryDay": "Monday",
  "deliveryInstructions": ""
}
```

## Error Response

**Condition** : If provided data is invalid, e.g. a name field is too long.

**Code** : `400 BAD REQUEST`

**Content example** :

```json
{
    "fName": [
        "Please provide maximum 30 characters or empty string",
    ]
}
```