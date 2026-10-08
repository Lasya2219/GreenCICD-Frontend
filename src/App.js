import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import GitHubSetup from "./pages/GitHubSetup";
import ProtectedRoute from "./components/ProtectedRoute";

import ProjectSelection from "./pages/ProjectSelection";
import ProjectLayout from "./components/layout/ProjectLayout";

import ProjectOverview from "./pages/project/ProjectOverview";
import ProjectPipelines from "./pages/project/ProjectPipelines";
import ProjectCarbon from "./pages/project/ProjectCarbon";
import ProjectOptimization from "./pages/project/ProjectOptimization";
import ProjectSettings from "./pages/project/ProjectSettings";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Auth & Callback Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/github/setup" element={<GitHubSetup />} />

        {/* Protected Project Selection Hub */}
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectSelection />
            </ProtectedRoute>
          }
        />

        {/* Protected Project Workspace (Sub-routes per Project ID) */}
        <Route
          path="/projects/:projectId"
          element={
            <ProtectedRoute>
              <ProjectLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<ProjectOverview />} />
          <Route path="pipelines" element={<ProjectPipelines />} />
          <Route path="carbon" element={<ProjectCarbon />} />
          <Route path="optimization" element={<ProjectOptimization />} />
          <Route path="settings" element={<ProjectSettings />} />
        </Route>

        {/* Fallbacks */}
        <Route path="/dashboard" element={<Navigate to="/projects" replace />} />
        <Route path="*" element={<Navigate to="/projects" replace />} />
      </Routes>
    </Router>
  );
}

export default App;