import React, { useState } from "react";
import { X } from "lucide-react";
import api from "../../utils/api";
import toast from "react-hot-toast";

const AddUserModal = ({ isOpen, onClose, onUserAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    role: "USER",
    storeName: "",
    storeAddress: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/admin/users", formData);
      toast.success("User added successfully");
      onUserAdded(res.data.user); // refresh parent list
      onClose();
    } catch (error) {
      toast.error("Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New User</h2>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="USER">User</option>
            <option value="STORE_OWNER">Store Owner</option>
            <option value="ADMIN">Admin</option>
          </select>
          {formData.role === "STORE_OWNER" && (
            <>
              <input
                type="text"
                name="storeName"
                placeholder="Store Name"
                value={formData.storeName}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                name="storeAddress"
                placeholder="Store Address"
                value={formData.storeAddress}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700"
          >
            {loading ? "Saving..." : "Add User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
