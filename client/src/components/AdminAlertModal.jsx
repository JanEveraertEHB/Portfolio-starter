import React from "react";

const AdminAlertModal = ({ isOpen, closeModal }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
      <div className="bg-secondary p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold">Cannot Delete Admin</h2>
        <p className="text-red-500">You cannot delete an admin user.</p>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-primary text-secondary font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
            onClick={closeModal}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAlertModal;
