import React from "react";
import "font-awesome/css/font-awesome.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./Layout";
import HomePage from "./HomePage";
import AddDomainObject from "./AddDomainObject";
import ViewDomainObjects from "./ViewDomainObjects";
import ViewTables from "./ViewTables";
import CheckDetails from "./CheckDetails";
import AddNewTable from "./AddNewTable";
import AddPropertyOfNewTable from "./AddPropertyOfNewTable";
import NewTableDetails from "./NewTableDetails";
import ViewDotrelations from "./ViewDotrelations";
import AddUsecase from "./AddUsecase";
import ViewUsecases from "./ViewUsecases";
import CheckDetailsUseCase from "./CheckDetailsUseCase";
import AddModule from "./AddModule";
import ViewModules from "./ViewModules";
import ModuleDetails from "./ModuleDetails";
import AddProduct from "./AddProduct";
import ViewProducts from "./ViewProducts";
import ProductDetails from "./ProductDetails";
import AddFeature from "./AddFeature";
import ViewFeatures from "./ViewFeatures";
import FeatureDetails from "./FeatureDetails";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/view-domain-objects" element={<ViewDomainObjects />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/add-domain-object" element={<AddDomainObject />} />
          <Route path="/check-details/:name" element={<CheckDetails />} />
          <Route path="/new-table-details" element={<ViewTables />} />
          <Route path="/add-new-table" element={<AddNewTable />} />
          <Route
            path="/add-property-of-newtable/:newTableId"
            element={<AddPropertyOfNewTable />}
          />
          <Route path="/view-dotrelations" element={<ViewDotrelations />} />
          <Route
            path="/new-table-details/:tableName"
            element={<NewTableDetails />}
          />
          <Route
            path="/view-domain-objects/:newTableId/details"
            element={<NewTableDetails />}
          />
          <Route path="/add-usecase" element={<AddUsecase />} />
          <Route path="/view-usecases" element={<ViewUsecases />} />
          <Route path="/use-case-details/:id" element={<CheckDetailsUseCase />} />
          <Route path="/add-module" element={<AddModule />} />
          <Route path="/view-modules" element={<ViewModules />} />
          <Route path="/module-details/:moduleId" element={<ModuleDetails />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/view-products" element={<ViewProducts />} />
          <Route path="/product-details/:productId" element={<ProductDetails />} />
          <Route path="/add-feature" element={<AddFeature />} />
          <Route path="/view-features" element={<ViewFeatures />} />
          <Route path="/feature-details/:featureId" element={<FeatureDetails />} />
        </Routes>
      </Layout>
    </Router>
  );
}
export default App;