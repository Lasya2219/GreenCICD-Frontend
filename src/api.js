import axios from "axios";

const API = axios.create({
  baseURL: "https://green-cicd-backend-1.onrender.com"
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


/* ---------- OPTIMIZATION ---------- */

export const optimizeRegion = (projectId) =>
  API.post(`/optimize/${projectId}`);


export default API;