import React from "react";
import classes from "./App.module.css";
import CustomTableContainer from "./components/CustomTableContainer";
import DataSelectionContainer from "./components/DataSelectionContainer";

const MyApp = () => (
  <div className={classes.container}>
    <DataSelectionContainer />
    <CustomTableContainer />
  </div>
);

export default MyApp;
