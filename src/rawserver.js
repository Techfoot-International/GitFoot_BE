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

const UseCaseStep = sequelize.define("UseCaseStep", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  usecase_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

const TestCase = sequelize.define("TestCase", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  usecase_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

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

const Usecase = sequelize.define("Usecase", {
  name: DataTypes.STRING,
  description: DataTypes.STRING,
  objective: DataTypes.STRING,
  actors: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  preConditions: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  postConditions: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  // Remove the "steps" attribute, as it will be stored in a separate table
});

const ProductModuleRelation = sequelize.define("ProductModuleRelation", {
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  moduleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = ProductModuleRelation;

// Association to link Usecase with UseCaseStep
Usecase.hasMany(UseCaseStep, { foreignKey: "usecase_id" });

module.exports = Usecase;

const UsecaseRelation = sequelize.define("UsecaseRelation", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: true,
  },
  usecase_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usecase, // Reference the Usecase model
      key: "id",
    },
  },
  domainobject_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: DomainObject, // Reference the DomainObject model
      key: "id",
    },
  },
});

const Module = sequelize.define("Module", {
  name: DataTypes.STRING,
  description: DataTypes.STRING,
  // Define other module properties here
});

// Don't forget to sync the model with the database
Module.sync();

const ModuleUsecaseRelation = sequelize.define("ModuleUsecaseRelation", {
  moduleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Module,
      key: "id",
    },
  },
  usecaseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usecase,
      key: "id",
    },
  },
});

// Define the association
Module.belongsToMany(Usecase, {
  through: ModuleUsecaseRelation,
  foreignKey: "moduleId",
});

Usecase.belongsToMany(Module, {
  through: ModuleUsecaseRelation,
  foreignKey: "usecaseId",
});

// Define the association between modules and use cases
Module.belongsToMany(Usecase, {
  through: ModuleUsecaseRelation,
  foreignKey: "moduleId",
});

Usecase.belongsToMany(Module, {
  through: ModuleUsecaseRelation,
  foreignKey: "usecaseId",
});

// Define a Product model
const Product = sequelize.define("Product", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
});

