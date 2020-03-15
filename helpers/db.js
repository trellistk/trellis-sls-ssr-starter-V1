'use strict'

const bcrypt = require('bcryptjs')
const validator = require('validator')

const db = require('../database/dynamodb')
const TableName = process.env.DYNAMODB_TABLE

module.exports.signUpFamily = async ({
  chapter,
  email,
  password1,
  password2,
  fname,
  lname,
  phone,
  street1,
  street2,
  city,
  state,
  zip,
  delivery_notes: deliveryNotes,
  alias,
  members,
  member_count: memberCount,
  kids_who_can_cook_count: kidsWhoCanCookCount,
  allergies_restrictions: allergiesRestrictions,
  income,
  email_verified = false
}) => {
  // Check required fields

  // check that both passwords are the same
  if (password1 !== password2) {
    return { error: 'Passwords do not match.' }
  }

  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(password1, 10)
  } catch (error) {
    return { error }
  }

  const params = {
    TableName,
    Item: {
      chapter,
      docSort: `family:${email}`,
      email,
      password: hashedPassword,
      fname,
      lname,
      phone,
      street1,
      street2,
      city,
      state,
      zip,
      delivery_notes: deliveryNotes,
      alias,
      members,
      member_count: memberCount,
      kids_who_can_cook_count: kidsWhoCanCookCount,
      allergies_restrictions: allergiesRestrictions,
      income,
      email_verified
    },
    ConditionExpression: 'attribute_not_exists(docSort)'
  }

  // Try to sanitize all the fields
  for (const [key, value] of Object.entries(params.Item)) {
    if (key === 'password') continue
    if (!value) continue
    params.Item[key] = validator.escape(value.toString())
  }

  try {
    await db.put(params).promise()
    return { succes: 'Successfully created new family.' }
  } catch (error) {
    return { error }
  }
}

module.exports.verifyEmail = async (chapter, docSort) => {
  try {
    const params = {
      TableName,
      Key: {
        chapter,
        docSort
      },
      AttributeUpdates: {
        email_verified: {
          Action: 'PUT',
          Value: true
        }
      }
    }

    await db.update(params).promise()

    return { success: 'Verified Email Successfully.' }
  } catch (error) {
    return { error }
  }
}

module.exports.getFamily = async (chapter, docSort) => {
  const params = {
    TableName,
    Key: {
      chapter,
      docSort
    }
  }

  try {
    const familyInfo = await db.get(params).promise()

    if (familyInfo.length === 0 || !familyInfo.Item || !familyInfo.Item.length === 0) {
      return { error: 'Error finding record.' }
    }

    return { family: familyInfo.Item }
  } catch (error) {
    return { error }
  }
}

module.exports.getLead = async (chapter, docSort) => {
  const params = {
    TableName,
    Key: {
      chapter,
      docSort
    }
  }

  try {
    const leadInfo = await db.get(params).promise()

    if (leadInfo.length === 0 || !leadInfo.Item || !leadInfo.Item.length === 0) {
      return { error: 'Error finding record.' }
    }

    return { lead: leadInfo.Item }
  } catch (error) {
    return { error }
  }
}

module.exports.addSession = async (chapter, docSort, token) => {
  try {
    const params = {
      TableName,
      Key: {
        chapter,
        docSort
      },
      AttributeUpdates: {
        session: {
          Action: 'PUT',
          Value: token
        }
      }
    }

    await db.update(params).promise()

    return { success: 'Added Session' }
  } catch (error) {
    return { error }
  }
}

module.exports.addCsrf = async (chapter, docSort, csrf) => {
  try {
    const params = {
      TableName,
      Key: {
        chapter,
        docSort
      },
      AttributeUpdates: {
        csrf: {
          Action: 'PUT',
          Value: csrf
        }
      }
    }

    await db.update(params).promise()

    return { success: 'Added Session' }
  } catch (error) {
    return { error }
  }
}

module.exports.updateFamily = async (chapter, docSort, {
  fname,
  lname,
  phone,
  street1,
  street2,
  city,
  state,
  zip,
  alias,
  members,
  member_count: memberCount,
  kids_who_can_cook_count: kidsWhoCanCookCount,
  allergies_restrictions: allergiesRestrictions,
  income
}) => {
  try {
    const params = {
      TableName,
      Key: {
        chapter,
        docSort
      },
      AttributeUpdates: {
        fname: {
          Action: 'PUT',
          Value: fname
        },
        lname: {
          Action: 'PUT',
          Value: lname
        },
        phone: {
          Action: 'PUT',
          Value: phone
        },
        street1: {
          Action: 'PUT',
          Value: street1
        },
        street2: {
          Action: 'PUT',
          Value: street2
        },
        city: {
          Action: 'PUT',
          Value: city
        },
        state: {
          Action: 'PUT',
          Value: state
        },
        zip: {
          Action: 'PUT',
          Value: zip
        },
        alias: {
          Action: 'PUT',
          Value: alias
        },
        members: {
          Action: 'PUT',
          Value: members
        },
        member_count: {
          Action: 'PUT',
          Value: memberCount
        },
        kids_who_can_cook_count: {
          Action: 'PUT',
          Value: kidsWhoCanCookCount
        },
        allergies_restrictions: {
          Action: 'PUT',
          Value: allergiesRestrictions
        },
        income: {
          Action: 'PUT',
          Value: income
        }
      }
    }

    await db.update(params).promise()

    return { success: 'Updated family' }
  } catch (error) {
    return { error }
  }
}
