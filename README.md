# Nouri Serverless Application <!-- omit in toc -->

This project is to help us to manage family and delivery data.

## Table of Contents <!-- omit in toc -->

- [Technologies](#technologies)
- [Quick Start](#quick-start)

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
