// Define the base URL for the API
const API_BASE_URL = "http://localhost:8080/api";

/**
 * Create a new user.
 * @param {Object} userData - The data of the user to create.
 * @returns {Object} The created user data.
 * @throws Will throw an error if the request fails.
 */
export async function createUser(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "An unexpected error occurred");
    }

    const data = await response.json();

    console.log("Registration response data:", data); // Debug log

    // Check if the response contains the expected user data
    if (data.user) {
      sessionStorage.setItem("user", JSON.stringify(data.user)); // Save user details
    } else {
      console.error("Unexpected response format:", data);
    }

    return data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

/**
 * Log in a user.
 * @param {Object} credentials - The login credentials.
 * @returns {Object} The logged-in user data.
 * @throws Will throw an error if the request fails.
 */
export async function loginUser(credentials) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    console.log("Login response data:", data); // Debug log

    // Check if the response contains the expected user data
    if (data.user) {
      sessionStorage.setItem("user", JSON.stringify(data.user)); // Save user details in sessionStorage
    } else {
      console.error("Unexpected response format:", data);
    }

    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

/**
 * Get a user by ID.
 * @param {string} userId - The ID of the user to fetch.
 * @returns {Object} The user data.
 * @throws Will throw an error if the request fails.
 */
export async function getUserById(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

/**
 * Fetch all users.
 * @returns {Array} The list of all users.
 * @throws Will throw an error if the request fails.
 */
export async function fetchAllUsers() {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
}

/**
 * Update a user by ID.
 * @param {string} userId - The ID of the user to update.
 * @param {Object} userUpdates - The updates to apply to the user.
 * @returns {Object} The updated user data.
 * @throws Will throw an error if the request fails.
 */
export async function updateUser(userId, userUpdates) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userUpdates),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

/**
 * Delete a user by ID.
 * @param {string} userId - The ID of the user to delete.
 * @returns {Object} The response data.
 * @throws Will throw an error if the request fails.
 */
export async function deleteUser(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

/**
 * Create a new thread.
 * @param {Object} threadData - The data of the thread to create.
 * @returns {Object} The created thread data.
 * @throws Will throw an error if the request fails.
 */
export async function createThread(threadData) {
  try {
    const response = await fetch(`${API_BASE_URL}/threads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(threadData),
    });

    if (!response.ok) {
      // Capture and return detailed error message
      const errorData = await response.json();
      throw new Error(errorData.error || response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating thread:", error);
    throw error;
  }
}

/**
 * Get a thread by ID.
 * @param {string} threadId - The ID of the thread to fetch.
 * @returns {Object} The thread data.
 * @throws Will throw an error if the request fails.
 */
export async function getThreadById(threadId) {
  try {
    const response = await fetch(`${API_BASE_URL}/threads/${threadId}`);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching thread:", error);
    throw error;
  }
}

/**
 * Fetch all threads.
 * @returns {Array} The list of all threads.
 * @throws Will throw an error if the request fails.
 */
export async function fetchAllThreads() {
  try {
    const response = await fetch(`${API_BASE_URL}/threads`);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching all threads:", error);
    throw error;
  }
}

/**
 * Update a thread by ID.
 * @param {string} threadId - The ID of the thread to update.
 * @param {Object} threadUpdates - The updates to apply to the thread.
 * @returns {Object} The updated thread data.
 * @throws Will throw an error if the request fails.
 */
export async function updateThread(threadId, threadUpdates) {
  try {
    const response = await fetch(`${API_BASE_URL}/threads/${threadId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(threadUpdates),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating thread:", error);
    throw error;
  }
}

/**
 * Delete a thread by ID.
 * @param {string} threadId - The ID of the thread to delete.
 * @returns {Object} The response data.
 * @throws Will throw an error if the request fails.
 */
export async function deleteThread(threadId) {
  try {
    const response = await fetch(`${API_BASE_URL}/threads/${threadId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting thread:", error);
    throw error;
  }
}

/**
 * Create a new reply.
 * @param {Object} replyData - The data of the reply to create.
 * @returns {Object} The created reply data.
 * @throws Will throw an error if the request fails.
 */
export async function createReply(replyData) {
  try {
    const response = await fetch(`${API_BASE_URL}/replies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(replyData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating reply:", error);
    throw error;
  }
}

/**
 * Get a reply by ID.
 * @param {string} replyId - The ID of the reply to fetch.
 * @returns {Object} The reply data.
 * @throws Will throw an error if the request fails.
 */
export async function getReplyById(replyId) {
  try {
    const response = await fetch(`${API_BASE_URL}/replies/${replyId}`);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching reply:", error);
    throw error;
  }
}

/**
 * Fetch all replies for a specific thread.
 * @param {string} threadId - The ID of the thread to fetch replies for.
 * @returns {Array} The list of replies for the thread.
 * @throws Will throw an error if the request fails.
 */
export async function fetchRepliesForThread(threadId) {
  try {
    const response = await fetch(`${API_BASE_URL}/replies/thread/${threadId}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching replies for thread:", error);
    throw error;
  }
}

/**
 * Fetch all replies.
 * @returns {Array} The list of all replies.
 * @throws Will throw an error if the request fails.
 */
export async function fetchAllReplies() {
  try {
    const response = await fetch(`${API_BASE_URL}/replies`);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching all replies:", error);
    throw error;
  }
}

/**
 * Update a reply by ID.
 * @param {string} replyId - The ID of the reply to update.
 * @param {Object} replyUpdates - The updates to apply to the reply.
 * @returns {Object} The updated reply data.
 * @throws Will throw an error if the request fails.
 */
export async function updateReply(replyId, replyUpdates) {
  try {
    const response = await fetch(`${API_BASE_URL}/replies/${replyId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(replyUpdates),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating reply:", error);
    throw error;
  }
}

/**
 * Update the status of a reply.
 * @param {string} replyId - The ID of the reply to update.
 * @param {string} status - The new status of the reply.
 * @returns {Object} The updated reply data.
 * @throws Will throw an error if the request fails.
 */
export async function updateReplyStatus(replyId, status) {
  try {
    const response = await fetch(`${API_BASE_URL}/replies/${replyId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }), // Only sending the status field
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating reply status:", error);
    throw error;
  }
}

/**
 * Delete a reply by ID.
 * @param {string} replyId - The ID of the reply to delete.
 * @returns {Object} The response data.
 * @throws Will throw an error if the request fails.
 */
export async function deleteReply(replyId) {
  try {
    const response = await fetch(`${API_BASE_URL}/replies/${replyId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting reply:", error);
    throw error;
  }
}
