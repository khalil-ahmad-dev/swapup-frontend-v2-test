import axios from "axios";
import { Environment } from "@/config";

const API = axios.create({
  baseURL: Environment.API_BASE_URL,
  headers: { Accept: "application/json", "Content-Type": "application/json" },
});

// Adding token to headers for later use

// API.interceptors.request.use(config => {
//   try {
//     const accessToken = getData("access-token");
//     if (accessToken) {
//       config.headers["Authorization"] = `Bearer ${accessToken}`;
//     }
//     return config;
//   } catch (error) {
//     console.error("Error in Request Interceptor:", error);
//     return config;
//   }
// });

API.interceptors.response.use(
  (response) => {
    // Successful response
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle specific status codes
      const { status } = error.response;

      if (status === 404) {
        console.warn("Resource not found:", error.response.config.url);
      } else {
        console.error(`API Error (Status: ${status}):`, error.response.data);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Axios Error:", error.message);
    }

    // Always reject the error so that calling code can handle it
    return Promise.reject(error);
  }
);

export default API;
