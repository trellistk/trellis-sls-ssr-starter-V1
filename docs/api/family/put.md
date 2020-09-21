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

- See [Schema](../../../src/schema/update_family_details.json)
- See [Example](../../../src/tests/test-utils/data_factories.js): userFactory.correctUpdate

## Success Response

**Condition** : Data provided is valid and User is Authenticated.

**Code** : `200 OK`

**Content example** : Response will reflect back the updated information.

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