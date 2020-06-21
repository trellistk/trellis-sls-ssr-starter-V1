# Show Current User

Get the details of the currently Authenticated User.

**URL** : `/api/user/`

**Method** : `GET`

**Auth required** : YES

**Permissions required** : None

## Success Response

**Code** : `200 OK`

**Content examples**

Once a user logs in and is authenticated, they can access their user information saved on our database.

```json
{
  "fName": "George",
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
  "deliveryInstructions": "The gate code for our complex is #2080."
}
```