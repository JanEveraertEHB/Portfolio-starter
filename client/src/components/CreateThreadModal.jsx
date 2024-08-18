import React from "react";

const CreateThreadModal = ({
  isOpen,
  title,
  description,
  isAnonymous,
  setTitle,
  setDescription,
  setIsAnonymous,
  handlePost,
  closeModal,
  error,
}) => {
  if (!isOpen) return null;

  return (
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
            onClick={closeModal}
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
  );
};

export default CreateThreadModal;
