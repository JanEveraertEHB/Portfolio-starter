import React from "react";

const ReplyModal = ({
  isOpen,
  replyContent,
  setReplyContent,
  handleReplyPost,
  closeModal,
  isAdmin,
  isReplyAnonymous,
  setIsReplyAnonymous,
  error,
}) => {
  if (!isOpen) return null;

  return (
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
            onClick={closeModal}
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
  );
};

export default ReplyModal;
