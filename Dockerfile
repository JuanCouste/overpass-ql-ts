FROM node:14.17.5

COPY ./package.json /app/

WORKDIR /app/

RUN npm install

COPY ./src /app/src/
COPY ./test /app/test/

COPY ./tsconfig.json ./tsconfig.build.json ./jest.config.ts ./rollup.config.ts /app/

ENTRYPOINT ["npm", "test", "--"]
