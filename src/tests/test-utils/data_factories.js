'use strict'

module.exports.userFactory = {
  correct: {
    email: 'jane@doe.com',
    password1: '123!@#qweQWE',
    password2: '123!@#qweQWE',
    fname: 'jane',
    lname: 'doe',
    phone: '(123) 123-1234',
    chapter: 'seattle-eastside',
    street1: '123 main st apt 7',
    // street2: null,
    city: 'seattle',
    state: 'wa',
    zip: '98119',
    delivery_notes: 'my delivery notes submitted',
    alias: 'mynickname',
    members: 'member1 member 2 member3',
    member_count: 5,
    kids_who_can_cook_count: 1,
    allergies_restrictions: 'peanuts',
    income: '0-1500'
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
  }
}
