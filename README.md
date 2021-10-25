# zkCREAM Interface

[![Reducer Tests](https://github.com/zkcream/zkcream-interface/actions/workflows/reducer.yml/badge.svg)](https://github.com/zkcream/zkcream-interface/actions/workflows/reducer.yml)

## set up `.env` file from `.env.sample`

```bash
cp .env.sample .env
```

### sample setup

```
REACT_APP_VERSION=$npm_package_version
REACT_APP_SUPPORTED_NETWORK=1337
REACT_APP_URL=http://localhost:8545
REACT_APP_ZKCREAM_FACTORY_ADDRESS=0x38cF23C52Bb4B13F051Aec09580a2dE845a7FA35
REACT_APP_MERKLETREE_HEIGHT=4
REACT_APP_ZERO_VALUE=2558267815324835836571784235309882327407732303445109280607932348234378166811
REACT_APP_API_HOST=http://localhost:3000
REACT_APP_INFURA_KEY="XXXXXXXXXXXXXXXX"
REACT_APP_API_USERNAME="aaa"
REACT_APP_API_PASSWORD="bbb"
```

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