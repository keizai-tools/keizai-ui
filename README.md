# template-ui-vite-react

Template for building Web Apps using React + Vite.

# Features

- React
- Vite
- Tailwind
- React Router
- Eslint
- Prettier
- Husky
- lint-staged
- editorconfig
- Cypress with code coverage

# Setup

> ⚠️ We recommend using [Visual Studio Code](https://code.visualstudio.com/) as well as the extensions for [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode), [Eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) for development.

> ⚠️ We recommend using Node version 16.x. Check [nvm](https://github.com/nvm-sh/nvm).

1. `npm ci` to install dependencies.
2. Copy contents of `.env.dist` into a `.env` file and populate it. Ensure that environment variables have the prefix `VITE_`.

For example:

If your application requires a API_BASE_URL, name the enviroment variable "VITE_API_BASE_URL" in the '.env' file.

# How to run

```
npm run build # Create a production build
npm run start:prod # Run app in production
npm run start:dev # Run app in development

```

# Testing

```
npm run test:ui # Run UI tests in headless mode
npm run test:ui:dev # Run UI in browser mode
```

# Useful commands

```
npm run lint # Run linter
npm run format # Run formatter
```

# Issues

Files that are not tested are displayed in the final cypress report as having "empty" coverage. They should display 0% coverage.

![image](https://user-images.githubusercontent.com/60404954/236656815-84ee0d06-8375-4509-9578-c8ff2436c9c2.png)

- https://github.com/cypress-io/code-coverage/issues/539
- https://github.com/cypress-io/code-coverage/issues/552

# References

- [React docs](https://react.dev/learn)
- [Vite docs](https://vitejs.dev/guide/)
- [Vite + Tailwind setup](https://tailwindcss.com/docs/guides/vite)
- [React Router docs](https://reactrouter.com/en/main)
- [eslint + prettier + editorconfig setup](https://dev.to/npranto/how-i-setup-eslint-prettier-and-editorconfig-for-static-sites-33ep)
- [Husky docs](https://github.com/typicode/husky)
- [lint-staged docs](https://github.com/okonet/lint-staged)
- [Vite path aliasing](https://dev.to/avxkim/setup-path-aliases-w-react-vite-ts-poa)
- [Cypress docs](https://docs.cypress.io/guides/overview/why-cypress)
- [Vite + React + Cypress + coverage](https://medium.com/@nelfayran/cypress-react-and-vite-collaboration-bed6761808fc)
- [@cypress/code-coverage docs](https://github.com/cypress-io/code-coverage)
- [nyc docs](https://github.com/istanbuljs/nyc)
