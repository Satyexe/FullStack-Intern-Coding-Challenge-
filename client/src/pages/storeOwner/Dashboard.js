import React, { useEffect, useState } from "react";
import axios from "axios";
import StarRating from "../../components/StarRating"; // ✅ Correct path

const StoreOwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/store-owner/dashboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-lg">Loading dashboard...</p>;
  }

  if (!dashboardData) {
    return (
      <p className="text-center mt-10 text-red-500">
        Failed to load dashboard data.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Store Owner Dashboard
      </h1>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h2 className="text-lg font-medium text-gray-600">Total Stores</h2>
          <p className="text-3xl font-bold text-indigo-600">
            {dashboardData.statistics.totalStores}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h2 className="text-lg font-medium text-gray-600">Total Ratings</h2>
          <p className="text-3xl font-bold text-green-600">
            {dashboardData.statistics.totalRatings}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h2 className="text-lg font-medium text-gray-600">
            Overall Avg Rating
          </h2>
          <p className="text-3xl font-bold text-yellow-500">
            {Number(dashboardData.statistics.overallAvgRating || 0).toFixed(1)}
          </p>
        </div>
      </div>

      {/* Stores List */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Your Stores
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dashboardData.stores.map((store) => (
            <div key={store.id} className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900">{store.name}</h3>
              <p className="text-sm text-gray-600">{store.location}</p>
              <div className="mt-3 flex items-center gap-2">
                <StarRating rating={Math.round(Number(store.avg_rating || 0))} />
                <span className="text-sm font-medium text-gray-900">
                  {Number(store.avg_rating || 0).toFixed(1)}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Ratings: {store.rating_count}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-800">
          Performance Insights
        </h2>
        <p className="text-sm text-blue-700 mt-2">
          Your stores have an average rating of{" "}
          {Number(dashboardData.statistics.overallAvgRating || 0).toFixed(1)}{" "}
          stars with {dashboardData.statistics.totalRatings} total reviews.
        </p>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
