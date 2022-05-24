# 0verStudent

## Deploy Local Develop Environment
### Install
```
git clone https://github.com/0verseas/0verStudent.git
cd 0verStudent
npm install
cp src/env.js.example src/env.js
```
edit the config file in `src/env.js`

### Run
```
npm run serve
```

### Deploy
```
npm run build
```
the built static files will be in the `dist`

## Deploy Docker Develop Environment
Just need to modify related documents(src/env.js, .env, docker-compose.yaml)

First of all, git clone https://github.com/0verseas/0verStudent.git than switch folder to 0verStudent/, and do below
  - ``cd 0verStudent/``
    - switch git branch
      - ``sudo git checkout dev``
    - ``sudo cp src/env.js.example src/env.js``
    - edit src/env.js (modify baseUrl, year, reCAPTCHA_site_key)
    - docker build
      - ``sudo docker run -it --rm -v $PWD:/0verStudent -w /0verStudent node:14.16.0 sh -c 'npm install && npm run build'``

Secondly, switch folder to 0verStudent/docker/ and do below
- ``cd docker/``
  - ``sudo cp .env.example .env``
  - edit .env (modify NETWORKS)
  - edit docker-compose.yaml (modify the container's label which "traefik.http.routers.student.rule=Host(`` `input student's domain name here` ``)")

Finally, did all the above mentioned it after that the last move is docker-compose up
- ``sudo docker-compose up -d``

If want to stop docker-compose
- ``sudo docker-compose down``
