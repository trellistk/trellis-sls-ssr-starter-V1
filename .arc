@app
nouri-serverless

@tables
nouri
  pkey *String
  skey **String

@http
post /message

@aws
# profile default
# region us-west-1
  