# Cypress Testing with React - Simple Tutorial

- Video tutorial [here](https://www.youtube.com/watch?v=6BkcHAEWeTU&t=44s)

- Official Cypress site [here](https://www.cypress.io/)
- Official Cypress [docs](https://docs.cypress.io/guides/overview/why-cypress)
- navigate to the root of your project - I'm using a basic `create vite@latest` react project
- install `npm i cypress --save-dev`
- open Cypress: `npx cypress open`
- Cypress facilitates E2E and component testing
- here we will use E2E testing
  - choose end to end testing
  - hit continue
- choosing browser
  - stuff tends to work in Electron or Chrome
  - obviously you want to make sure your site works in the browsers that your users are using
- choose Electron
- click 'Start E2E Testing in Electron'
- note, we have a cypress folder in our project
  - inside the cypress folder, we have `fixtures` and `support` folders
- in cypress application, click `create new spec`
  - a spec is essentially a test file
- we see this modal:
  <img width="720px" height="338px" src="./Screenshot 2023-12-05 125725.png" alt="modal menu in cypress to enter path for a new spec file">
- update the spec path to: `cypress\e2e\firstTest.cy.js`
- click `Okay, run the spec`
- this adds an `e2e` folder in our `cypress` folder
  - in there we have a firstTest.cy.js file that contains our test
- your test also runs in the Cypress application

### Error warnings in firstTest.cy.js

- there are errors in the firstTest file
  - the tutorial is using TypeScript, so they have a tsconfig.json
  - some of this may apply if I want to add a jsconfig.json
- ChatGPT provides the following jsconfig.json:

```js
{
  "compilerOptions": {
    "baseUrl": ".",
    "jsx": "react",
    "target": "esnext",
    "module": "esnext",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true
  },
  "include": [
    "src/**/*.js",
    "src/**/*.jsx",
    "cypress/**/*.js",
    "cypress/**/*.jsx"
  ],
  "exclude": ["node_modules", "dist", "build", ".vite"]
}
```

- note, in the vid tutorial, we add `cypress` to our include
  - this is because cypress is outside the src folder
  - by including the cypress folder, we are telling our jsconfig to look in the cypress folder
  - this step doesn't actually fix any of my errors, but I'm not using TypeScript! Still worth doing for more understanding of config files
- ESLint errors
- there are various ways (it seems) to 'fix' these warnings
  - add this to your `.eslintrc.cjs`:
  ```js
   globals: {
    cy: true,
    it: true,
    describe: true,
  },
  ```
- not the best really
- OR update your ignorePatterns:

```js
ignorePatterns: ["dist", ".eslintrc.cjs", "cypress"],
```

- probably also not the best way
- another, and possibly the best (actually I have no idea) solution:
  - install: `npm install eslint-plugin-cypress --save-dev`
  - update the eslint config plugin list

```js
 extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:cypress/recommended",
  ],
```

## Writing tests for our own app

- here, the tutorial tests a todo app that they have available
- I will test my create vite@latest react app
- start your app locally - `npm run dev`
- we update our test with the url for our locally running app:

```js
describe("template spec", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000/");
  });
});
```

- in our App.jsx we have a h1 tag:

```js
<h1>Vite + React</h1>
```

- add a data-testid to the h1 of `cypress-title`
- add this to our test:

```js
cy.get('[data-testid="cypress-title"]').should("exist");
```

- save and it runs on save, and we see the test passes
- in addition to rendering, does it have the right text?
  - we can chain `should`

```js
cy.get('[data-testid="cypress-title"]')
  .should("exist")
  .should("have.text", "Vite + React");
```

- To get intellisense for Cypress working, update your jsconfig.json:

```js
{...
    "types": ["cypress"]
  },
  "include": [
    "src/**/*.js",
    "src/**/*.jsx",
    "cypress/**/*.js",
    "cypress/**/*.jsx",
    "./node_modules/cypress"
  ],
```

- here, we added `"types": ["cypress"]` and `"./node_modules/cypress"`
- alternatively, you can enable intellisense on a per file basis by adding this to the top of each file:

```js
/// <reference types="Cypress" />
```

- at this point, if we want to somewhat follow the tutorial, we need to mock an API
  - install json-server
  - create a `db.json` with some data in it
    - place it in root of your project

```js
{
  "items": [
    {
      "id": 1,
      "todo": "item 1"
    },
    {
      "id": 2,
      "todo": "item 2"
    },
    {
      "id": 3,
      "todo": "item 3"
    },
    {
      "id": 4,
      "todo": "item 4"
    }
  ]
}
```

- install `axios`
- we need useEffect, update your App.jsx:

```js
useEffect(() => {
  const getData = async () => {
    try {
      const { data } = await axios("http://localhost:3001/items");
      setData(data);
    } catch (err) {
      console.log(err);
    }
  };
  getData();
}, []);
```

- render our fetched data

```js
{
  data
    ? data.map((item) => {
        return (
          <h4 data-testid={`cypress-todo-${item.id}`} key={item.id}>
            {item.todo}
          </h4>
        );
      })
    : null;
}
```

- run `json-server` on port 3001 (I'm using 3000 for App server) - `json-server --watch db.json --port 3001`
- now when our app loads, we fetch our data and render it on the page
- testing for our rendered data, this DOES NOT work:

```js
db.items.forEach((item) => {
  const itemGet = `'[data-testid="cypress-todo-${item.id}"]'`;
  cy.get(itemGet).should("exist");
});
```

- this does work!

```js
cy.get('[data-testid="cypress-todo-1"').should("exist");
```

- in the Cypress app, you can right click and inspect elements
- clicking on an element will reveal information about it in the console:
  <img width="1422px" height="717px" src="./Screenshot 2023-12-05 180802.png" alt="the Cypress app, inspecting an assert command in the console">
