# hapi-login

A demonstration of how to use refresh tokens using hapi.js

## Local Setup

1. Ensure you have [nvm](https://github.com/nvm-sh/nvm#install--update-script) and [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) installed
2. Run `nvm use` and install the desired version
3. Run `npm ci`
4. Using the output of the following command (run it twice), add the below environment variables to your `.bashrc` or similar. Be sure to source your terminal afterwards:

```bash
# command
$ node -e "console.log(require('crypto').randomBytes(64).toString('hex'));"

# variables
export HAPI_LOGIN_ACCESS_TOKEN_SECRET="<first_output>"
export HAPI_LOGIN_REFRESH_TOKEN_SECRET="<second_output>"
```

5. Run `npm start`

## Demo Instructions

Within [routes.http](src/routes.http), send a request to the `/login` endpoint. Enter a username when prompted. Within 5 seconds, send a request to `/greet`. Notice that after 5 seconds your access token will expire and must be refreshed. Send a request to `/refresh` to continue greeting the user. Now send a request to `/logout`. Attempt to refresh your access token and observe that with your refresh token now invalidated, you cannot request another access token without logging in again

## References

- https://www.youtube.com/watch?v=mbsmsi7l3r4
- https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/