// Define a ModuleProductRelation model to store the relations between products and modules
const ModuleProductRelation = sequelize.define("ModuleProductRelation", {
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: "id",
    },
  },
  moduleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Module,
      key: "id",
    },
  },
});
const Features = sequelize.define("Feature", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
});
const Feature = sequelize.define("Feature", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
});
const FeatureUsecaseRelation = sequelize.define("FeatureUsecaseRelation", {
  featureId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  usecaseId: {
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
Usecase.belongsToMany(DomainObject, {
  through: UsecaseRelation,
  foreignKey: "usecase_id",
});
DomainObject.belongsToMany(Usecase, {
  through: UsecaseRelation,
  foreignKey: "domainobject_id",
});
// Association to link UseCaseStep with Usecase
Usecase.hasMany(UseCaseStep, { foreignKey: "usecase_id" });
UseCaseStep.belongsTo(Usecase, { foreignKey: "usecase_id" });
Usecase.hasMany(TestCase, { foreignKey: "usecase_id" });
Product.belongsToMany(Module, {
  through: ModuleProductRelation,
  foreignKey: "productId",
});

Module.belongsToMany(Product, {
  through: ModuleProductRelation,
  foreignKey: "moduleId",
});

// Define the associations
Feature.belongsToMany(Usecase, {
  through: "FeatureUsecaseRelation",
  foreignKey: "featureId",
});

Usecase.belongsToMany(Feature, {
  through: "FeatureUsecaseRelation",
  foreignKey: "usecaseId",
});
// In the Feature model
Feature.belongsToMany(Usecase, {
  through: FeatureUsecaseRelation,
  foreignKey: "featureId",
});

// In the Usecase model
Usecase.belongsToMany(Feature, {
  through: FeatureUsecaseRelation,
  foreignKey: "usecaseId",
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

app.put("/domainobject/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, properties, methods } = req.body;

    // Find the domain object by ID
    const domainObject = await DomainObject.findByPk(id);

    if (!domainObject) {
      return res.status(404).json({ error: "Domain Object not found" });
    }

    // Update domain object properties and methods
    domainObject.name = name;
    await domainObject.save();

    // Update properties
    await Property.destroy({ where: { domainobject_id: id } });
    for (const property of properties) {
      await Property.create({
        name: property.name,
        type: property.type,
        domainobject_id: id,
      });
    }

    // Update methods
    await Method.destroy({ where: { domainobject_id: id } });
    for (const methodData of methods) {
      const newMethod = await Method.create({
        name: methodData.name,
        type: "method",
        domainobject_id: id,
      });

      for (const outputType of methodData.outputs) {
        await Output.create({
          name: outputType.name,
          type: outputType.type,
          method_id: newMethod.id,
        });
      }

      for (const inputData of methodData.inputs) {
        await Input.create({
          name: inputData.name,
          type: inputData.type,
          method_id: newMethod.id,
        });
      }
    }

    res.json({
      message: "Domain Object details updated successfully",
      domainObject,
    });
  } catch (error) {
    console.error("Error updating Domain Object:", error);
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

// New route for viewing tables
app.get("/newtable", async (req, res) => {
  try {
    const newTables = await NewTable.findAll();
    res.json(newTables);
  } catch (error) {
    console.error("Error fetching new tables:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// New route for viewing table details by name
app.get("/newtable/:tableName", async (req, res) => {
  try {
    const { tableName } = req.params;

    const newTable = await NewTable.findOne({
      where: { name: tableName },
      include: [{ model: NewTableProperties }],
    });

    if (!newTable) {
      return res.status(404).json({ error: `Table ${tableName} not found` });
    }

    res.json(newTable);
  } catch (error) {
    console.error(`Error fetching table ${req.params.tableName}:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// New route for creating a new table
app.post("/newtable", async (req, res) => {
  try {
    const { name, type, properties } = req.body;

    const newTable = await NewTable.create({ name, type });

    // Add properties to the new table
    for (const property of properties) {
      await NewTableProperties.create({
        name: property.name,
        type: property.type,
        newtable_id: newTable.id,
      });
    }

    res
      .status(201)
      .json({ message: "Table added successfully", table: newTable });
  } catch (error) {
    console.error("Error adding table:", error);
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

app.get("/domainobject/:id/linkedtables", async (req, res) => {
  try {
    const { id } = req.params;

    const domainObject = await DomainObject.findByPk(id, {
      include: [
        {
          model: NewTable,
          through: Dotrelation,
        },
      ],
    });

    if (!domainObject) {
      return res.status(404).json({ error: "DomainObject not found" });
    }

    res.json(domainObject.NewTables);
  } catch (error) {
    console.error("Error fetching linked tables for the domain object:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// New route for fetching all new tables
app.get("/newtables", async (req, res) => {
  try {
    const newTables = await NewTable.findAll();
    res.json(newTables);
  } catch (error) {
    console.error("Error fetching new tables:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// New route for creating a new table
app.post("/newtables", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Table name is required" });
    }

    const newTable = await NewTable.create({ name });
    console.log("Table added successfully:", newTable);

    res
      .status(201)
      .json({ message: "Table added successfully", table: newTable });
  } catch (error) {
    console.error("Error adding table:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// New route for fetching use cases with descriptions
app.get("/usecases", async (req, res) => {
  try {
    const usecases = await Usecase.findAll({
      attributes: ["id", "name", "description"], // Select only the relevant attributes
    });
    res.json(usecases);
  } catch (error) {
    console.error("Error fetching use cases:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// New route for fetching use case details by name
app.get("/usecase/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const usecase = await Usecase.findByPk(id, {
      include: [
        {
          model: DomainObject,
          through: UsecaseRelation,
        },
      ],
    });

    if (!usecase) {
      return res.status(404).json({
        error: "Use case not found",
      });
    }

    res.json(usecase);
  } catch (error) {
    console.error("Error fetching use case by ID:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});
// Add this route to your Express server code
app.get("/usecases", async (req, res) => {
  try {
    // Fetch all existing use cases from the database
    const usecases = await Usecase.findAll();

    // Extract relevant information from the use cases
    const usecaseOptions = usecases.map((usecase) => ({
      id: usecase.id, // You can use the ID as the option value
      name: usecase.name, // Display the use case name as the option text
    }));

    res.json(usecaseOptions);
  } catch (error) {
    console.error("Error fetching use cases:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// New route for updating use case details
app.put("/usecase/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const usecase = await Usecase.findByPk(id);

    if (!usecase) {
      return res.status(404).json({
        error: "Use case not found",
      });
    }

    usecase.name = name;
    usecase.description = description;
    await usecase.save();

    res.json({
      message: "Use case updated successfully",
    });
  } catch (error) {
    console.error("Error updating use case:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Usecase routes
app.get("/usecases", async (req, res) => {
  try {
    const usecases = await Usecase.findAll();
    res.json(usecases);
  } catch (error) {
    console.error("Error fetching usecases:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/usecases", async (req, res) => {
  try {
    const {
      name,
      description,
      objective,
      actors,
      preConditions,
      postConditions,
      steps,
      testCases,
      assignedDomainObjectIds,
    } = req.body;

    // Create a new use case
    const usecase = await Usecase.create({
      name,
      description,
      objective,
      actors,
      preConditions,
      postConditions,
      steps,
    });

    // Create and associate steps with the use case
    for (const step of steps) {
      await UseCaseStep.create({
        name: step.name,
        description: step.description,
        usecase_id: usecase.id,
      });
    }

    // Create and associate test cases with the use case
    for (const testCase of testCases) {
      await TestCase.create({
        name: testCase.name,
        description: testCase.description,
        usecase_id: usecase.id,
      });
    }

    // Find the assigned domain objects
    const assignedDomainObjects = await DomainObject.findAll({
      where: { id: assignedDomainObjectIds },
    });

    // Add the assigned domain objects to the use case
    await usecase.addDomainObjects(assignedDomainObjects);

    res.status(201).json({
      message:
        "Usecase created and associated with domain objects and test cases successfully",
    });
  } catch (error) {
    console.error("Error creating use case:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get test cases for a specific use case by ID
app.get("/usecases/:id/testcases", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the use case by ID and include its associated test cases
    const usecase = await Usecase.findByPk(id, {
      include: [{ model: TestCase }],
    });

    if (!usecase) {
      return res.status(404).json({ error: "Usecase not found" });
    }

    res.json(usecase.TestCases);
  } catch (error) {
    console.error("Error fetching test cases for the use case:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Route to create a test case for a specific use case
app.post("/usecases/:id/testcases", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const usecase = await Usecase.findByPk(id);

    if (!usecase) {
      return res.status(404).json({ error: "Usecase not found" });
    }

    const testCase = await TestCase.create({
      name,
      description,
      usecase_id: usecase.id,
    });

    res.status(201).json({ message: "Test case added successfully", testCase });
  } catch (error) {
    console.error("Error adding test case:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get steps for a specific use case by ID
app.get("/usecases/:id/steps", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the use case by ID and include its associated steps
    const usecase = await Usecase.findByPk(id, {
      include: [{ model: UseCaseStep }],
    });

    if (!usecase) {
      return res.status(404).json({ error: "Usecase not found" });
    }

    res.json(usecase.UseCaseSteps);
  } catch (error) {
    console.error("Error fetching steps for the use case:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/usecase/relation", async (req, res) => {
  try {
    const { usecase_id, domainobject_id } = req.body;

    // Create a new UsecaseRelation entry
    const usecaseRelation = await UsecaseRelation.create({
      usecase_id,
      domainobject_id,
    });

    res.status(201).json(usecaseRelation);
  } catch (error) {
    console.error("Error creating UsecaseRelation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/usecase-relation", async (req, res) => {
  try {
    const { usecase_id, domainobject_id } = req.body;

    // Create a new UsecaseRelation entry
    const usecaseRelation = await UsecaseRelation.create({
      usecase_id,
      domainobject_id,
    });

    res.status(201).json(usecaseRelation);
  } catch (error) {
    console.error("Error creating UsecaseRelation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a new route for creating modules
app.post("/modules", async (req, res) => {
  try {
    const { name, description, useCaseIds } = req.body;

    // Create a new module
    const module = await Module.create({ name, description });

    // Associate the selected use cases with the module
    if (useCaseIds && useCaseIds.length > 0) {
      const useCases = await Usecase.findAll({ where: { id: useCaseIds } });
      await module.addUseCases(useCases);
    }

    res.status(201).json({ message: "Module added successfully", module });
  } catch (error) {
    console.error("Error adding Module:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add this route to your Express server code
app.get("/modules", async (req, res) => {
  try {
    const modules = await Module.findAll();
    res.json(modules);
  } catch (error) {
    console.error("Error fetching modules:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a new route to create module-usecase relations
app.post("/module-usecase-relations", async (req, res) => {
  try {
    const { moduleId, usecaseIds } = req.body;

    // Create relations between the module and use cases
    const relations = [];
    for (const usecaseId of usecaseIds) {
      const relation = await ModuleUsecaseRelation.create({
        moduleId,
        usecaseId,
      });
      relations.push(relation);
    }

    res
      .status(201)
      .json({ message: "Module and use case relations created", relations });
  } catch (error) {
    console.error("Error creating module-usecase relations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.put("/modules/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Find the module by ID
    const module = await Module.findByPk(id);

    if (!module) {
      return res.status(404).json({ error: "Module not found" });
    }

    // Update module details
    module.name = name;
    module.description = description;

    await module.save();

    res.json({ message: "Module details updated successfully", module });
  } catch (error) {
    console.error("Error updating Module:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Create a new route to fetch module details by ID
app.get("/modules/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const module = await Module.findByPk(id, {
      include: [
        {
          model: Usecase,
          through: ModuleUsecaseRelation,
        },
      ],
    });

    if (!module) {
      return res.status(404).json({ error: "Module not found" });
    }

    res.json(module);
  } catch (error) {
    console.error("Error fetching module details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Add a new route to assign use cases to a module
app.post("/modules/:id/assign-usecases", async (req, res) => {
  try {
    const { id } = req.params;
    const { usecaseIds } = req.body;

    // Find the module by ID
    const module = await Module.findByPk(id);

    if (!module) {
      return res.status(404).json({ error: "Module not found" });
    }

    // Find the use cases to assign
    const useCases = await Usecase.findAll({ where: { id: usecaseIds } });

    // Associate the selected use cases with the module
    await module.addUsecases(useCases);

    res
      .status(200)
      .json({ message: "Use cases assigned to the module", module });
  } catch (error) {
    console.error("Error assigning use cases to the module:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new product and associate it with modules
app.post("/products", async (req, res) => {
  try {
    const { name, description, moduleIds } = req.body;

    // Create a new product
    const product = await Product.create({ name, description });

    // Associate the selected modules with the product
    if (moduleIds && moduleIds.length > 0) {
      const modules = await Module.findAll({ where: { id: moduleIds } });
      await product.addModules(modules);
    }

    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    console.error("Error adding Product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new route to get product details by ID
app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        {
          model: Module,
          through: ModuleProductRelation,
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/product-module-relations", async (req, res) => {
  try {
    // Extract data from the request body
    const { productId, moduleIds } = req.body;

    // Validate the data here if necessary

    // Create relations and store them in the database
    const createdRelations = await ProductModuleRelation.bulkCreate(
      moduleIds.map((moduleId) => ({
        productId,
        moduleId,
      }))
    );

    // Respond with the created relations
    res.status(201).json(createdRelations);
  } catch (error) {
    console.error("Error creating product-module relations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new route to assign existing modules to a product
app.post("/products/:productId/assign-modules", async (req, res) => {
  try {
    const { productId } = req.params;
    const { moduleIds } = req.body;

    // Find the product by ID
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Find the selected modules by their IDs
    const modules = await Module.findAll({ where: { id: moduleIds } });

    // Associate the selected modules with the product
    await product.addModules(modules);

    res
      .status(201)
      .json({ message: "Modules assigned to the product successfully" });
  } catch (error) {
    console.error("Error assigning modules to the product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new route to update the product's assigned modules
app.put("/products/:productId/update-modules", async (req, res) => {
  try {
    const { productId } = req.params;
    const { moduleIds } = req.body;

    // Find the product by ID
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Find the selected modules by their IDs
    const modules = await Module.findAll({ where: { id: moduleIds } });

    // Set the product's assigned modules to the selected modules
    await product.setModules(modules);

    res.status(200).json({ message: "Product's modules updated successfully" });
  } catch (error) {
    console.error("Error updating product's modules:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add this route to your Express server code
app.get("/products", async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Create a new route to update product details by ID
app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Find the product by ID
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update the product details
    product.name = name;
    product.description = description;

    // Save the updated product
    await product.save();

    res
      .status(200)
      .json({ message: "Product details updated successfully", product });
  } catch (error) {
    console.error("Error updating product details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/features", async (req, res) => {
  try {
    const { name, description } = req.body;

    // Create a new feature
    const feature = await Feature.create({ name, description });

    res.status(201).json({ message: "Feature added successfully", feature });
  } catch (error) {
    console.error("Error adding Feature:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a route to create relations between features and use cases
app.post("/feature-use-case-relations", async (req, res) => {
  try {
    const { featureId, usecaseIds } = req.body;

    if (!Array.isArray(usecaseIds)) {
      return res.status(400).json({ error: "Invalid usecaseIds format" });
    }

    // Create relations between the feature and use cases
    const relations = [];
    for (const usecaseId of usecaseIds) {
      const relation = await UsecaseRelation.create({
        usecase_id: usecaseId,
        domainobject_id: featureId, // Assuming domainobject_id represents the feature
      });
      relations.push(relation);
    }

    res
      .status(201)
      .json({ message: "Feature and use case relations created", relations });
  } catch (error) {
    console.error("Error creating feature-usecase relations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a route to get all features
app.get("/features", async (req, res) => {
  try {
    const features = await Feature.findAll();
    res.json(features);
  } catch (error) {
    console.error("Error fetching features:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a route to get a single feature by ID
app.get("/features/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const feature = await Feature.findByPk(id);
    if (!feature) {
      return res.status(404).json({ error: "Feature not found" });
    }
    res.json(feature);
  } catch (error) {
    console.error("Error fetching feature by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Add a new route to assign a use case to a feature by specifying the featureId
app.post("/features/:featureId/assign-usecase", async (req, res) => {
  try {
    const { featureId } = req.params;
    const { usecaseId } = req.body;

    // Find the feature by ID
    const feature = await Feature.findByPk(featureId);

    if (!feature) {
      return res.status(404).json({ error: "Feature not found" });
    }

    // Find the selected use case by its ID
    const usecase = await Usecase.findByPk(usecaseId);

    if (!usecase) {
      return res.status(404).json({ error: "Use case not found" });
    }

    // Create a new entry in FeatureUsecaseRelation
    const relation = await FeatureUsecaseRelation.create({
      featureId: feature.id,
      usecaseId: usecase.id,
    });

    res.status(201).json({
      message: "Use case assigned to the feature successfully",
      relation,
    });
  } catch (error) {
    console.error("Error assigning use case to the feature:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Add a new route to get all use cases assigned to a feature
app.get("/features/:featureId/usecases", async (req, res) => {
  try {
    const { featureId } = req.params;

    // Find the feature by ID
    const feature = await Feature.findByPk(featureId, {
      include: [Usecase],
    });

    if (!feature) {
      return res.status(404).json({ error: "Feature not found" });
    }

    res.json(feature.Usecases);
  } catch (error) {
    console.error("Error fetching assigned use cases for the feature:", error);
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
  Usecase,
  Module,
  Product,
  Feature,
  Features,
};
