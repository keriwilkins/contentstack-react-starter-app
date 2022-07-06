[![Contentstack Logo](/public/contentstack.png)](https://www.contentstack.com/)

## E2E for Marketplace Starter App using playwright

This e2e test case cover e2e installation flow and cancellation flow for marketplace starter apps including github login, vercel login and vercel deployment.

## Prerequisites

- Node.js 14 and above.
- Organization with stack creating access.
- Access to marketplace.
- Github account in which 2FA is not enabled.
- Vercel account of this Github account.

## Required env config

**_NOTE:_** rename <mark>.env.sample</mark> to <mark>.env</mark> and add required config details.

```

APP_HOST_URL= app_host_url
BASIC_AUTH_USERNAME = stag_login (only for stag)
BASIC_AUTH_PASSWORD = stag_login (only for stag)
CONTENTSTACK_ORGANIZATION_UID = org_uid
CONTENTSTACK_STARTER_APP = React Starter
CONTENTSTACK_LOGIN = contentstack_login
CONTENTSTACK_PASSWORD = contentstack_password
GITHUB_LOGIN_ID= github_login
GITHUB_PASSWORD= github_password
BASE_API_URL= api_host_url
SECRET_KEY= 2FA secret key
GIT_OWNER_NAME= github userId
GITHUB_TOKEN= github personal token
VERCEL_TOKEN= vercel access token

```

> **_NOTE:_** How to generate [[2FA Secret code](https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication)]
