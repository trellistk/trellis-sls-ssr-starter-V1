'use strict'

const bcrypt = require('bcryptjs')
const validator = require('validator')

const db = require('../database/dynamodb')
const TableName = process.env.DYNAMODB_TABLE

module.exports.signUpUser = async ({
  email,
  password1,
  password2
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
      objectType: 'user',
      docSort: `${email}`,
      email,
      password: hashedPassword,
      email_verified: false
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
    return { succes: 'Successfully created new user.' }
  } catch (error) {
    return { error }
  }
}

module.exports.verifyEmail = async (objectType, docSort) => {
  try {
    const params = {
      TableName,
      Key: {
        objectType,
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

module.exports.getUser = async (objectType, docSort) => {
  const params = {
    TableName,
    Key: {
      objectType,
      docSort
    }
  }

  try {
    const userInfo = await db.get(params).promise()

    if (userInfo.length === 0 || !userInfo.Item || !userInfo.Item.length === 0) {
      return { error: 'Error finding record.' }
    }

    return { user: userInfo.Item }
  } catch (error) {
    return { error }
  }
}

module.exports.getLead = async (objectType, docSort) => {
  const params = {
    TableName,
    Key: {
      objectType,
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

module.exports.addSession = async (objectType, docSort, token) => {
  try {
    const params = {
      TableName,
      Key: {
        objectType,
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

module.exports.addCsrf = async (objectType, docSort, csrf) => {
  try {
    const params = {
      TableName,
      Key: {
        objectType,
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

module.exports.updateUser = async (objectType, docSort) => {
  try {
    const params = {
      TableName,
      Key: {
        objectType,
        docSort
      },
      AttributeUpdates: {
      }
    }

    await db.update(params).promise()

    return { success: 'Updated user' }
  } catch (error) {
    return { error }
  }
}
