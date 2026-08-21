import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api"; 
import type { CashBox, CashBoxStats, Transaction, PaginationMeta, TransactionsFilterParams } from "../types/cashBox" 


export const CASH_BOX_QUERY_KEYS = {
  all: ["cashBox"] as const,
  details: () => [...CASH_BOX_QUERY_KEYS.all, "details"] as const,
  statistics: () => [...CASH_BOX_QUERY_KEYS.all, "statistics"] as const,
  transactions: (params: unknown) => [...CASH_BOX_QUERY_KEYS.all, "transactions", params] as const,
  chartData: (dateFrom: string, dateTo: string) => [...CASH_BOX_QUERY_KEYS.all, "chart", { dateFrom, dateTo }] as const, 
};

export function useCashBox() {
  const queryClient = useQueryClient();

  const cashBoxQuery = useQuery<CashBox | null>({
    queryKey: CASH_BOX_QUERY_KEYS.details(),
    queryFn: async () => {
      const response = await api.get("cash-boxes");
      if (response.data && response.data.data) return response.data.data;
      if (response.data && response.data.active_box) return response.data.active_box;
      return null;
    },
    retry: (failureCount, error: unknown) => {
      if ((error as { response?: { status?: number } }).response?.status === 404) return false; 
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000,
  });

  const statsQuery = useQuery<CashBoxStats>({
    queryKey: CASH_BOX_QUERY_KEYS.statistics(),
    queryFn: async () => {
      const response = await api.get("cash-boxes/statistics");
      return response.data;
    },
    enabled: !!cashBoxQuery.data, 
  });

  const createCashBoxMutation = useMutation({
    mutationFn: async (openingBalance: number) => {
      const response = await api.post("cash-boxes", {
        opening_balance: openingBalance,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CASH_BOX_QUERY_KEYS.all });
    }
  });

  // 🛠️ تعديل دالة الإنشـاء لتطابق التوقع وتمرير الأخطاء بشكل صحيح
  const handleCreateCashBox = async (openingBalance: number) => {
    try {
      await createCashBoxMutation.mutateAsync(openingBalance);
      return { success: true };
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message;
      return { success: false, error: errorMessage };
    }
  };

  return {
    cashBox: cashBoxQuery.data ?? null,
    statistics: statsQuery.data ?? null,
    isLoading: cashBoxQuery.isLoading || (!!cashBoxQuery.data && statsQuery.isLoading),
    isSubmitting: createCashBoxMutation.isPending,
    createCashBox: handleCreateCashBox, // <-- تم التحديث هنا
  };
}


export function useCashBoxTransactions(params: TransactionsFilterParams, enabled: boolean) {
  return useQuery<{ data: Transaction[]; meta: PaginationMeta }>({
    queryKey: CASH_BOX_QUERY_KEYS.transactions(params),
    queryFn: async () => {
      const response = await api.get("cash-boxes/transactions", {
        params: {
          page: params.page,
          per_page: params.per_page,
          transaction_type: params.type !== "all" ? params.type : undefined,
          search: params.search || undefined,
          date_from: params.date_from || undefined,
          date_to: params.date_to || undefined,
        }
      });
      return response.data;
    },
    enabled: enabled,
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData, // يمنع اختفاء الجدول أثناء الانتقال
  });
}

export function useCashBoxChartData(dateFrom: string, dateTo: string, enabled: boolean) {
  return useQuery<Transaction[]>({
    queryKey: CASH_BOX_QUERY_KEYS.chartData(dateFrom, dateTo),
    queryFn: async () => {
      const response = await api.get("cash-boxes/transactions", {
        params: {
          date_from: dateFrom,
          date_to: dateTo,
          per_page: 500, 
        }
      });
      return response.data?.data || [];
    },
    enabled: enabled,
  });
}