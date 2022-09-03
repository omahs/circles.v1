# Spect circles

## Overview

Spect is a playground of coordination tools for DAO contributors to manage projects and fund each other.

## Techs Used

Spect makes use of the following technologies on the frontend:

- NextJS
- TypeScript
- Ethers js
- Alchemy

## Setting up locally

### Installation of software

To run the repository successfully, we’d need Node to be installed locally.

Node can be installed by visiting [https://nodejs.org](https://nodejs.org), downloading and installing the preferred version.

Confirm you have Node installed, by entering the following command in a new terminal

```bash
node -v
```

### Cloning of the repository

Spin up your terminal, navigate to the folder where you’d like the project repo to be stored, and run the following commands

```bash
git clone https://github.com/spect-ai/circles.v1
```

This should clone the project repository to your local machine, where you can run and test locally.

### Installation

Upon successful cloning of the repository, spin up your terminal and navigate to the project folder.

If you do not have yarn installed, visit [https://yarnpkg.com/getting-started/install](https://yarnpkg.com/getting-started/install) and follow the instructions to install.

 Run the following command in the project repository

```bash
yarn install
```

This should install all the required dependencies to successfully run the project locally.

### Setting up your environmental variables

In order to run the project successfully, you’d need the environmental variables, setup in the .env file.

In your .env file, we’d define these variables;

DEV_ENV (This would specify whether it’s a local or production environment)

ALCHEMY_KEY (This is not necessary, as it’s needed for Gnosis payments)

WEB3_STORAGE_TOKEN (This can be generated by visiting the web3 storage website)

API_HOST (This is dependent on your env settings on the backend repository)

```env
DEV_ENV=local
ALCHEMY_KEY=
WEB3_STORAGE_TOKEN=
API_HOST=
```

### Running the repo

With the dependencies installed, and your environment variables all defined, run the following command.

```bash
yarn dev
```

This should serve the project on localhost, port 3000. Visit the URL and view your changes.

## Git Commit Rules

### Revert

If the commit reverts a previous commit, it should begin with revert:, followed by the header of the reverted commit. In the body it should say: This reverts commit < hash >., where the hash is the SHA of the commit being reverted.

### Type

Must be one of the following:

- feat: A new feature
- fix: A bug fix
- docs: Documentation only changes
- style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- refactor: A code change that neither fixes a bug nor adds a feature
- perf: A code change that improves performance
- test: Adding missing tests
- chore: Changes to the build process or auxiliary tools and libraries such as documentation generation

### Example

For a commit which should state that updates where made to the overview page, the commit message would be modelled like this:

```bash
chore: minor updates on overview page
```
