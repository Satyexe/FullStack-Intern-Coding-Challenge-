import React, { useState, useEffect } from 'react';
import {
  Search,
  Star,
  ChevronUp,
  ChevronDown,
  Store,
  MapPin
} from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const UserStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ratingModal, setRatingModal] = useState({ show: false, store: null });

  useEffect(() => {
    fetchStores();
  }, [searchTerm, sortBy, sortOrder, currentPage]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        sortBy,
        sortOrder,
        search: searchTerm,
      };

      const response = await api.get('/user/stores', { params });
      setStores(response.data.stores);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      toast.error('Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setSortOrder('ASC');
    }
  };

  const handleRating = async (storeId, rating) => {
    try {
      await api.post(`/user/stores/${storeId}/rating`, { rating });
      toast.success('Rating submitted successfully');
      setRatingModal({ show: false, store: null });
      fetchStores();
    } catch (error) {
      toast.error('Failed to submit rating');
    }
  };

  const SortButton = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-left font-medium text-gray-700 hover:text-gray-900"
    >
      <span>{children}</span>
      {sortBy === field && (
        sortOrder === 'ASC' ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )
      )}
    </button>
  );

  const StarRating = ({ rating, onRating, interactive = false, size = 'h-5 w-5' }) => {
    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: 5 }, (_, i) => (
          <button
            key={i}
            onClick={() => interactive && onRating(i + 1)}
            disabled={!interactive}
            className={`${size} ${i < rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
              } ${interactive ? 'hover:text-yellow-400 cursor-pointer' : ''}`}
          >
            <Star className="h-full w-full" />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Store Directory</h1>
        <p className="text-gray-600">Discover and rate stores in your area</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search stores by name or address..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Stores Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div key={store.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 h-12 w-12">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Store className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{store.name}</h3>
                      <p className="text-sm text-gray-600">by {store.owner?.name}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{store.address}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <StarRating rating={store.avg_rating ? Math.round(Number(store.avg_rating)) : 0} />
                      <span className="text-sm text-gray-600">
                        {store.avg_rating && !isNaN(store.avg_rating)
                          ? Number(store.avg_rating).toFixed(1)
                          : "N/A"} ({store.ratings_count || 0} reviews)
                      </span>

                    </div>
                  </div>

                  {store.userRating && (
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-600">Your rating:</span>
                      <StarRating rating={store.userRating} />
                    </div>
                  )}

                  <button
                    onClick={() => setRatingModal({ show: true, store })}
                    className="w-full mt-4 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    {store.userRating ? 'Update Rating' : 'Rate Store'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{currentPage}</span> of{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === currentPage
                        ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {ratingModal.show && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Rate {ratingModal.store?.name}
              </h3>
              <div className="flex justify-center mb-6">
                <StarRating
                  rating={0}
                  onRating={(rating) => handleRating(ratingModal.store.id, rating)}
                  interactive={true}
                  size="h-8 w-8"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setRatingModal({ show: false, store: null })}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserStores;

