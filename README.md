# zkCREAM Interface

[![Reducer Tests](https://github.com/zkcream/zkcream-interface/actions/workflows/reducer.yml/badge.svg)](https://github.com/zkcream/zkcream-interface/actions/workflows/reducer.yml)

## start app

```bash
yarn start
```

## local development

1. Start ipfs and ganache

```bash
yarn local
```
This command will start `ipfs` docker container and `ganache`.

2. Migrate zkcream contract

```bash
git clone https://github.com/couger-inc/cream.git
cd cream
yarn
yarn build
cd packages/contracts
yarn migrate
```

3. Start api server

```bash
git clone https://github.com/zkcream/zkcream-api-server.git
cd zkcream-api-server
yarn
yarn buid
yarn start
```

This command will run backend api-server for web frontend

4. Start frontend

```bash
yarn start
```