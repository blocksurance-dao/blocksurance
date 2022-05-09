# BLOCKSURANCE dApp

![alt text](https://github.com/blocksurance-dao/blocksurance/blob/master/src/assets/images/BlocksuranceWeb1.png)

[![Netlify Status](https://api.netlify.com/api/v1/badges/b654c94e-08a6-4b79-b443-7837581b1d8d/deploy-status)](https://app.netlify.com/sites/blocksurance/deploys)

**Coin:** View BLOCKSURANCE (4SURE) ERC20 Token on [etherscan](https://etherscan.io/address/0x88888883D7434785e02AC8475B9c9E7b1d3Dd293).

**DAO:** BLOCKSURANCE DAO is live on [Snapshot](https://snapshot.org/#/0xswinger.eth/about)!

**Whitepaper:** Read our [whitepaper](https://github.com/blocksurance-dao/blocksurance/blob/master/blocksurance-whitepaper.pdf)!

**Read the docs:** BLOCKSURANCE uses [Gitbook](https://app.gitbook.com/s/ocbyKL4UiuV5pJEQXQqN/)!

**Note:** BLOCKSURANCE uses [Web3](https://github.com/ethereum/web3.js#readme).

This repo contains the BLOCKSURANCE dApp that is built with [React](https://reactjs.org/), and [Web3](https://github.com/ethereum/web3.js#readme): **[Website Link](https://blocksurance.io/)**.

It follows the [JAMstack architecture](https://jamstack.org) by using Git as a single source of truth, and [Netlify](https://www.netlify.com) for continuous deployment, and CDN distribution.

## Features

- A simple landing page built with styled-components
- Landing, About, FAQ, and Contact page built with Chakra UI
- Basic directory organization
- Separate components for everything
- Core dApp built with React and Web3
- Netlify deploy configuration
- Netlify function support, see `netlify/functions` folder
- ..and more

## Prerequisites

- Minimal Node.js version 14.15.0
- [Netlify CLI](https://github.com/netlify/cli)

## Getting Started (Recommended)

### Access Locally

Pulldown a local copy of the Github repository Netlify created for you, with the name you specified in the previous step

```
$ git clone https://github.com/[blocksurance-dao]/[blocksurance].git
$ cd [blocksurance]
$ yarn
$ netlify dev # or ntl dev
```

This uses [Netlify Dev](https://www.netlify.com/products/dev/?utm_source=blog&utm_medium=netlifycms&utm_campaign=devex) CLI feature to serve any functions you have in the `netlify/functions` folder.

## Debugging

Windows users, who aren't using [WSL](https://docs.microsoft.com/en-us/windows/wsl/about), might encounter `node-gyp` errors when trying to npm install.
To resolve, make sure that you have both Python 2.7 and the Visual C++ build environment installed.

```
npm config set python python2.7
npm install --global --production windows-build-tools
```

[Full details here](https://www.npmjs.com/package/node-gyp "NPM node-gyp page").

MacOS and WSL users who might also encounter some errors, check [node-gyp](https://github.com/nodejs/node-gyp) for more info. We recommend using the latest stable node version.

# CONTRIBUTING

Contributions are always welcome, no matter how large or small. Before contributing,
please read the [code of conduct](CODE_OF_CONDUCT.md).
