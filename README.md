# devopshub

Simple social network for developers build with React, Express and Mongo database.
User could sign up and make the profile, share posts or leave comment on other posts.

## Quick Start

### Install dependencies for client and server:
```
 > npm install
```
```
 > npm run client-install
```

- Create 'keys_dev.js' in root config folder with these mongoURI and secret key:
```
    module.exports = {
      mongoURI: 'yourMongoURI',
      secretOrKey: 'yourSecretKey'
    };
```

- Run the client and server at the same time with concurrently:
```
 > npm run dev
```

