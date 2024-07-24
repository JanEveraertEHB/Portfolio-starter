const API_URL = "http://localhost:8080";

export const getData = async () => {
  try {
    const response = await fetch(`${API_URL}/`);
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
