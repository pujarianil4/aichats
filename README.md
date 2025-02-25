# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` with `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```

## Installation

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version **recommended**)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)

### Steps to Install

1. Clone the repository:

   ```sh
   git clone https://github.com/pujarianil4/aichats.git
   cd your-repo-name
   ```

2. Install dependencies:

   ```sh
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```sh
   npm run dev
   # or
   yarn dev
   ```

## Building for Production

To create a production build, run:

```sh
npm run build
# or
yarn build
```

The build files will be available in the `dist` folder.

## Running the Production Build

After building the project, you can preview it locally:

```sh
npm run preview
# or
yarn preview
```

## Contributing

Feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License.
