'use strict'

require('dotenv').config()
const API_DOMAIN_LOCAL = process.env.API_DOMAIN_LOCAL

const test = require('tape')
const puppeteer = require('puppeteer')
const offline = require('../test-utils/offline')

test.only('Testing family signup and update flow', async t => {
  await offline.start()
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  // SIGNUP FLOW
  await page.goto(`${API_DOMAIN_LOCAL}/signup`, { waitUntil: 'networkidle2' })

  const signupPageTitle = await page.title()

  t.equals(signupPageTitle, 'Nouri App: Sign Up')

  const getSignupCsrfEl = await page.$('input[name="csrf_token"]')

  const getSignupCsrf = await page.evaluate(input => input.value, getSignupCsrfEl)

  t.true(getSignupCsrf, 'Get signup has an input with value for csrf token')

  // Fill out the signup form
  await page.$eval('input[name="email"]', el => (el.value = 'jane@doe.com'))
  await page.$eval('input[name="password1"]', el => (el.value = '123!@#qweQWE'))
  await page.$eval('input[name="password2"]', el => (el.value = '123!@#qweQWE'))
  await page.$eval('input[name="fname"]', el => (el.value = 'jane'))
  await page.$eval('input[name="lname"]', el => (el.value = 'doe'))
  await page.$eval('input[name="phone"]', el => (el.value = '(123) 123-1234'))
  await page.select('select[name="chapter"]', 'seattle-eastside')
  await page.$eval('input[name="street1"]', el => (el.value = '123 main st apt 7'))
  await page.select('select[name="city"]', 'Woodinville')
  await page.$eval('select[name="state"]', el => (el.value = 'WA'))
  await page.$eval('input[name="zip"]', el => (el.value = '98119'))
  await page.$eval('textarea[name="delivery_notes"]', el => (el.value = 'my delivery notes submitted'))
  await page.$eval('input[name="alias"]', el => (el.value = 'mynickname'))
  await page.$eval('textarea[name="members"]', el => (el.value = 'member1 member 2 member3'))
  await page.$eval('input[name="member_count"]', el => (el.value = 5))
  await page.$eval('input[name="kids_who_can_cook_count"]', el => (el.value = 1))
  await page.$eval('textarea[name="allergies_restrictions"]', el => (el.value = 'peanuts'))
  await page.$eval('select[name="income"]', el => (el.value = '0-1500'))

  await page.click('button[type="submit"]')

  // Check success page
  const signupSuccessTitle = await page.title()
  t.equals(signupSuccessTitle, 'Nouri: Successful Signup')

  // TODO Check page message

  // LOG IN FLOW
  await page.goto(`${API_DOMAIN_LOCAL}/login`, { waitUntil: 'networkidle2' })

  const loginPageTitle = await page.title()
  t.equals(loginPageTitle, 'Nouri App: Log In')

  // Fill in the login form
  await page.select('select[name="chapter"]', 'seattle-eastside')
  await page.$eval('input[name="email"]', el => (el.value = 'jane@doe.com'))
  await page.$eval('input[name="password"]', el => (el.value = '123!@#qweQWE'))
  await page.click('button[type="submit"]')

  // Check the dashboard
  const familyDashPageTitle = await page.title()
  t.equals(familyDashPageTitle, 'Nouri: Dashboard')

  // TODO Test that the inputs are prefilled with the signup information.
  // TODO TEST UPDATE FAMILY FLOW

  await browser.close()
  await offline.stop()
  t.end()
})
