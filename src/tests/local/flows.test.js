'use strict'

require('dotenv').config()
const API_DOMAIN_LOCAL = process.env.API_DOMAIN_LOCAL

const test = require('tape')
const puppeteer = require('puppeteer')
const offline = require('../test-utils/offline')

test.only('Testing user signup and update flow', async t => {
  await offline.start()
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  // SIGNUP FLOW
  await page.goto(`${API_DOMAIN_LOCAL}/signup`, { waitUntil: 'networkidle2' })

  const signupPageTitle = await page.title()

  t.equals(signupPageTitle, 'Sign Up')

  const getSignupCsrfEl = await page.$('input[name="csrf_token"]')

  const getSignupCsrf = await page.evaluate(input => input.value, getSignupCsrfEl)

  t.true(getSignupCsrf, 'Get signup has an input with value for csrf token')

  // Fill out the signup form
  await page.$eval('input[name="email"]', el => (el.value = 'jane@doe.com'))
  await page.$eval('input[name="password1"]', el => (el.value = '123!@#qweQWE'))
  await page.$eval('input[name="password2"]', el => (el.value = '123!@#qweQWE'))

  await page.click('button[type="submit"]')

  // Check success page
  const signupSuccessTitle = await page.title()
  t.equals(signupSuccessTitle, 'Successful Signup')

  // TODO Check page message

  // LOG IN FLOW
  await page.goto(`${API_DOMAIN_LOCAL}/login`, { waitUntil: 'networkidle2' })

  const loginPageTitle = await page.title()
  t.equals(loginPageTitle, 'Log In')

  // Fill in the login form
  await page.$eval('input[name="email"]', el => (el.value = 'jane@doe.com'))
  await page.$eval('input[name="password"]', el => (el.value = '123!@#qweQWE'))
  await page.click('button[type="submit"]')

  // Check the dashboard
  const userDashPageTitle = await page.title()
  t.equals(userDashPageTitle, 'Dashboard')

  // TODO Test that the inputs are prefilled with the signup information.
  // TODO TEST UPDATE USER FLOW

  await browser.close()
  await offline.stop()
  t.end()
})
