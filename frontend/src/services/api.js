import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

export const triggerScan = async (targetUrl) => {
  const response = await axios.post(`${API_BASE_URL}/scan`, {
    target_url: targetUrl,
  });
  return response.data;
};

export const fetchRemediation = async (vulnerabilityDetails, sourceCode) => {
  const response = await axios.post(`${API_BASE_URL}/remediate`, {
    vulnerability_details: vulnerabilityDetails,
    source_code: sourceCode,
  });
  return response.data;
};
