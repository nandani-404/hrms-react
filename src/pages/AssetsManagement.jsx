import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Search, Filter, ChevronDown, Edit, Trash2, X, 
  UserPlus, Eye, History, Tag, Download, CheckCircle, 
  XCircle, Clock, AlertTriangle 
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../context/AuthContext'
import { useEmployees } from '../hooks/useEmployees'
import {
  useAssets,
  useAssetCategories,
  useAssetSubCategories,
  useCreateAsset,
  useUpdateAsset,
  useAssignAsset,
  useReturnAsset
} from '../hooks/useAssets'

const STATUSES = ["AVAILABLE", "ASSIGNED", "RETIRED"];
const CONDITIONS = ["GOOD", "DAMAGED", "LOST"];

const getStatusBadgeStyle = (status) => {
  switch (status) {
    case "AVAILABLE": return "bg-green-100 text-green-800";
    case "ASSIGNED": return "bg-blue-100 text-blue-800";
    case "RETIRED": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getConditionBadgeStyle = (condition) => {
  switch (condition) {
    case "GOOD": return "bg-green-100 text-green-800";
    case "DAMAGED": return "bg-yellow-100 text-yellow-800";
    case "LOST": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const AssetsManagement = () => {
  const { user } = useAuth();
  const isAdminOrHR = user?.role === 'super_admin' || user?.role === 'hr';

  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  // Modals visibility
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showAssignmentDetailsModal, setShowAssignmentDetailsModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Loading states for async details
  const [isLoadingAssignmentDetails, setIsLoadingAssignmentDetails] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Modal data contexts
  const [selectedAssetForEdit, setSelectedAssetForEdit] = useState(null);
  const [selectedAssetForAssign, setSelectedAssetForAssign] = useState(null);
  const [selectedAssetForReturn, setSelectedAssetForReturn] = useState(null);
  const [assignmentDetails, setAssignmentDetails] = useState(null);
  const [assetHistory, setAssetHistory] = useState(null);
  const [selectedCategoryIdForSub, setSelectedCategoryIdForSub] = useState("");

  const [filters, setFilters] = useState({
    status: "",
    category: "",
    condition: ""
  });

  const [assetFormData, setAssetFormData] = useState({
    asset_tag: "",
    asset_name: "",
    category_id: "",
    sub_category_id: "",
    brand: "",
    model: "",
    serial_number: "",
    purchase_date: "",
    purchase_cost: "",
    vendor_name: "",
    warranty_start_date: "",
    warranty_end_date: "",
    location: ""
  });

  const [assignmentFormData, setAssignmentFormData] = useState({
    asset_id: "",
    employee_id: "",
    assigned_date: "",
    expected_return: "",
    remarks: ""
  });

  const [returnFormData, setReturnFormData] = useState({
    assignment_id: "",
    returned_date: "",
    condition_out: "GOOD"
  });

  // Queries and mutations
  const { data: assetsResponse, isLoading: isAssetsLoading } = useAssets();
  const { data: categoriesResponse } = useAssetCategories();
  const { data: employeesResponse } = useEmployees();
  const { data: subCategoriesResponse } = useAssetSubCategories(selectedCategoryIdForSub);

  const createMutation = useCreateAsset();
  const updateMutation = useUpdateAsset();
  const assignMutation = useAssignAsset();
  const returnMutation = useReturnAsset();

  const assets = Array.isArray(assetsResponse?.data) ? assetsResponse.data : assetsResponse || [];
  const categories = Array.isArray(categoriesResponse?.data) ? categoriesResponse.data : categoriesResponse || [];
  const employees = Array.isArray(employeesResponse?.data) ? employeesResponse.data : employeesResponse || [];
  const subCategories = Array.isArray(subCategoriesResponse?.data) ? subCategoriesResponse.data : subCategoriesResponse || [];

  const handleAssetFormChange = (e) => {
    const { name, value } = e.target;
    setAssetFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAssetSubmit = async (e) => {
    e.preventDefault();
    if (!assetFormData.asset_tag || !assetFormData.asset_name || !assetFormData.category_id) {
      toast.error("Please fill in all required fields");
      return;
    }

    const toastId = toast.loading(selectedAssetForEdit ? "Updating asset..." : "Creating asset...");
    try {
      const payload = {
        asset_tag: assetFormData.asset_tag,
        asset_name: assetFormData.asset_name,
        category_id: parseInt(assetFormData.category_id, 10),
        sub_category_id: assetFormData.sub_category_id ? parseInt(assetFormData.sub_category_id, 10) : null,
        brand: assetFormData.brand,
        model: assetFormData.model,
        serial_number: assetFormData.serial_number,
        purchase_date: assetFormData.purchase_date,
        purchase_cost: assetFormData.purchase_cost ? parseFloat(assetFormData.purchase_cost) : null,
        vendor_name: assetFormData.vendor_name,
        warranty_start_date: assetFormData.warranty_start_date,
        warranty_end_date: assetFormData.warranty_end_date,
        location: assetFormData.location
      };

      if (selectedAssetForEdit) {
        await updateMutation.mutateAsync({
          assetId: selectedAssetForEdit.asset_id,
          data: payload
        });
        toast.success("Asset updated successfully! ✅", { id: toastId });
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Asset created successfully! ✅", { id: toastId });
      }
      resetAssetForm();
    } catch (err) {
      console.error("Failed to save asset:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to save asset";
      toast.error(errMsg, { id: toastId });
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!assignmentFormData.asset_id || !assignmentFormData.employee_id || !assignmentFormData.assigned_date) {
      toast.error("Please fill in all required fields");
      return;
    }

    const toastId = toast.loading("Assigning asset...");
    try {
      const payload = {
        asset_id: parseInt(assignmentFormData.asset_id, 10),
        employee_id: assignmentFormData.employee_id,
        assigned_date: assignmentFormData.assigned_date,
        expected_return: assignmentFormData.expected_return || "",
        remarks: assignmentFormData.remarks || ""
      };

      await assignMutation.mutateAsync(payload);
      toast.success("Asset assigned successfully! ✅", { id: toastId });
      resetAssignForm();
    } catch (err) {
      console.error("Failed to assign asset:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to assign asset";
      toast.error(errMsg, { id: toastId });
    }
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    if (!returnFormData.assignment_id || !returnFormData.returned_date || !returnFormData.condition_out) {
      toast.error("Please fill in all required fields");
      return;
    }

    const toastId = toast.loading("Returning asset...");
    try {
      await returnMutation.mutateAsync({
        assignment_id: parseInt(returnFormData.assignment_id, 10),
        returned_date: returnFormData.returned_date,
        condition_out: returnFormData.condition_out
      });
      toast.success("Asset returned successfully! ✅", { id: toastId });
      resetReturnForm();
    } catch (err) {
      console.error("Failed to return asset:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to return asset";
      toast.error(errMsg, { id: toastId });
    }
  };

  const handleOpenEditModal = (asset) => {
    setSelectedAssetForEdit(asset);
    setSelectedCategoryIdForSub(asset.category_id || "");
    setAssetFormData({
      asset_tag: asset.asset_tag || "",
      asset_name: asset.asset_name || "",
      category_id: asset.category_id || "",
      sub_category_id: asset.sub_category_id || "",
      brand: asset.brand || "",
      model: asset.model || "",
      serial_number: asset.serial_number || "",
      purchase_date: asset.purchase_date || "",
      purchase_cost: asset.purchase_cost || "",
      vendor_name: asset.vendor_name || "",
      warranty_start_date: asset.warranty_start_date || "",
      warranty_end_date: asset.warranty_end_date || "",
      location: asset.location || ""
    });
    setShowAddEditModal(true);
  };

  const handleOpenAssignModal = (asset) => {
    if (asset.asset_status !== "AVAILABLE") {
      toast.error("Only available assets can be assigned");
      return;
    }
    setSelectedAssetForAssign(asset);
    setAssignmentFormData({
      asset_id: asset.asset_id,
      employee_id: "",
      assigned_date: new Date().toISOString().split('T')[0],
      expected_return: "",
      remarks: ""
    });
    setShowAssignModal(true);
  };

  const handleOpenReturnModal = (asset) => {
    if (asset.asset_status !== "ASSIGNED") {
      toast.error("Only assigned assets can be returned");
      return;
    }
    if (!asset.assigned_to) {
      toast.error("Assignment details not found");
      return;
    }

    setIsLoadingAssignmentDetails(true);
    // Fetch details first
    const token = localStorage.getItem("token");
    const assignmentId = asset.assigned_to.assignment_id;
    
    api.get(`/assets/assignments/${assignmentId}`)
      .then(res => {
        if (res.data?.status && res.data?.data) {
          setAssignmentDetails(res.data.data);
          setShowAssignmentDetailsModal(true);
        } else {
          toast.error("Failed to fetch assignment details");
        }
      })
      .catch(err => {
        console.error("Error fetching assignment details:", err);
        toast.error("Failed to fetch assignment details");
      })
      .finally(() => {
        setIsLoadingAssignmentDetails(false);
      });
  };

  const handlePrepareReturnFromDetails = () => {
    if (assignmentDetails) {
      setSelectedAssetForReturn({
        asset_name: assignmentDetails.asset_name || assignmentDetails.asset?.asset_name || "Unknown Asset",
        asset_tag: assignmentDetails.asset_tag || assignmentDetails.asset?.asset_tag || "N/A",
        assignment_id: assignmentDetails.assignment_id
      });
      setReturnFormData({
        assignment_id: assignmentDetails.assignment_id,
        returned_date: new Date().toISOString().split('T')[0],
        condition_out: "GOOD"
      });
      setShowAssignmentDetailsModal(false);
      setShowReturnModal(true);
    }
  };

  const handleOpenHistoryModal = async (asset) => {
    setIsLoadingHistory(true);
    try {
      const res = await api.get(`/assets/${asset.asset_id}/history`);
      if (res.data?.status) {
        setAssetHistory(res.data);
        setShowHistoryModal(true);
      } else {
        toast.error("Failed to fetch asset history");
      }
    } catch (err) {
      console.error("Failed to fetch asset history:", err);
      toast.error("Failed to fetch asset history");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const resetAssetForm = () => {
    setShowAddEditModal(false);
    setSelectedAssetForEdit(null);
    setAssetFormData({
      asset_tag: "",
      asset_name: "",
      category_id: "",
      sub_category_id: "",
      brand: "",
      model: "",
      serial_number: "",
      purchase_date: "",
      purchase_cost: "",
      vendor_name: "",
      warranty_start_date: "",
      warranty_end_date: "",
      location: ""
    });
  };

  const resetAssignForm = () => {
    setShowAssignModal(false);
    setSelectedAssetForAssign(null);
    setAssignmentFormData({
      asset_id: "",
      employee_id: "",
      assigned_date: "",
      expected_return: "",
      remarks: ""
    });
  };

  const resetReturnForm = () => {
    setShowReturnModal(false);
    setSelectedAssetForReturn(null);
    setReturnFormData({
      assignment_id: "",
      returned_date: "",
      condition_out: "GOOD"
    });
  };

  const handleResetFilters = () => {
    setFilters({
      status: "",
      category: "",
      condition: ""
    });
  };

  const handleExportExcel = async () => {
    const toastId = toast.loading("Exporting assets to Excel...");
    try {
      const res = await api.get('/assets/export/excel', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `assets_${new Date().toISOString().split("T")[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Assets exported successfully! ✅", { id: toastId });
    } catch (err) {
      console.error("Failed to export assets:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to export assets";
      toast.error(errMsg, { id: toastId });
    }
  };

  const isAnyFilterActive = Object.values(filters).some(v => v !== "");

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = 
      (asset.asset_tag?.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (asset.asset_name?.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (asset.serial_number?.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesStatus = !filters.status || asset.asset_status === filters.status;
    const matchesCategory = 
      !filters.category || 
      asset.category?.name === filters.category || 
      asset.category === filters.category;
      
    const matchesCondition = !filters.condition || asset.condition_status === filters.condition;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesCondition;
  });

  if (isAssetsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assets Management</h1>
          <p className="text-gray-600 mt-1">{assets.length} total assets</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Export to Excel
          </button>
          {isAdminOrHR && (
            <button
              onClick={() => setShowAddEditModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Asset
            </button>
          )}
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by tag, name, or serial number..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showFilters || isAnyFilterActive 
                  ? "bg-primary-50 border-primary-300 text-primary-700" 
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
              {isAnyFilterActive && (
                <span className="ml-1 px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full">
                  {Object.values(filters).filter(v => v !== "").length}
                </span>
              )}
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-gray-100 overflow-hidden"
              >
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={e => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                  >
                    <option value="">All Statuses</option>
                    {STATUSES.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={filters.category}
                    onChange={e => setFilters({ ...filters, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.id || cat.category_id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Condition</label>
                  <select
                    value={filters.condition}
                    onChange={e => setFilters({ ...filters, condition: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                  >
                    <option value="">All Conditions</option>
                    {CONDITIONS.map(cond => (
                      <option key={cond} value={cond}>{cond}</option>
                    ))}
                  </select>
                </div>
                {isAnyFilterActive && (
                  <div className="col-span-full flex justify-end">
                    <button
                      onClick={handleResetFilters}
                      className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset Tag</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category / Sub</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serial Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Condition</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset, index) => (
                  <motion.tr
                    key={asset.asset_id || asset.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{asset.asset_tag}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{asset.asset_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex flex-col">
                        <span className="font-medium">{asset.category?.name || asset.category || "-"}</span>
                        <span className="text-xs text-gray-500">
                          {asset.subCategory?.name || asset.sub_category?.name || "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{asset.brand || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{asset.serial_number || "-"}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getStatusBadgeStyle(asset.asset_status)}`}>
                        {asset.asset_status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getConditionBadgeStyle(asset.condition_status)}`}>
                        {asset.condition_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(asset)}
                          className="p-1 text-primary-600 hover:bg-primary-50 rounded transition-colors"
                          title="Edit Asset"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {asset.asset_status === "AVAILABLE" && (
                          <button
                            onClick={() => handleOpenAssignModal(asset)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Assign Asset"
                          >
                            <UserPlus className="w-4 h-4" />
                          </button>
                        )}
                        {asset.asset_status === "ASSIGNED" && (
                          <button
                            onClick={() => handleOpenReturnModal(asset)}
                            disabled={isLoadingAssignmentDetails}
                            className="p-1 text-orange-600 hover:bg-orange-50 rounded transition-colors disabled:opacity-50"
                            title="View Assignment Details & Return"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenHistoryModal(asset)}
                          disabled={isLoadingHistory}
                          className="p-1 text-purple-600 hover:bg-purple-50 rounded transition-colors disabled:opacity-50"
                          title="View Asset History"
                        >
                          <History className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                    No assets found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Asset Modal */}
      <AnimatePresence>
        {showAddEditModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={resetAssetForm}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden"
            >
              <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-10">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedAssetForEdit ? "Edit Asset" : "Add New Asset"}
                </h2>
                <button onClick={resetAssetForm} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleAssetSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Asset Tag <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="asset_tag"
                      value={assetFormData.asset_tag}
                      onChange={handleAssetFormChange}
                      placeholder="e.g., ASSET-001"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Asset Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="asset_name"
                      value={assetFormData.asset_name}
                      onChange={handleAssetFormChange}
                      placeholder="e.g., Dell Latitude"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category_id"
                      value={assetFormData.category_id}
                      onChange={e => {
                        setAssetFormData({
                          ...assetFormData,
                          category_id: e.target.value,
                          sub_category_id: ""
                        });
                        setSelectedCategoryIdForSub(e.target.value);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.category_id || cat.id} value={cat.category_id || cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Category</label>
                    <select
                      name="sub_category_id"
                      value={assetFormData.sub_category_id}
                      onChange={handleAssetFormChange}
                      disabled={!assetFormData.category_id}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white disabled:bg-gray-50"
                    >
                      <option value="">Select Sub-Category</option>
                      {subCategories.map(sub => (
                        <option key={sub.sub_category_id || sub.id} value={sub.sub_category_id || sub.id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <input
                      type="text"
                      name="brand"
                      value={assetFormData.brand}
                      onChange={handleAssetFormChange}
                      placeholder="e.g., Dell"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                    <input
                      type="text"
                      name="model"
                      value={assetFormData.model}
                      onChange={handleAssetFormChange}
                      placeholder="e.g., E7470"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                    <input
                      type="text"
                      name="serial_number"
                      value={assetFormData.serial_number}
                      onChange={handleAssetFormChange}
                      placeholder="e.g., SN-XYZ123"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                    <input
                      type="date"
                      name="purchase_date"
                      value={assetFormData.purchase_date}
                      onChange={handleAssetFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Cost</label>
                    <input
                      type="number"
                      name="purchase_cost"
                      step="0.01"
                      value={assetFormData.purchase_cost}
                      onChange={handleAssetFormChange}
                      placeholder="e.g., 85000.00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name</label>
                    <input
                      type="text"
                      name="vendor_name"
                      value={assetFormData.vendor_name}
                      onChange={handleAssetFormChange}
                      placeholder="e.g., Dell India"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Warranty Start Date</label>
                    <input
                      type="date"
                      name="warranty_start_date"
                      value={assetFormData.warranty_start_date}
                      onChange={handleAssetFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Warranty End Date</label>
                    <input
                      type="date"
                      name="warranty_end_date"
                      value={assetFormData.warranty_end_date}
                      onChange={handleAssetFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={assetFormData.location}
                      onChange={handleAssetFormChange}
                      placeholder="e.g., Bangalore Office - Floor 2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100 sticky bottom-0 bg-white">
                  <button
                    type="button"
                    onClick={resetAssetForm}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50"
                  >
                    {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Asset"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Assign Asset Modal */}
      <AnimatePresence>
        {showAssignModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={resetAssignForm}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Assign Asset</h2>
                <button onClick={resetAssignForm} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleAssignSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asset</label>
                  <input
                    type="text"
                    disabled
                    value={selectedAssetForAssign?.asset_name || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={assignmentFormData.employee_id}
                    onChange={e => setAssignmentFormData({ ...assignmentFormData, employee_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map(emp => (
                      <option key={emp.id || emp.emp_id} value={emp.id || emp.emp_id}>
                        {emp.full_name} ({emp.emp_id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={assignmentFormData.assigned_date}
                    onChange={e => setAssignmentFormData({ ...assignmentFormData, assigned_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Return Date</label>
                  <input
                    type="date"
                    value={assignmentFormData.expected_return}
                    onChange={e => setAssignmentFormData({ ...assignmentFormData, expected_return: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                  <textarea
                    value={assignmentFormData.remarks}
                    onChange={e => setAssignmentFormData({ ...assignmentFormData, remarks: e.target.value })}
                    placeholder="Add assignment details..."
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={resetAssignForm}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={assignMutation.isPending}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                  >
                    Assign Asset
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Return Asset Modal */}
      <AnimatePresence>
        {showReturnModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={resetReturnForm}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Return Asset</h2>
                <button onClick={resetReturnForm} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleReturnSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asset</label>
                  <input
                    type="text"
                    disabled
                    value={selectedAssetForReturn ? `${selectedAssetForReturn.asset_name} (${selectedAssetForReturn.asset_tag})` : ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Returned Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={returnFormData.returned_date}
                    onChange={e => setReturnFormData({ ...returnFormData, returned_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Condition <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={returnFormData.condition_out}
                    onChange={e => setReturnFormData({ ...returnFormData, condition_out: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                    required
                  >
                    {CONDITIONS.map(cond => (
                      <option key={cond} value={cond}>{cond}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={resetReturnForm}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={returnMutation.isPending}
                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50"
                  >
                    Return Asset
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Assignment Details Modal */}
      <AnimatePresence>
        {showAssignmentDetailsModal && assignmentDetails && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={() => setShowAssignmentDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Assignment Details</h2>
                <button onClick={() => setShowAssignmentDetailsModal(false)} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Assignment ID</label>
                    <p className="text-sm font-medium text-gray-900 mt-1">{assignmentDetails.assignment_id}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</label>
                    <p className="mt-1">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadgeStyle(assignmentDetails.status)}`}>
                        {assignmentDetails.status}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Asset</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {assignmentDetails.asset_name || assignmentDetails.asset?.asset_name || "N/A"} 
                    {" "}({assignmentDetails.asset_tag || assignmentDetails.asset?.asset_tag || "N/A"})
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned To Employee</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">{assignmentDetails.employee_name || "N/A"}</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned By</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">{assignmentDetails.assigned_by_name || "N/A"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned Date</label>
                    <p className="text-sm font-medium text-gray-900 mt-1">{assignmentDetails.assigned_date}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Expected Return</label>
                    <p className="text-sm font-medium text-gray-900 mt-1">{assignmentDetails.expected_return || "-"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Condition In</label>
                    <p className="mt-1">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getConditionBadgeStyle(assignmentDetails.condition_in)}`}>
                        {assignmentDetails.condition_in}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Condition Out</label>
                    <p className="mt-1">
                      {assignmentDetails.condition_out ? (
                        <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getConditionBadgeStyle(assignmentDetails.condition_out)}`}>
                          {assignmentDetails.condition_out}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </p>
                  </div>
                </div>

                {assignmentDetails.remarks && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Remarks</label>
                    <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-2 rounded whitespace-pre-wrap">{assignmentDetails.remarks}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setShowAssignmentDetailsModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Close
                  </button>
                  {assignmentDetails.status === "ASSIGNED" && isAdminOrHR && (
                    <button
                      onClick={handlePrepareReturnFromDetails}
                      className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                    >
                      Return Asset
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Asset History Modal */}
      <AnimatePresence>
        {showHistoryModal && assetHistory && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={() => setShowHistoryModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
            >
              <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-10 flex-shrink-0">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Asset History</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {assetHistory.asset_name} ({assetHistory.asset_tag}) - {assetHistory.total_assignments || 0} assignments
                  </p>
                </div>
                <button onClick={() => setShowHistoryModal(false)} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto flex-1 bg-gray-50">
                {assetHistory.data && assetHistory.data.length > 0 ? (
                  assetHistory.data.map((historyItem) => (
                    <div
                      key={historyItem.assignment_id}
                      className="border border-gray-200 bg-white rounded-lg p-4 shadow-sm hover:shadow transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3 border-b border-gray-100 pb-2">
                        <div>
                          <p className="text-sm font-bold text-gray-900">Assignment #{historyItem.assignment_id}</p>
                          <p className="text-xs font-semibold text-primary-600 mt-1">
                            Employee: {historyItem.employee_name}
                          </p>
                        </div>
                        <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadgeStyle(historyItem.status)}`}>
                          {historyItem.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-gray-600">
                        <div>
                          <label className="font-semibold text-gray-500 uppercase">Assigned By</label>
                          <p className="text-gray-900 font-medium mt-1">{historyItem.assigned_by_name || "N/A"}</p>
                        </div>
                        <div>
                          <label className="font-semibold text-gray-500 uppercase">Assigned Date</label>
                          <p className="text-gray-900 font-medium mt-1">{historyItem.assigned_date}</p>
                        </div>
                        <div>
                          <label className="font-semibold text-gray-500 uppercase">Expected Return</label>
                          <p className="text-gray-900 font-medium mt-1">{historyItem.expected_return || "-"}</p>
                        </div>
                        <div>
                          <label className="font-semibold text-gray-500 uppercase">Returned Date</label>
                          <p className="text-gray-900 font-medium mt-1">{historyItem.returned_date || "-"}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 mt-3 pt-2 border-t border-gray-50">
                        <div>
                          <label className="font-semibold text-gray-500 uppercase">Condition In</label>
                          <p className="mt-1">
                            <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getConditionBadgeStyle(historyItem.condition_in)}`}>
                              {historyItem.condition_in}
                            </span>
                          </p>
                        </div>
                        <div>
                          <label className="font-semibold text-gray-500 uppercase">Condition Out</label>
                          <p className="mt-1">
                            {historyItem.condition_out ? (
                              <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getConditionBadgeStyle(historyItem.condition_out)}`}>
                                {historyItem.condition_out}
                              </span>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </p>
                        </div>
                      </div>

                      {historyItem.remarks && (
                        <div className="mt-3 bg-gray-50 p-2 rounded text-xs border border-gray-100">
                          <label className="font-semibold text-gray-500 uppercase">Remarks</label>
                          <p className="text-gray-700 font-medium mt-1 whitespace-pre-wrap">{historyItem.remarks}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No assignment history found
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 px-6 py-4 flex sticky bottom-0 bg-white z-10 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setShowHistoryModal(false)}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AssetsManagement;
