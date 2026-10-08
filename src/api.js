import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

// Attach JWT token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ---------- AUTH ---------- */

export const loginUser = (data) => API.post("/users/login", data);

export const registerUser = (data) => API.post("/users/register", data);


/* ---------- GITHUB APP ---------- */

export const connectGitHub = () => API.get("/github/connect");

export const setupGitHub = (params) => API.get("/github/setup", { params });

export const getGitHubStatus = () => API.get("/github/status");


/* ---------- PROJECTS ---------- */

export const getProjects = () => API.get("/projects");

export const createProject = (data) => API.post("/projects", data);


/* ---------- PIPELINE RUNS ---------- */

export const addPipelineRun = (data) => API.post("/pipeline-run", data);

export const getPipelineRuns = (projectId) =>
  API.get(`/pipeline-run/${projectId}`);


/* ---------- CARBON DATA ---------- */

export const getCarbonTrend = (projectId) =>
  API.get(`/carbon-trend/${projectId}`);


export const getProjectSummary = (projectId) =>
  API.get(`/project-summary/${projectId}`);

/* ---------- OPTIMIZATION ---------- */

export const optimizeRegion = (projectId) =>
  API.post(`/optimize/${projectId}`);

export const getOptimizationRecommendation = (projectId) =>
  API.post(`/optimize/${projectId}`);


export default API;