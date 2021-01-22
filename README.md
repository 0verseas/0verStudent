# 0verStudent


## Install
```
git clone https://github.com/0verseas/0verStudent.git
cd 0verStudent
npm install
cp src/env.js.example src/env.js
```
edit the config file in `src/env.js`

## Run
```
npm run serve
```

## Deploy
```
npm run build
```
the built static files will be in the `dist`

## docker
### Install
```
git clone https://github.com/0verseas/0verStudent.git
cd 0verStudent
cp src/env.js.example src/env.js
cp docker/.env.example docker/.env
```
edit the config file in `src/env.js`, `docker/docker-compose.yaml` and `docker/.env`

### deploy
#### build
```
docker run -it --rm -v $PWD:/0verStudent -w /0verStudent node:8.12.0 sh -c 'npm install && npm run build'
```
#### Run
```
cd docker
docker-compose up -d
```

#### stop
```
docker-compose down
```
