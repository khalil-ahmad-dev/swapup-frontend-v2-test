import { Route, Routes } from "react-router-dom";
import { clientSideRoutes, SUI_RoutesType } from "./routes";

const renderRoutes = (routes: SUI_RoutesType[]) => {
  return routes.map((route) => {
    if (route.layout && route.child_routes?.length) {
      return (
        <Route key={route.id} path={route.path} element={route.layout}>
          {renderRoutes(route.child_routes)}
        </Route>
      );
    } else {
      return <Route key={route.id} path={route.path} element={route.element} />;
    }
  });
};

function App() {
  return (
    <Routes>
      {renderRoutes(clientSideRoutes)}
    </Routes>
  );
}

export default App;
