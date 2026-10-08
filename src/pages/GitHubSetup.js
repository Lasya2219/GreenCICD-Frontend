import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setupGitHub } from "../api";

function GitHubSetup() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [statusState, setStatusState] = useState({
    loading: true,
    error: null,
    message: "Verifying GitHub App installation..."
  });

  useEffect(() => {
    const installationId = searchParams.get("installation_id");
    const state = searchParams.get("state") || sessionStorage.getItem("github_setup_state");
    const setupAction = searchParams.get("setup_action");

    if (setupAction === "request") {
      setStatusState({
        loading: false,
        error: "GitHub App installation request is pending approval.",
        message: "Your organization requires administrator approval for this GitHub App."
      });
      return;
    }

    if (!installationId || !state) {
      setStatusState({
        loading: false,
        error: "Invalid GitHub installation parameter.",
        message: "Missing installation_id or state parameter in callback."
      });
      return;
    }

    setupGitHub({ installation_id: installationId, state, setup_action: setupAction })
      .then((res) => {
        sessionStorage.removeItem("github_setup_state");
        setStatusState({
          loading: false,
          error: null,
          message: res.data?.message || "GitHub account connected successfully!"
        });
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      })
      .catch((error) => {
        console.error("GitHub setup error:", error);
        const detail = error.response?.data?.detail || "Failed to connect GitHub account.";
        setStatusState({
          loading: false,
          error: detail,
          message: detail
        });
      });
  }, [searchParams, navigate]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080f0c",
      color: "#d6ede5",
      fontFamily: "'Outfit', sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px"
    }}>
      <div style={{
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "16px",
        padding: "36px 40px",
        maxWidth: "460px",
        width: "100%",
        textAlign: "center",
        boxShadow: "0 8px 40px rgba(0, 214, 143, 0.08)"
      }}>
        <div style={{ fontSize: "36px", marginBottom: "16px" }}>
          {statusState.loading ? "🔄" : statusState.error ? "⚠️" : "🌿"}
        </div>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "12px", color: statusState.error ? "#ff4d6d" : "#00d68f" }}>
          {statusState.loading ? "Connecting GitHub..." : statusState.error ? "Connection Failed" : "GitHub Connected!"}
        </h2>
        <p style={{ fontSize: "0.88rem", color: "#4a7060", marginBottom: "24px", lineHeight: "1.5" }}>
          {statusState.message}
        </p>
        {!statusState.loading && (
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              padding: "10px 20px",
              background: "linear-gradient(135deg, #00d68f, #00a86b)",
              color: "#002818",
              border: "none",
              borderRadius: "8px",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Return to Dashboard
          </button>
        )}
      </div>
    </div>
  );
}

export default GitHubSetup;