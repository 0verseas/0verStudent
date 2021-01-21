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
```
edit the config file in `src/env.js`  
add nginx setting into `nginx` folder

### deploy
#### Run
```
cd docker
docker-compose up -d
```

#### stop
```
docker-compose down
```
