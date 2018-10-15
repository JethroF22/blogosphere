# Blogosphere
   
A blogging web application built with the MERN stack
---

## Installing

- To install, run `npm install`
- To run the Express server, run `npm start`
- For the React app:
  - To run the development app, run ```npm run dev-server```. The React app will then be served using `webpack-dev-server`
  - To run the production app, run `npm run build` to bundle the React app using Webpack. The bundled code will then be served by the Express server
- To run the back-end tests, run `npm `run test-express`
- To run the front-end tests, run `npm `run test-react`

## Built With

- [Nodejs](https://nodejs.org/en/), [Expressjs](http://expressjs.com), [Mongodb](https://www.mongodb.com) and [Mongoose](https://mongoosejs.com) for the REST API
- [React.js](https://reactjs.org) for the user interface
- [Redux](https://redux.js.org) for state management and dispatching asynchronous API request
- [Webpack](https://webpack.js.org/) for module bundling and running a React development server
- [Babel.js](https://babeljs.io/) for transpiling ES6+ code
- [Mocha](https://mochajs.org), [Chai](https://www.chaijs.com), [Jest](https://jestjs.io) and [Enzyme](https://airbnb.io/enzyme/) for testing
   
## User Roles
   
- Unauthenticated users can:
  - Create an account
  - Read articles
  - View user profiles
- Authenticated users can do everything unauthenticated users can do, as well as:
  - Create/edit/delete/like articles
  - Create/edit their user profiles
  - Follow other users

