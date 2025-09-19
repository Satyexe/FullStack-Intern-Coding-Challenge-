import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";

const AddStoreModal = ({ isOpen, onClose, onStoreAdded, editingStore = null, isEditMode = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    owner_id: "",
  });
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch store owners (users with STORE_OWNER role)
  useEffect(() => {
    if (isOpen) {
      fetchStoreOwners();
    }
  }, [isOpen]);

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && editingStore) {
      setFormData({
        name: editingStore.name || "",
        email: editingStore.email || "",
        address: editingStore.address || "",
        owner_id: editingStore.owner_id || "",
      });
    } else {
      // Reset form for adding new store
      setFormData({
        name: "",
        email: "",
        address: "",
        owner_id: "",
      });
    }
  }, [isEditMode, editingStore, isOpen]);

  const fetchStoreOwners = async () => {
    try {
      const response = await api.get("/admin/users", {
        params: { role: "STORE_OWNER", limit: 100 }
      });
      setOwners(response.data.users || []);
    } catch (error) {
      console.error("Failed to fetch store owners:", error);
      toast.error("Failed to load store owners");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditMode && editingStore) {
        await api.put(`/admin/stores/${editingStore.id}`, formData);
        toast.success("Store updated successfully");
      } else {
        await api.post("/admin/stores", formData);
        toast.success("Store added successfully");
      }
      
      onStoreAdded(); // refresh list
      onClose(); // close modal
    } catch (error) {
      const message = error.response?.data?.message || 
        (isEditMode ? "Failed to update store" : "Failed to add store");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {isEditMode ? "Edit Store" : "Add New Store"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Store Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Store Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              minLength={20}
              maxLength={60}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter store name (20-60 characters)"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.name.length}/60 characters
            </p>
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
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="store@example.com"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              maxLength={400}
              rows={3}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter store address"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.address.length}/400 characters
            </p>
          </div>

          {/* Store Owner */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Store Owner
            </label>
            <select
              name="owner_id"
              value={formData.owner_id}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select a store owner</option>
              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name} ({owner.email})
                </option>
              ))}
            </select>
            {owners.length === 0 && (
              <p className="text-xs text-yellow-600 mt-1">
                No store owners found. Please add a user with STORE_OWNER role first.
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center space-x-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>{isEditMode ? "Update Store" : "Add Store"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStoreModal;
