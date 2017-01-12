import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

import { dbUrl } from '../../../config';

const sequelize = new Sequelize(dbUrl, { logging: false });
const db = {};

fs.readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
  })
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    const modelName = model.name.charAt(0).toUpperCase() + model.name.slice(1);
    db[modelName] = model;
  });

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
