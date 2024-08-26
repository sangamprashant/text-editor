import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./css/main.css";

const Loading = () => (
  <div className="loading-container-">
    <div className="loading-spinner" />
    <span>Loading your application, please wait...</span>
  </div>
);

const App = lazy(() => import("./App"));
const AppProvider = lazy(() => import("./context").then(module => ({ default: module.AppProvider })));

ReactDOM.createRoot(document.getElementById("root")).render(
  <Suspense fallback={<Loading />}>
    <AppProvider>
      <App />
    </AppProvider>
  </Suspense>
);
