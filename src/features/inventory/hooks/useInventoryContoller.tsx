import { useTranslation } from "react-i18next";
import { useCategories } from "./UseCategories";
import { useInventoryFilters } from "./useInventoryFilters";
import { usePrefetchProducts, useProducts } from "./UseProducts";
import { useCompanies } from "./useCompanies";

export const useInventoryController = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const {
    register,
    debouncedSearch,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    selectedCategory,
    selectedCompany,
    stockStatusFilter,
    withTrashedFilter,

    appliedMoreFilters,
    applyMoreFilters,
    resetMoreFilters,
  } = useInventoryFilters();

  const { data: companies = [] } = useCompanies();
  const { data: categoriesResponse } = useCategories();
  const categories = categoriesResponse?.data || [];

  const currentFilters = {
    search: debouncedSearch,
    category_id: selectedCategory,
    company_id: selectedCompany,
    stock_status: stockStatusFilter,
    with_trashed: withTrashedFilter,

    prescription_required: appliedMoreFilters.prescription_required,
    min_price: appliedMoreFilters.min_price,
    max_price: appliedMoreFilters.max_price,
    expiry_filter: appliedMoreFilters.expiry_filter,
    stock_range: appliedMoreFilters.stock_range,
    sort_by: appliedMoreFilters.sort_by,

    page: currentPage,
    per_page: itemsPerPage,
  };

  const {
    data: ProductResponse,
    isLoading,
    isError,
    error,
    isFetching,
  } = useProducts(currentFilters);

  const products = ProductResponse?.data || [];
  const meta = ProductResponse?.meta;
  const totalPages = meta?.last_page || 1;
  const prefetchProducts = usePrefetchProducts();

  const handleFilterFocus = () => {
    prefetchProducts(currentFilters);
  };

  const handleNextPage = () =>
    setCurrentPage((p) => Math.min(p + 1, totalPages));
  const handlePreviousPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

  return {
    t,
    isArabic,
    register,
    categories,
    companies,
    products,
    meta,
    currentPage,
    totalPages,
    isLoading,
    isFetching,
    isError,
    errorMessage: error?.message || "Check API configuration",
    handleFilterFocus,
    handleNextPage,
    handlePreviousPage,

    // تصدير الوظائف الجديدة لاستعمالها في الـ UI
    applyMoreFilters,
    resetMoreFilters,
  };
};
