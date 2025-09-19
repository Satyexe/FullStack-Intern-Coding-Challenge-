import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";

const AddUserModal = ({ isOpen, onClose, onUserAdded, editingUser = null, isEditMode = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "USER",
  });

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && editingUser) {
      setFormData({
        name: editingUser.name || "",
        email: editingUser.email || "",
        password: "", // Don't pre-fill password for security
        address: editingUser.address || "",
        role: editingUser.role || "USER",
      });
    } else {
      // Reset form for adding new user
      setFormData({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "USER",
      });
    }
  }, [isEditMode, editingUser, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditMode && editingUser) {
        // Prepare data for update (exclude password if empty)
        const updateData = {
          name: formData.name,
          email: formData.email,
          address: formData.address,
          role: formData.role,
        };
        
        // Only include password if it's provided
        if (formData.password.trim()) {
          updateData.password = formData.password;
        }

        await api.put(`/admin/users/${editingUser.id}`, updateData);
        toast.success("User updated successfully");
      } else {
        await api.post("/admin/users", formData);
        toast.success("User added successfully");
      }
      
      onUserAdded(); // refresh list
      onClose(); // close modal
    } catch (error) {
      const message = error.response?.data?.message || 
        (isEditMode ? "Failed to update user" : "Failed to add user");
      toast.error(message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {isEditMode ? "Edit User" : "Add New User"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          {/* Password ✅ added */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password {isEditMode && <span className="text-gray-500">(leave blank to keep current)</span>}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!isEditMode}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder={isEditMode ? "Enter new password (optional)" : ""}
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="USER">User</option>
              <option value="STORE_OWNER">Store Owner</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              {isEditMode ? "Update User" : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
