'use strict'

module.exports.userFactory = {
  correct: {
    chapter: 'seattle-eastside',
    email: 'jane@doe.com',
    password: '123password&23845',
    fname: 'jane',
    lname: 'doe',
    phone: '1234567890',
    street1: '123 main st apt 7',
    // street2: null,
    city: 'seattle',
    state: 'wa',
    zip: '98119',
    totalHouseholdIncome: 1500
    // communityAlias: null,
    // deliveryNotes: null
  },
  correctUpdate: {
    fname: 'janie',
    lname: 'do',
    phone: '1234567098',
    street1: '124 main st apt 7',
    city: 'everett',
    state: 'wa',
    zip: '98000',
    totalHouseholdIncome: 2000
  },
  passwordUpdate: {
    oldPassword: '123password&23845',
    newPassword1: 'simple123!!',
    newPassword2: 'simple123!!'
  },
  emailUpdate: {
    newEmail: 'john@doe.com'
  },
  correct2: {
    chapter: 'seattle-eastside',
    email: 'john@doe.com',
    password: '123password&23845',
    fname: 'john',
    lname: 'doe',
    phone: '1234567890',
    street1: '123 main st apt 6',
    // street2: null,
    city: 'seattle',
    state: 'wa',
    zip: '98119',
    totalHouseholdIncome: 1500
    // communityAlias: null,
    // deliveryNotes: null
  },
}
