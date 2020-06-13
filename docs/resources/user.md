# User type

The user resource represents the properties of a user within the system.


### JSON representation

Here is a JSON representation of User.

```json
{
  "fName": "string",
  "lName": "string",
  "email": "string",
  "password": "string",
  "phone": "string",
  "verifiedEmail": "boolean",
  "familyMembers": {
    "member": {
      "child": "boolean"
    }
  },
  "address": {
    "street": "string",
    "AptSte": "string",
    "city": "string",
    "state": "string",
    "zip": "number"
  },
  "dietaryRestrictions": "string",
  "specialNotes": "string",
  "deliveryDay": "string",
  "deliveryInstructions": "string"
}
```

### Properties

| Property | Type | Description | Required? |
|:---------|:-----|:------------|:----------|
| **fName**   | String | First name of the user. | Yes |
| **lName** | String | Last name of the user. | Yes |
| **email** | String | The user's email address. | Yes |
| **password** | String | The user's password. | Yes |
| **phone** | String | The user's phone number. | Yes |
| **verifiedEmail** | Boolean | User's email has been verified or not. | No |
| **familyMembers** | Object | A collection of properties that define the members of the user's family. | No |
| +  **member** | Object | An individual member of the user's family. | No |
| + +  **child** | Boolean | Is this member a child. | No |
| **address** | Object | A collection of properties that define the user's physical address. | Yes |
| +  **street** | String | The street of the user's address. | Yes |
| +  **street2** | String | Additional street info of the user's address. | No |
| +  **aptSte** | String | The apartment or suite of the user's address. | No |
| +  **city** | String | The city of the user's address. | Yes |
| +  **state** | String | The state of the user's address. | Yes |
| +  **zip** | Number | The zipcode of the user's address. | Yes |
| **dietaryRestrictions** | String | Any dietary restrictions in the family that we should be aware of. | No |
| **specialNotes** | String | Information the user thinks we should be aware of. | No |
| **deliveryDay** | String | Day the user wants meals to be delivered on. | Yes |
| **deliveryInstructions** | String | Delivery instructions from the user. | No |