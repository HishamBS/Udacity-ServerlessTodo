// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'zgcw2se4g1'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-2.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-wpgah9y1.auth0.com', // Auth0 domain
  clientId: 'HNwKlp8v8Zb3EOClHPF0NoLbrGKeG5UP', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
