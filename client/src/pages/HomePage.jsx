import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EHBLogo from "../assets/images/EHBLOGO.png";
import {
  fetchAllThreads,
  getUserById,
  createThread,
  fetchAllUsers,
  deleteUser,
  fetchRepliesForThread,
  createReply,
  updateReplyStatus,
} from "../services/api";

const HomePage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [threads, setThreads] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [error, setError] = useState("");
  const [isReplyAnonymous, setIsReplyAnonymous] = useState(false);
  const [openThreadId, setOpenThreadId] = useState(null); // Track open thread
  const [showAdminAlert, setShowAdminAlert] = useState(false);
  const [user, setUser] = useState(null); // State to store the user data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUser(user);

          // Fetch threads and users data if the user is an admin
          const threadsData = await fetchAllThreads();
          threadsData.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );

          const threadsWithUsernamesAndReplies = await Promise.all(
            threadsData.map(async (thread) => {
              let username = "Anonymous";
              if (thread.status !== "anonymous") {
                const user = await getUserById(thread.user_id);
                username = user.username;
              }
              const replies = await fetchRepliesForThread(thread.thread_id);
              return {
                ...thread,
                username,
                replies,
              };
            })
          );

          setThreads(threadsWithUsernamesAndReplies);

          if (user.role === "admin") {
            const usersData = await fetchAllUsers();
            setUsers(usersData);
          }
        } else {
          navigate("/login"); // Redirect to login if no user is found
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
      }
    };

    fetchData();
  }, [navigate]);

  const isAdmin = user?.role === "admin";

  // For creating a new thread
  const handlePost = async () => {
    try {
      const newThread = {
        title,
        content: description,
        user_id: user ? user.user_id : null,
        status: isAnonymous ? "anonymous" : "public",
      };

      await createThread(newThread);
      // Fetch updated threads after posting
      const updatedThreadsData = await fetchAllThreads();
      updatedThreadsData.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      const updatedThreadsWithUsernames = await Promise.all(
        updatedThreadsData.map(async (thread) => {
          let username = "Anonymous";
          if (thread.status !== "anonymous") {
            const user = await getUserById(thread.user_id);
            username = user.username;
          }
          const replies = await fetchRepliesForThread(thread.thread_id);
          return {
            ...thread,
            username,
            replies,
          };
        })
      );

      setThreads(updatedThreadsWithUsernames);
      setIsModalOpen(false);
      setTitle("");
      setDescription("");
      setIsAnonymous(false);
      setError("");
    } catch (err) {
      console.error("Error posting thread:", err);
      setError(`Error posting thread: ${err.message}`);
    }
  };

  // For creating a new reply
  const handleReplyPost = async () => {
    try {
      const newReply = {
        content: replyContent,
        thread_id: selectedThread.thread_id,
        user_id: user.user_id,
        status: isReplyAnonymous ? "anonymous" : "active",
      };

      await createReply(newReply);
      const updatedReplies = await fetchRepliesForThread(
        selectedThread.thread_id
      );

      setThreads(
        threads.map((thread) =>
          thread.thread_id === selectedThread.thread_id
            ? { ...thread, replies: updatedReplies }
            : thread
        )
      );

      setIsReplyModalOpen(false);
      setReplyContent("");
      setSelectedThread(null);
    } catch (err) {
      console.error("Error posting reply:", err);
      setError(`Error posting reply: ${err.message}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const userToDelete = users.find((u) => u.user_id === userId);
      if (userToDelete?.role === "admin") {
        setShowAdminAlert(true);
      } else {
        await deleteUser(userId);
        setUsers(users.filter((user) => user.user_id !== userId));
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleReplyToThread = (thread) => {
    setSelectedThread(thread);
    setIsReplyModalOpen(true);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const handleMarkAsCorrect = async (replyId, currentStatus) => {
    try {
      const newStatus = currentStatus === "correct" ? "active" : "correct";
      await updateReplyStatus(replyId, newStatus);

      const updatedThreads = await Promise.all(
        threads.map(async (thread) => {
          if (thread.replies.some((reply) => reply.reply_id === replyId)) {
            const updatedReplies = await fetchRepliesForThread(
              thread.thread_id
            );
            return { ...thread, replies: updatedReplies };
          }
          return thread;
        })
      );
      setThreads(updatedThreads);
    } catch (err) {
      console.error("Error toggling reply status:", err);
      setError(`Error toggling reply status: ${err.message}`);
    }
  };

  // Handle click to toggle replies
  const handleThreadClick = (threadId) => {
    setOpenThreadId(openThreadId === threadId ? null : threadId);
  };

  return (
    <div className="w-99vw h-screen pb-10 bg-primary font-jetbrains">
      <nav className="bg-secondary p-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src={EHBLogo} alt="EHB Logo" className="h-10" />
          <span className="ml-4 text-primary font-bold text-xl">
            Student Forum
          </span>
        </div>
        <button
          className="bg-primary hover:bg-blue-800 text-secondary font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>

      <div className="flex justify-center space-x-8">
        <div className="p-6 w-full max-w-xl bg-secondary mt-4 space-y-4">
          <div
            className="mb-10 mt-4 p-4 bg-primary text-secondary shadow cursor-pointer flex items-center"
            onClick={() => setIsModalOpen(true)}
          >
            <i className="fas fa-plus mr-5 text-3xl"></i>
            <div>
              <p className="font-bold text-xl">Create a Post</p>
              <p className="text-sm mt-1">
                Click here to share your question or discussion topic
              </p>
            </div>
          </div>
          <h2 className="text-xl font-bold mb-4">Forum Feed</h2>
          <div className="space-y-4">
            {threads.length > 0 ? (
              threads.map((thread) => (
                <div
                  key={thread.thread_id}
                  className="p-4 bg-primary text-secondary shadow cursor-pointer"
                  onClick={() => handleThreadClick(thread.thread_id)}
                >
                  <p className="font-bold italic">{thread.username}</p>
                  <p className="font-bold text-lg mt-2 break-words overflow-hidden">
                    {thread.title}
                  </p>
                  <p className="mt-2 break-words overflow-hidden">
                    {thread.content}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    Posted on {new Date(thread.created_at).toLocaleString()}
                  </p>
                  {isAdmin && (
                    <div className="mt-4">
                      <button
                        className="bg-secondary hover:bg-blue-800 text-primary hover:text-secondary font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent click from triggering thread click
                          handleReplyToThread(thread);
                        }}
                      >
                        Reply
                      </button>
                    </div>
                  )}
                  {openThreadId === thread.thread_id && (
                    <div className="mt-4 border-t border-gray-300 pt-2">
                      {thread.replies.length > 0 ? (
                        thread.replies.map((reply) => (
                          <div
                            key={reply.reply_id}
                            className={`p-4 text-primary shadow mb-2 ${
                              reply.status === "correct"
                                ? "bg-green-100"
                                : "bg-secondary"
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <p className="font-bold italic">
                                {reply.username || "Anonymous"}
                              </p>
                              {isAdmin && (
                                <button
                                  className={`${
                                    reply.status === "correct"
                                      ? "bg-green-500 text-white"
                                      : "bg-secondary text-primary"
                                  } font-bold py-2 px-4 focus:outline-none focus:shadow-outline flex items-center`}
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent click from triggering thread click
                                    handleMarkAsCorrect(
                                      reply.reply_id,
                                      reply.status
                                    );
                                  }}
                                >
                                  <i
                                    className={`fas fa-check-circle mr-2 ${
                                      reply.status === "correct"
                                        ? "text-white"
                                        : "text-primary"
                                    }`}
                                  ></i>
                                  {reply.status === "correct"
                                    ? "Correct"
                                    : "Not Correct"}
                                </button>
                              )}
                            </div>
                            <p className="mt-2 break-words overflow-hidden">
                              {reply.content}
                            </p>
                            <p className="mt-2 text-xs text-gray-400">
                              Replied on{" "}
                              {new Date(reply.created_at).toLocaleString()}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">
                          This thread doesn't have any replies yet.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No threads found.</p>
            )}
          </div>
        </div>

        {isAdmin && (
          <div className="p-6 w-full max-w-xs bg-secondary mt-4 space-y-4">
            <h2 className="text-xl font-bold mb-4">User Management</h2>
            <div className="space-y-2">
              {users.map((user) => (
                <div
                  key={user.user_id}
                  className="p-4 bg-primary text-secondary shadow"
                >
                  <p className="font-bold italic">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.role}</p>
                  <p className="mt-2 break-words overflow-hidden">
                    {user.email}
                  </p>
                  <button
                    className="bg-red-500 text-white font-bold py-2 px-4 mt-4 focus:outline-none focus:shadow-outline"
                    onClick={() => handleDeleteUser(user.user_id)}
                  >
                    Delete User
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
          <div className="bg-secondary p-6 w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold">Create a New Thread</h2>
            {error && <p className="text-red-500">{error}</p>}
            <input
              type="text"
              className="w-full p-2 border border-primary rounded"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="w-full p-2 border border-primary rounded"
              rows="4"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="anonymous"
                className="mr-2"
                checked={isAnonymous}
                onChange={() => setIsAnonymous(!isAnonymous)}
              />
              <label htmlFor="anonymous">Post Anonymously</label>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-red-500 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-primary text-secondary font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
                onClick={handlePost}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {isReplyModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-5">
          <div className="bg-secondary p-6 shadow-lg w-full max-w-md rounded-lg">
            <h2 className="text-xl font-bold mb-4">Reply to Post</h2>
            <div className="mb-4">
              <label
                className="block text-primary text-sm font-bold mb-2"
                htmlFor="reply-content"
              >
                Reply
              </label>
              <textarea
                className="shadow appearance-none border w-full py-2 px-3 text-primary leading-tight focus:outline-none focus:shadow-outline rounded"
                id="reply-content"
                maxLength="2000"
                style={{ resize: "none", height: "200px" }}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
            </div>
            {isAdmin && (
              <div className="mb-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-primary border-primary focus:ring-0"
                    checked={isReplyAnonymous}
                    onChange={() => setIsReplyAnonymous(!isReplyAnonymous)}
                    style={{
                      appearance: "none",
                      backgroundColor: isReplyAnonymous ? "black" : "white",
                      borderColor: "black",
                    }}
                  />
                  <span className="ml-2 text-primary">Post Anonymously</span>
                </label>
              </div>
            )}
            {error && <div className="text-red-500 mt-4">{error}</div>}
            <div className="flex justify-end space-x-4">
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline rounded"
                onClick={() => setIsReplyModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-primary hover:bg-blue-800 text-secondary font-bold py-2 px-4 focus:outline-none focus:shadow-outline rounded"
                onClick={handleReplyPost}
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Alert Modal */}
      {showAdminAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
          <div className="bg-secondary p-6 w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold">Cannot Delete Admin</h2>
            <p className="text-red-500">You cannot delete an admin user.</p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-primary text-secondary font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
                onClick={() => setShowAdminAlert(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
