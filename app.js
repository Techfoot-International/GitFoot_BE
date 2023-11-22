const express = require('express');
const bodyParser = require('body-parser');
const { DomainObject, Property, Method, Output, Input } = require('./db');
const cors = require('cors');
app.use(cors());

const app = express();
const port = process.env.PORT || 3000;

// Database Configuration
const sequelize = require('./db').sequelize;

// Define Associations
DomainObject.hasMany(Property, {
  foreignKey: 'domainobject_id',
  as: 'properties',
});
DomainObject.hasMany(Method, { foreignKey: 'domainobject_id', as: 'methods' });
Method.hasMany(Output, { foreignKey: 'method_id', as: 'outputs' });
Method.hasMany(Input, { foreignKey: 'method_id', as: 'inputs' });

// Sync the models with the database
sequelize
  .sync()
  .then(() => {
    console.log('Database and tables are synchronized.');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

// Middleware
app.use(bodyParser.json());

// Route to receive data from React frontend and save it to the database
app.post('/domainobject', async (req, res) => {
  try {
    const { name, properties, methods } = req.body;

    // Create a new DomainObject
    const newDomainObject = await DomainObject.create({ name });

    // Iterate over properties and create records in the Properties table
    for (const property of properties) {
      // Set the domainobject_id to associate the Property with the DomainObject
      property.domainobject_id = newDomainObject.id;
      await Property.create(property);
    }

    // Iterate over methods and create records in the Methods table
    for (const methodData of methods) {
      const { name: methodName, inputs, outputs } = methodData;

      const newMethod = await Method.create({
        name: methodName,
        type: 'method',
        domainobject_id: newDomainObject.id,
      });

      // Create records in the Output table for method outputs
      for (const outputType of outputs) {
        await Output.create({
          name: outputType.name,
          type: outputType.type,
          method_id: newMethod.id,
        });
      }

      // Create records in the Input table for method inputs
      for (const inputData of inputs) {
        await Input.create({
          name: inputData.name,
          type: inputData.type,
          method_id: newMethod.id,
        });
      }
    }

    res.status(201).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to fetch domain objects
app.get('/domainobject', async (req, res) => {
  try {
    const domainObjects = await DomainObject.findAll({
      include: [
        {
          model: Property,
          as: 'properties',
        },
        {
          model: Method,
          as: 'methods',
          include: [
            {
              model: Output,
              as: 'outputs',
            },
            {
              model: Input,
              as: 'inputs',
            },
          ],
        },
      ],
    });

    res.status(200).json(domainObjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
