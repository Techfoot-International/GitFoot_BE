// db.js
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('techfoot_techmaps_db_test', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

const DomainObject = sequelize.define('DomainObject', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Property = sequelize.define('Property', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  domainobject_id: { // Change the column name to 'domainobject_id'
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

const Method = sequelize.define('Method', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  domainobject_id: { // Change the column name to 'domainobject_id'
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

const Output = sequelize.define('Output', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  method_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

const Input = sequelize.define('Input', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  method_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Define Associations
DomainObject.hasMany(Property, { foreignKey: 'domainobject_id' });
DomainObject.hasMany(Method, { foreignKey: 'domainobject_id' });
Method.hasMany(Output, { foreignKey: 'method_id' });
Method.hasMany(Input, { foreignKey: 'method_id' });

sequelize.sync()
  .then(() => {
    console.log('Database and tables are synchronized.');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

module.exports = { DomainObject, Property, Method, Output, Input };
