## Author
[Erick Wright]("https://github.com/wright15")

# For Wendell

This project is a automation test suite designed using BDD as a test philosophy. This allows encapsulation of functions in human readable language, allowing developers to program tests to business standards by using language derived directly from acceptance criteria or standards outlined in definition of done documentation.

This project uses cucumber and playwright for its framework.

## Installation
If you want to build a project from the ground up use the package manager [NPM](https://www.npmjs.com/) to install dependencies.

```bash
npm install --save-dev @cucumber/cucumber
```

```bash
npm init playwright@latest --yes -- --quiet --browser=chromium --browser=firefox --browser=webkit --gha
```

Make sure to prepare the file structure which the project is dependent on to run.

```bash
mkdir features
mkdir features/step_definitions
```
## Usage

```bash
.\node_modules\.bin\cucumber-js --tags "@Regression"
```
You can also specify tags that run specific features such as the Cards feature.

```bash
.\node_modules\.bin\cucumber-js --tags "@Cards"
```

## Test cases

Test steps have been organized by feature.

The features files hold the test steps in human readable language using BDD via Gherkin. 

The stepdefs.js file is for the logic that runs the scenarios. In the stepdefs.js file the code is organized by what feature the code corresponds to. This logic was written using JavaScript. 


## License

[MIT](https://choosealicense.com/licenses/mit/)