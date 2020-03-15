# Nouri Serverless Application <!-- omit in toc -->

This project is to help us to manage family and delivery data.

## Table of Contents <!-- omit in toc -->

- [Technologies](#technologies)
- [Quick Start](#quick-start)
- [Repository Quick Overview](#repository-quick-overview)
- [Troubleshooting](#troubleshooting)

## Technologies

- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Serverless](https://www.serverless.com/framework/docs/getting-started/)
  - [Offline](https://www.npmjs.com/package/serverless-offline)
- AWS
  - [API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html)
  - [Lambda](https://aws.amazon.com/lambda/)
  - [DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html)
  - [CloudFormation](https://aws.amazon.com/cloudformation/)
- Testing
  - [Tape](https://github.com/substack/tape)

## Quick Start

1. Clone the repo
   
   ```bash
   git clone https://github.com/nourimeals/nouri-serverless.git
   ```

2. Install the serverless CLI

   ```bash
   npm install -g serverless
   ```

3. Install npm packages/dependencies

   ```bash
   npm i
   ```

4. Install serverless plugins

   ```bash
   sls dynamodb install
   ```

5. Run the app locally

   ```bash
   sls offline start
   ```

Available routes will be printed out in the terminal.

## Repository Quick Overview
- .github: github actions for our CI/CD pipeline
- database
  - dynamodb.js: helps us run the aws dynamodb client
- helpers
  - db.js: database calls to DynamoDB
  - logger.js: logging helper
  - response.js: http response helper.
- src
  - functions: ourlambda functions:
    - authorize.js: middleware function that gates requests that use bearer tokens.
  - schema: schemas for post requests which API Gateway uses for validating requests.
  - tests: contains tests against the app
    - test-utils: helpers for running the tests
      - data_factories: generates data for testing
      - offline: runs serverless in a child process so we can run integration tests against it.
- package.json: You can find scripts to run the app here
- serverless.yaml: Serverless settings and route declarations

## Troubleshooting

- Database Validation Error: Check if the keys are all there. If developing locally with offline and changes to the db schema has happened recently, delete ``shared-local-instance-db`` to reset the local table.
