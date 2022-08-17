import React from "react";
import classes from "./App.module.css";
import { DuplicateBeneficiariesPage } from "./pages/DuplicateBeneficairiesPage";

const MyApp = () => (
  <div className={classes.container}>
    <DuplicateBeneficiariesPage />
  </div>
);

export default MyApp;
