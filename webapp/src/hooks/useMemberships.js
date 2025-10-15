import { useQuery } from "@tanstack/react-query";
import { getMemberships } from "../api/companies";

/**
 * Custom hook to fetch company memberships for a user.
 * @param {string} userId The ID of the user whose memberships to fetch.
 */
export const useMemberships = (userId) => {
  const query = useQuery({
    // The query will re-run if the userId changes.
    queryKey: ["memberships", userId],
    queryFn: () => getMemberships(userId),
    // Only run the query if the userId is available.
    enabled: !!userId,
  });

  console.log("[HOOK] useMemberships status:", {
    userId: userId,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isSuccess: query.isSuccess,
    isStale: query.isStale,
  });

  return query;
};
