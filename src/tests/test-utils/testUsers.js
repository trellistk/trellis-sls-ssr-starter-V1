'use strict'

module.exports.userFactory = function(username, email, password, props) {
  return {
    username,
    email,
    password,
    fName: props.fName,
    lName: props.lName,
    phone: props.phone,
    verifiedEmail: props.verifiedEmail,
    familyMembers: props.familyMembers,
    address: props.address,
    dietaryRestrictions: props.dietaryRestrictions,
    specialNotes: props.specialNotes,
    deliveryDay: props.deliveryDay,
    deliveryInstructions: props.deliveryInstructions
  }
}

module.exports.users = {
  fName: 'Harry',
  lName: 'Potter',
  phone: '123-456-7890',
  verifiedEmail: false,
  familyMembers: {
    person: {
      fname: 'Harry',
      child: false
    }
  },
  address: {
    street: '123 Hogwarts St',
    street2: 'Tower Gryffindor',
    aptSte: '',
    city: 'Seattle',
    homeState: 'Washington',
    zip: 12345
  },
  dietaryRestrictions: 'Banana Allergy',
  specialNotes: 'Delivery personnel must be a wizard or witch to enter Hogwarts',
  deliveryDay: 'Friday',
  deliveryInstructions: 'Tap great hall door four times and say "Lemon Drops".'
}
