export default function ProjectList({ projects, onSelect, selectedProject }) {

  if (!projects || projects.length === 0) {
    return (
      <div>
        <h2>Projects</h2>
        <p style={{ color: "#888" }}>No projects found.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Select Project</h2>
      {projects.map(project => (
        <button
          key={project.id}
          id={`project-btn-${project.id}`}
          onClick={() => onSelect(project)}
          style={{
            margin: "5px",
            padding: "10px 16px",
            cursor: "pointer",
            background: selectedProject?.id === project.id ? "#2d6a4f" : "#eee",
            color: selectedProject?.id === project.id ? "#fff" : "#333",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontWeight: selectedProject?.id === project.id ? "bold" : "normal"
          }}
        >
          {project.project_name}
        </button>
      ))}
    </div>
  );
}