import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Search, Filter, ChevronDown, Edit, Trash2, 
  X, Check, AlertCircle, FileText, Download 
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'
import {
  useExpenses,
  useExpenseCategories,
  useExpenseSubCategories,
  useCreateExpense,
  useUpdateExpense,
  useDeleteExpense
} from '../hooks/useExpenses'

const PAYMENT_METHODS = [
  { value: "cash", label: "Cash" },
  { value: "upi", label: "UPI" },
  { value: "card", label: "Card" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "cheque", label: "Cheque" }
];

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft", color: "bg-gray-100 text-gray-800" },
  { value: "submitted", label: "Submitted", color: "bg-blue-100 text-blue-800" },
  { value: "approved", label: "Approved", color: "bg-green-100 text-green-800" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800" },
  { value: "paid", label: "Paid", color: "bg-teal-100 text-teal-800" }
];

const formatCurrency = (val) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(val || 0);
};

const getStatusColor = (status) => {
  const option = STATUS_OPTIONS.find(item => item.value === status);
  return option?.color || "bg-gray-100 text-gray-800";
};

const Expenses = () => {
  const fileInputRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedSubCategories, setExpandedSubCategories] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    startDate: "",
    endDate: ""
  });

  const [formData, setFormData] = useState({
    category_id: "",
    sub_category_id: "",
    amount: "",
    expense_date: format(new Date(), "yyyy-MM-dd"),
    description: "",
    vendor_name: "",
    payment_method: "card",
    expense_type: ""
  });
  
  const [attachmentFile, setAttachmentFile] = useState(null);

  // Fetch hook queries
  const { data: expensesResponse, isLoading: isExpensesLoading } = useExpenses();
  const { data: categoriesResponse } = useExpenseCategories();

  let selectedCategoryIdForSub = null;
  if (formData.category_id) {
    const val = String(formData.category_id).trim();
    if (val !== "") {
      const parsed = parseInt(val, 10);
      if (!isNaN(parsed)) {
        selectedCategoryIdForSub = parsed;
      }
    }
  }

  const { data: subCategoriesResponse } = useExpenseSubCategories(selectedCategoryIdForSub);

  const createMutation = useCreateExpense();
  const updateMutation = useUpdateExpense();
  const deleteMutation = useDeleteExpense();

  const categories = Array.isArray(categoriesResponse) 
    ? categoriesResponse 
    : categoriesResponse?.data || [];

  const subCategories = Array.isArray(subCategoriesResponse) 
    ? subCategoriesResponse 
    : subCategoriesResponse?.data || [];

  const allExpensesData = Array.isArray(expensesResponse?.data) 
    ? expensesResponse.data 
    : expensesResponse || [];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachmentFile(e.target.files[0]);
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setEditingExpense(null);
    setFormData({
      category_id: "",
      sub_category_id: "",
      amount: "",
      expense_date: format(new Date(), "yyyy-MM-dd"),
      description: "",
      vendor_name: "",
      payment_method: "card",
      expense_type: ""
    });
    setAttachmentFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category_id || !formData.amount || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const toastId = toast.loading(editingExpense ? "Updating expense..." : "Creating expense...");
    try {
      const dataToSubmit = new FormData();
      dataToSubmit.append("category_id", formData.category_id);
      dataToSubmit.append("sub_category_id", formData.sub_category_id || "");
      dataToSubmit.append("amount", formData.amount);
      dataToSubmit.append("expense_date", formData.expense_date);
      dataToSubmit.append("description", formData.description);
      dataToSubmit.append("vendor_name", formData.vendor_name || "");
      dataToSubmit.append("payment_method", formData.payment_method);
      dataToSubmit.append("expense_type", formData.expense_type || "");

      if (attachmentFile) {
        dataToSubmit.append("attachments", attachmentFile);
      }

      if (editingExpense) {
        await updateMutation.mutateAsync({
          id: editingExpense.id,
          data: dataToSubmit
        });
        toast.success("Expense updated successfully! ✅", { id: toastId });
      } else {
        await createMutation.mutateAsync(dataToSubmit);
        toast.success("Expense created successfully! ✅", { id: toastId });
      }
      resetForm();
    } catch (err) {
      console.error("Failed to save expense:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to save expense";
      toast.error(errMsg, { id: toastId });
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      category_id: expense.category_id || "",
      sub_category_id: expense.sub_category_id || "",
      amount: expense.amount || "",
      expense_date: expense.expense_date || format(new Date(), "yyyy-MM-dd"),
      description: expense.description || "",
      vendor_name: expense.vendor_name || "",
      payment_method: expense.payment_method || "card",
      expense_type: expense.expense_type || ""
    });
    setAttachmentFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    const toastId = toast.loading("Deleting expense...");
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Expense deleted successfully! ✅", { id: toastId });
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to delete expense";
      toast.error(errMsg, { id: toastId });
    }
  };

  const handleResetFilters = () => {
    setFilters({
      status: "",
      category: "",
      startDate: "",
      endDate: ""
    });
  };

  const isAnyFilterActive = Object.values(filters).some(v => v !== "");

  const filteredExpensesByCategory = allExpensesData.map(catGroup => {
    return {
      ...catGroup,
      expenses: (catGroup.expenses || []).filter(exp => {
        const matchesSearch = 
          (exp.description?.toLowerCase().includes(searchTerm.toLowerCase())) || 
          (exp.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase()));
          
        const matchesStatus = !filters.status || exp.status === filters.status;
        const matchesCategory = !filters.category || String(exp.category_id) === filters.category;
        
        let matchesDates = true;
        if (filters.startDate || filters.endDate) {
          const expDate = exp.expense_date ? new Date(exp.expense_date) : null;
          if (filters.startDate && expDate) {
            matchesDates = matchesDates && expDate >= new Date(filters.startDate + "T00:00:00");
          }
          if (filters.endDate && expDate) {
            matchesDates = matchesDates && expDate <= new Date(filters.endDate + "T23:59:59");
          }
        }
        
        return matchesSearch && matchesStatus && matchesCategory && matchesDates;
      })
    };
  }).filter(catGroup => catGroup.expenses.length > 0);

  const toggleSubCategoryExpand = (id) => {
    setExpandedSubCategories(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleCategoryExpand = (id) => {
    setExpandedCategories(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getFinancialYearDates = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const startYear = now.getMonth() >= 3 ? currentYear : currentYear - 1;
    const start = new Date(startYear, 3, 1); // April 1st
    const end = new Date(startYear + 1, 2, 31); // March 31st
    return { start, end };
  };

  const allFlatExpenses = allExpensesData.flatMap(catGroup => catGroup.expenses || []);
  
  const stats = (() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    
    // Week calculations
    const sundayIndex = 0;
    const currentDay = now.getDay();
    const distanceToMonday = currentDay === sundayIndex ? 6 : currentDay - 1;
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - distanceToMonday);
    const nextSunday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - distanceToMonday + 6, 23, 59, 59);

    // Month calculations
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // FY calculations
    const { start: fyStart, end: fyEnd } = getFinancialYearDates();

    const todayExpenses = allFlatExpenses.filter(e => {
      const d = new Date(e.expense_date);
      return d >= todayStart && d <= todayEnd;
    });

    const weekExpenses = allFlatExpenses.filter(e => {
      const d = new Date(e.expense_date);
      return d >= monday && d <= nextSunday;
    });

    const monthExpenses = allFlatExpenses.filter(e => {
      const d = new Date(e.expense_date);
      return d >= monthStart && d <= monthEnd;
    });

    const fyExpenses = allFlatExpenses.filter(e => {
      const d = new Date(e.expense_date);
      return d >= fyStart && d <= fyEnd;
    });

    return {
      today: todayExpenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0),
      week: weekExpenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0),
      month: monthExpenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0),
      year: fyExpenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0)
    };
  })();

  const formatDisplayDateTime = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const date = parseISO(dateStr);
      return format(date, "dd MMM, yyyy hh:mm a");
    } catch {
      try {
        const date = new Date(dateStr);
        return format(date, "dd MMM, yyyy hh:mm a");
      } catch {
        return dateStr;
      }
    }
  };

  const getAPIHost = () => {
    const base = import.meta.env.VITE_API_BASE_URL || "http://localhost/hrms_backend/public/api";
    return base.replace('/api', '');
  };

  if (isExpensesLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600 mt-1">
            {filteredExpensesByCategory.reduce((sum, catGroup) => sum + catGroup.expenses.length, 0)} total expenses
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Expense
        </button>
      </div>

      {/* Expense Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today", value: stats.today, icon: "📅" },
          { label: "This Week", value: stats.week, icon: "📊" },
          { label: "This Month", value: stats.month, icon: "📈" },
          { label: "This Year (Apr-Mar)", value: stats.year, icon: "📉" }
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium text-gray-600">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(item.value)}</p>
            </div>
            <div className="text-3xl opacity-50">{item.icon}</div>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by description or vendor..."
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
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-gray-100 overflow-hidden"
              >
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={e => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                  >
                    <option value="">All Statuses</option>
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
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
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={e => setFilters({ ...filters, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={e => setFilters({ ...filters, endDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                  />
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

        {/* Expenses List */}
        <div className="divide-y divide-gray-100">
          {filteredExpensesByCategory.length > 0 ? (
            filteredExpensesByCategory.map((catGroup) => {
              const categoryTotal = catGroup.expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
              const latestExpense = catGroup.expenses.reduce((latest, current) => {
                const curDate = new Date(current.created_at || current.expense_date);
                const latDate = new Date(latest.created_at || latest.expense_date);
                return curDate > latDate ? current : latest;
              }, catGroup.expenses[0]);

              return (
                <div key={catGroup.category_id} className="border-b border-gray-100 last:border-b-0">
                  <button
                    onClick={() => toggleCategoryExpand(catGroup.category_id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1 text-left">
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          expandedCategories[catGroup.category_id] ? "rotate-180" : ""
                        }`}
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{catGroup.category_name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {catGroup.expenses.length} expenses • Latest: {formatDisplayDateTime(latestExpense.created_at || latestExpense.expense_date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right font-bold text-gray-900 text-lg">
                      {formatCurrency(categoryTotal)}
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedCategories[catGroup.category_id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gray-50 border-t border-gray-100 overflow-hidden"
                      >
                        <div className="px-6 py-4 space-y-3">
                          {catGroup.expenses.map((expense) => (
                            <div
                              key={expense.id}
                              className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
                            >
                              <button
                                onClick={() => toggleSubCategoryExpand(expense.id)}
                                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-center gap-3 flex-1 text-left">
                                  <ChevronDown
                                    className={`w-4 h-4 text-gray-400 transition-transform ${
                                      expandedSubCategories[expense.id] ? "rotate-180" : ""
                                    }`}
                                  />
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium text-gray-900">
                                        {expense.sub_category_name || "Uncategorized"}
                                      </p>
                                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full capitalize ${getStatusColor(expense.status)}`}>
                                        {expense.status}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1">
                                      Submitted by: {expense.user_name || "N/A"}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-gray-900">{formatCurrency(expense.amount)}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {expense.created_at ? formatDisplayDateTime(expense.created_at) : "N/A"}
                                  </p>
                                </div>
                              </button>

                              <AnimatePresence>
                                {expandedSubCategories[expense.id] && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-gray-50 border-t border-gray-200 overflow-hidden"
                                  >
                                    <div className="px-4 py-3 space-y-4">
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div>
                                          <label className="text-xs font-medium text-gray-600">Sub Category</label>
                                          <p className="text-sm font-medium text-gray-900 mt-1">
                                            {expense.sub_category_name || "N/A"}
                                          </p>
                                        </div>
                                        <div>
                                          <label className="text-xs font-medium text-gray-600">Payment Method</label>
                                          <p className="text-sm font-medium text-gray-900 mt-1 capitalize">
                                            {expense.payment_method?.replace(/_/g, ' ') || "N/A"}
                                          </p>
                                        </div>
                                        <div>
                                          <label className="text-xs font-medium text-gray-600">Created Date</label>
                                          <p className="text-sm font-medium text-gray-900 mt-1">
                                            {formatDisplayDateTime(expense.created_at)}
                                          </p>
                                        </div>
                                        {expense.vendor_name && (
                                          <div>
                                            <label className="text-xs font-medium text-gray-600">Vendor</label>
                                            <p className="text-sm font-medium text-gray-900 mt-1">
                                              {expense.vendor_name}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                      
                                      <div>
                                        <label className="text-xs font-medium text-gray-600">Description</label>
                                        <p className="text-sm text-gray-900 mt-1 bg-white p-2 rounded border border-gray-200 whitespace-pre-wrap">
                                          {expense.description}
                                        </p>
                                      </div>

                                      {expense.attachments && expense.attachments.length > 0 && (
                                        <div>
                                          <label className="text-xs font-medium text-gray-600">Attachments</label>
                                          <div className="mt-2 space-y-2">
                                            {expense.attachments.map((file) => (
                                              <a
                                                key={file.id}
                                                href={`${getAPIHost()}/storage/${file.file_path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors w-max"
                                              >
                                                <FileText className="w-4 h-4 text-blue-600" />
                                                <span className="text-sm text-blue-600 font-medium truncate max-w-xs">
                                                  {file.file_path.split('/').pop()}
                                                </span>
                                                <Download className="w-4 h-4 text-gray-500 ml-2" />
                                              </a>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {(expense.status !== "approved" && expense.status !== "paid") && (
                                        <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                                          <button
                                            onClick={() => handleEdit(expense)}
                                            className="p-2 text-primary-600 hover:bg-primary-50 rounded transition-colors"
                                            title="Edit Expense"
                                          >
                                            <Edit className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() => handleDelete(expense.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                            title="Delete Expense"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-gray-500">
              No expenses found
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={resetForm}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-10">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingExpense ? "Edit Expense" : "New Expense"}
                </h2>
                <button onClick={resetForm} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={e => {
                        setFormData({
                          ...formData,
                          category_id: e.target.value,
                          sub_category_id: ""
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
                    <select
                      name="sub_category_id"
                      value={formData.sub_category_id}
                      onChange={handleFormChange}
                      disabled={!formData.category_id}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white disabled:bg-gray-50"
                    >
                      <option value="">Select Sub Category</option>
                      {subCategories.map(sub => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="amount"
                      step="0.01"
                      value={formData.amount}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expense Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="expense_date"
                      value={formData.expense_date}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name</label>
                    <input
                      type="text"
                      name="vendor_name"
                      value={formData.vendor_name}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Vendor name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="payment_method"
                      value={formData.payment_method}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                      required
                    >
                      {PAYMENT_METHODS.map(method => (
                        <option key={method.value} value={method.value}>{method.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter description..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Attachment</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">Max 5MB. Allowed formats: JPG, PNG, PDF</p>
                  {attachmentFile && (
                    <p className="text-xs text-gray-700 mt-1 font-medium">
                      Selected file: {attachmentFile.name} ({(attachmentFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Expense"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Expenses;
