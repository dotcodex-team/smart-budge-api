import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
// import Redis from 'ioredis';
// import RedisAdaptor from 'sequelize-transparent-cache-ioredis';
// import sequelizeCache from 'sequelize-transparent-cache';

// const redis = new Redis();
// const redisAdaptor = new RedisAdaptor({
//   client: redis,
//   namespace: 'model',
//   lifetime: 60 * 60
// });
// const { withCache } = sequelizeCache(redisAdaptor);

const env = process.env.NODE_ENV || 'development';
// eslint-disable-next-line
const config = require(`${__dirname}/../config/index.js`)[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

const models = Object.assign(
  {},
  ...fs
    .readdirSync(__dirname)
    .filter((file) => file.indexOf('.') !== 0 && file !== 'index.js')
    .map((file) => {
      // eslint-disable-next-line
      const model = require(path.join(__dirname, file)).default;

      return {
        // [model.name]: withCache(model.init(sequelize, Sequelize))
        [model.name]: model.init(sequelize, Sequelize)
      };
    })
);

// eslint-disable-next-line
for (const model of Object.keys(models)) {
  // eslint-disable-next-line
  typeof models[model].associate === "function" &&
    models[model].associate(models);
}

const db = {
  ...models,
  sequelize,
  Sequelize
};

module.exports = db;
