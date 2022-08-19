# CircleCI Visual Configuration Editor

[![License](https://img.shields.io/github/license/CircleCI-Public/visual-config-editor)](https://github.com/CircleCI-Public/visual-config-editor/blob/main/LICENSE)
[![CircleCI](https://img.shields.io/circleci/build/gh/CircleCI-Public/visual-config-editor/main?logo=circleci)](https://app.circleci.com/pipelines/github/CircleCI-Public/visual-config-editor)

Generate your CircleCI configuration files by building a visual map of your
project's workflows.

This project is currently early preview. Features are subject to changes.

**[Try it out](https://circleci-public.github.io/visual-config-editor/)** for yourself! Fork the repo and **[contribute](CONTRIBUTING.md)** to help us make this amazing!

## Preview

<p align="center">
<img src=".github/preview.png?raw=true" alt="Preview of the CircleCI Visual Config Editor" width="75%" />
</p>

## Run Development Server

### With Docker

Using npm:

```shell
$ npm run start-docker
```

Using yarn:

```shell
$ yarn start-docker
```

### Without Docker

**Install**

Using npm:

```shell
$ npm install
```

Using yarn:

```shell
$ yarn install
```

After installing your dependencies, ensure are using the proper version of node by running NVM:

```shell
$ nvm use
```

**Start dev server**

Using npm:

```shell
$ npm run start
```

Using yarn:

```shell
$ yarn start
```

## Example Generated Config

```yml
# This configuration has been automatically generated by the CircleCI Config SDK.
# For more information, see https://github.com/CircleCI-Public/circleci-config-sdk-ts
# SDK Version: 0.9.0-alpha.15
# VCE Version: v0.10.1
# Modeled with the CircleCI visual config editor.
# For more information, see https://github.com/CircleCI-Public/visual-config-editor

version: 2.1
setup: false
jobs:
  build:
    steps:
      - checkout
      - run:
          command: yarn build
      - persist_to_workspace:
          root: ../
          paths:
            - build
    docker:
      - image: cimg/node:16.11.1
    resource_class: medium
  test:
    steps:
      - attach_workspace:
          at: .
      - run:
          command: yarn test
          working_directory: ~/project/build
      - persist_to_workspace:
          root: .
          paths:
            - build
    docker:
      - image: cimg/node:16.11.1
    resource_class: medium
  deploy:
    steps:
      - attach_workspace:
          at: .
      - run:
          command: yarn deploy
          working_directory: ~/project/build
    docker:
      - image: cimg/node:16.11.1
    resource_class: medium
workflows:
  build-and-test:
    jobs:
      - build
      - test:
          requires:
            - build
      - deploy:
          requires:
            - test
```

## Contributing

This repository welcomes community contributions! See our [CONTRIBUTING.md](CONTRIBUTING.md) for guidance on configuring your development environment and how to submit quality pull requests.

## Built with

[CircleCI Config SDK](https://github.com/CircleCI-Public/circleci-config-sdk-ts)
****
