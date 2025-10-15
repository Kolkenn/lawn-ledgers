import { useQuery } from "@tanstack/react-query";
import { getCompany } from "../api/companies";

/**
 * Custom hook to fetch a company's profile.
 * @param {string} companyId The ID of the company to fetch.
 */
export const useCompany = (companyId) => {
  const query = useQuery({
    queryKey: ["company", companyId],
    queryFn: () => getCompany(companyId),
    enabled: !!companyId,
    // Keep company data fresh for a while before refetching.
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  console.log(" [HOOK] useCompany status:", {
    companyId: companyId,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isSuccess: query.isSuccess,
    isStale: query.isStale,
  });

  return query;
};
