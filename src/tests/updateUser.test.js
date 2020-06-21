'use strict'

const test = require('tape')
const { start, stop } = require('./test-utils/offline')
const fetch = require('node-fetch')
const { userFactory, users } = require('./test-utils/testUsers')

const user = userFactory('username4', 'updateuser@gmail.com', 'password4', users)

test('Update a user in the database', async t => {
  await start()

  const res1 = await fetch('http://localhost:3000/dev/signup', {
    method: 'POST',
    body: JSON.stringify(user)
  })

  const res2 = await fetch('http://localhost:3000/dev/login', {
    method: 'POST',
    body: JSON.stringify({
      username: 'username4',
      password: 'password4',
      chapterState: user.address.homeState
    })
  })

  const loginJson = await res2.json()
  const token = loginJson.token

  const res3 = await fetch('http://localhost:3000/dev/user', {
    method : 'PUT',
    body: JSON.stringify({
      fName: 'Albus',
      lName: 'Potter',
      email: 'updateuser@gmail.com',
      phone: '123-456-7890',
      verifiedEmail: false,
      familyMembers: {
        person: {
          fname: 'Albus',
          child: true
        }
      },
      address: {
        street: '123 Hogwarts St',
        street2: 'Tower Ravenclaw',
        aptSte: '',
        city: 'Seattle',
        homeState: 'Washington',
        zip: 12345
      },
      dietaryRestrictions: 'Potion Allergy',
      specialNotes: 'Delivery personnel must be a wizard or witch to enter Hogwarts',
      deliveryDay: 'Monday',
      deliveryInstructions: 'Tap great hall door four times and say "Lemon Drops".'
    }),
    headers: {'Authorization': 'Bearer ' + token}
  })

  const getJson = await res3.json()
  const expectedBody = 'User updated successfully!'

  t.equals(res3.status, 200, 'Returns http 200')
  t.equals(getJson.message, expectedBody, 'Returns a correct response body')
  await stop()
  t.end()
})