import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Outlet, Navigate } from "react-router-dom";
import { getProjects, getGitHubStatus } from "../../api";
import ProjectHeader from "./ProjectHeader";
import ProjectSidebar from "./ProjectSidebar";

export default function ProjectLayout() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [githubConnected, setGithubConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getProjects();
      const projList = res.data || [];
      setProjects(projList);

      if (projList.length > 0) {
        const found = projList.find((p) => String(p.id) === String(projectId));
        if (found) {
          setCurrentProject(found);
        } else if (projectId) {
          // If URL projectId doesn't match any project, fallback to first project
          navigate(`/projects/${projList[0].id}/overview`, { replace: true });
        }
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  }, [projectId, navigate]);

  useEffect(() => {
    fetchProjects();
    (async () => {
      try {
        const statusRes = await getGitHubStatus();
        setGithubConnected(statusRes.data.connected);
      } catch (err) {
        console.error("Failed to check GitHub status:", err);
      }
    })();
  }, [fetchProjects]);

  const handleSelectProject = (project) => {
    if (project?.id) {
      setCurrentProject(project);
      // Retain active sub-tab if possible or switch to overview
      navigate(`/projects/${project.id}/overview`);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#080f0c",
        color: "#00d68f",
        fontFamily: "'DM Mono', monospace",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px"
      }}>
        <div style={{
          width: "16px", height: "16px",
          border: "2px solid rgba(0,214,143,0.2)",
          borderTopColor: "#00d68f",
          borderRadius: "50%",
          animation: "spin 0.6s linear infinite"
        }} />
        Loading workspace...
      </div>
    );
  }

  if (projects.length === 0 && !loading) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080f0c",
      color: "#d6ede5",
      fontFamily: "'Outfit', sans-serif",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Background ambient orbs */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", width: "600px", height: "500px", top: "-160px", left: "-120px",
          background: "radial-gradient(circle, rgba(0,214,143,0.18) 0%, transparent 70%)",
          filter: "blur(80px)", opacity: 0.5
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <ProjectHeader
          currentProject={currentProject}
          projects={projects}
          onSelectProject={handleSelectProject}
          githubConnected={githubConnected}
        />

        <div style={{
          display: "flex",
          maxWidth: "1280px",
          width: "100%",
          margin: "0 auto",
          padding: "0 24px 40px",
          flex: 1,
          alignItems: "stretch"
        }}>
          <ProjectSidebar currentProject={currentProject} />

          <main style={{
            flex: 1,
            padding: "20px 0 20px 24px",
            borderLeft: "1px solid var(--border, rgba(255, 255, 255, 0.07))",
            minHeight: "60vh"
          }}>
            <Outlet context={{ currentProject, projects, refreshProjects: fetchProjects, githubConnected }} />
          </main>
        </div>
      </div>
    </div>
  );
}
