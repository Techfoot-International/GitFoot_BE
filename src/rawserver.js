const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:3001", // Replace with your frontend URL
  })
);

const sequelize = new Sequelize(
  "techfoot_techmaps_db_test", // Replace with your database name
  "root", // Replace with your database user
  "", // Replace with your database password
  {
    host: "localhost",
    dialect: "mysql",
  }
);

const DomainObject = sequelize.define("DomainObject", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Property = sequelize.define("Property", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
  },
});

const Method = sequelize.define("Method", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Output = sequelize.define("Output", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
  },
});

const Input = sequelize.define("Input", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
  },
});

const NewTable = sequelize.define("NewTable", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const NewTableProperties = sequelize.define("NewTableProperties", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
  },
  newtable_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

const Dotrelation = sequelize.define("Dotrelation", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  newtable_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  domainobject_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Associations
DomainObject.hasMany(Property, { foreignKey: "domainobject_id" });
DomainObject.hasMany(Method, { foreignKey: "domainobject_id" });
Method.hasMany(Output, { foreignKey: "method_id" });
Method.hasMany(Input, { foreignKey: "method_id" });
NewTable.hasMany(NewTableProperties, { foreignKey: "newtable_id" });
NewTable.belongsToMany(DomainObject, {
  through: Dotrelation,
  foreignKey: "newtable_id",
});
DomainObject.belongsToMany(NewTable, {
  through: Dotrelation,
  foreignKey: "domainobject_id",
});

sequelize
  .sync()
  .then(() => {
    console.log("Database and tables are synchronized.");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });

app.use(bodyParser.json());

// Existing routes

app.get("/domainobject", async (req, res) => {
  try {
    const domainObjects = await DomainObject.findAll();
    res.json(domainObjects);
  } catch (error) {
    console.error("Error fetching domain objects:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/domainobject", async (req, res) => {
  try {
    const { name, properties, methods } = req.body;

    const newDomainObject = await DomainObject.create({ name });

    for (const property of properties) {
      property.domainobject_id = newDomainObject.id;
      await Property.create(property);
    }

    for (const methodData of methods) {
      const { name: methodName, inputs, outputs } = methodData;

      const newMethod = await Method.create({
        name: methodName,
        type: "method",
        domainobject_id: newDomainObject.id,
      });

      for (const outputType of outputs) {
        await Output.create({
          name: outputType.name,
          type: outputType.type,
          method_id: newMethod.id,
        });
      }

      for (const inputData of inputs) {
        await Input.create({
          name: inputData.name,
          type: inputData.type,
          method_id: newMethod.id,
        });
      }
    }

    res.status(201).json({ message: "Data saved successfully" });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/domainobject/:name", async (req, res) => {
  try {
    const { name } = req.params;

    const domainObject = await DomainObject.findOne({
      where: { name },
      include: [
        {
          model: Property,
        },
        {
          model: Method,
          include: [
            {
              model: Input,
            },
            {
              model: Output,
            },
          ],
        },
      ],
    });

    if (!domainObject) {
      return res.status(404).json({ error: "DomainObject not found" });
    }

    res.json(domainObject);
  } catch (error) {
    console.error("Error fetching domain object by name:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/newtable", async (req, res) => {
  try {
    const newTables = await NewTable.findAll();
    res.json(newTables);
  } catch (error) {
    console.error("Error fetching new tables:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/newtable", async (req, res) => {
  try {
    const { name } = req.body;

    const newTable = await NewTable.create({ name });
    console.log("Table added successfully:", newTable);

    res.status(201).json({ message: "Table added successfully", table: newTable });
  } catch (error) {
    console.error("Error adding table:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/newtable/:newTableId/property", async (req, res) => {
  try {
    const { newTableId } = req.params;
    const { name, type } = req.body;

    const newTable = await NewTable.findByPk(newTableId);

    if (!newTable) {
      return res.status(404).json({ error: "NewTable not found" });
    }

    const newProperty = await NewTableProperties.create({ name, type, newtable_id: newTable.id });

    res.status(201).json({ message: "Property added successfully", property: newProperty });
  } catch (error) {
    console.error("Error adding property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/dotrelation", async (req, res) => {
  try {
    const { domainObjectId, newTableId } = req.body;

    // Create a new Dotrelation entry
    const dotRelation = await Dotrelation.create({
      domainobject_id: domainObjectId,
      newtable_id: newTableId,
    });

    res.status(201).json(dotRelation);
  } catch (error) {
    console.error("Error creating Dotrelation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/dotrelation", async (req, res) => {
  try {
    // Fetch Dotrelation data from the database
    const dotrelations = await Dotrelation.findAll();
    res.json(dotrelations);
  } catch (error) {
    console.error("Error fetching Dotrelation data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// New route for retrieving table details by name
app.get("/newtable/:tableName", async (req, res) => {
  try {
    const { tableName } = req.params;

    // Find the NewTable by name and include its properties
    const newTable = await NewTable.findOne({
      where: { name: tableName },
      include: [{ model: NewTableProperties }],
    });

    if (!newTable) {
      return res.status(404).json({ error: `Table ${tableName} not found` });
    }

    res.json(newTable);
  } catch (error) {
    console.error(`Error fetching table ${tableName}:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/domainobject/:id/linktable", async (req, res) => {
  try {
    const { id } = req.params;
    const { newTableId } = req.body;

    // Create a new Dotrelation entry
    const dotRelation = await Dotrelation.create({
      domainobject_id: id,
      newtable_id: newTableId,
    });

    res.status(201).json(dotRelation);
  } catch (error) {
    console.error("Error creating Dotrelation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// New route to retrieve linked or assigned tables for a domain object
app.get("/domainobject/:id/linkedtables", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the domain object by its ID and include the linked tables through the Dotrelation model
    const domainObject = await DomainObject.findByPk(id, {
      include: [
        {
          model: NewTable,
          through: Dotrelation, // Include linked tables through the Dotrelation model
        },
      ],
    });

    if (!domainObject) {
      return res.status(404).json({ error: "DomainObject not found" });
    }

    res.json(domainObject.NewTables); // Assuming the linked tables are in the NewTables property of the domainObject
  } catch (error) {
    console.error("Error fetching linked tables for the domain object:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = {
  DomainObject,
  Property,
  Method,
  Output,
  Input,
  NewTable,
  NewTableProperties,
};
