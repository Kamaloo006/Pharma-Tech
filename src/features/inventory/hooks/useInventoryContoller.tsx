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
    prescriptionFilter,
    stockStatusFilter,
    withTrashedFilter,
  } = useInventoryFilters();

  const { data: companies = [] } = useCompanies();
  const { data: categoriesResponse } = useCategories();
  const categories = categoriesResponse?.data || [];

  const {
    data: ProductResponse,
    isLoading,
    isError,
    error,
    isFetching,
  } = useProducts({
    search: debouncedSearch,
    category_id: selectedCategory,
    company_id: selectedCompany,
    prescription_required: prescriptionFilter,
    stock_status: stockStatusFilter,
    with_trashed: withTrashedFilter,
    page: currentPage,
    per_page: itemsPerPage,
  });

  const products = ProductResponse?.data || [];
  const meta = ProductResponse?.meta;
  const totalPages = meta?.last_page || 1;
  const prefetchProducts = usePrefetchProducts();

  const handleFilterFocus = () => {
    prefetchProducts({
      search: debouncedSearch,
      category_id: selectedCategory,
      company_id: selectedCompany,
      prescription_required: prescriptionFilter,
      stock_status: stockStatusFilter,
      with_trashed: withTrashedFilter,
      page: currentPage,
      per_page: itemsPerPage,
    });
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
  };
};
