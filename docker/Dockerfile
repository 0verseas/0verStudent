From node:8.12.0

# Add UID '1000' to www-data
#RUN usermod -u 1000 www-data

# Copy existing application directory permissions
COPY --chown=www-data:www-data ./app /var/www/html/0verStudent

# cp .env.example .env
#COPY --chown=www-data:www-data ./app/src/env.js.example /var/www/html/0verStudent/src/env

WORKDIR /var/www/html/0verStudent

RUN npm install && npm cache clean --force 
#&& npm run build

CMD npm run serve
