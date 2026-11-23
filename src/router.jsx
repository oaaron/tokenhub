import { Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import SiteLayout from "./components/site/SiteLayout";
import HomePage from "./pages/site/HomePage";
import NotFoundPage from "./pages/site/NotFoundPage";
import {
  ModelsPage,
  ModelDetailPage,
  ComparePage,
  PricingPage,
  DocsPage,
  ServiceStatusPage,
  DesignSystemPreview,
} from "./pages/site/RoutePages";
function load(Component) {
  return (
    <Suspense
      fallback={
        <div className="site-loading" role="status">
          正在加载页面…
        </div>
      }
    >
      <Component />
    </Suspense>
  );
}
export const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/models", element: load(ModelsPage) },
      { path: "/models/compare", element: load(ComparePage) },
      { path: "/models/:modelId", element: load(ModelDetailPage) },
      { path: "/pricing", element: load(PricingPage) },
      { path: "/docs", element: <Navigate to="/docs/intro" replace /> },
      { path: "/docs/*", element: load(DocsPage) },
      { path: "/service-status", element: load(ServiceStatusPage) },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  { path: "/design-system", element: load(DesignSystemPreview) },
]);
