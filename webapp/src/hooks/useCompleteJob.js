import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeJob } from "../api/jobs";

export const useCompleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeJob,
    onSuccess: (data, variables) => {
      // This runs after the mutation is successful.
      console.log(`✅ Mutation successful for job: ${variables.jobId}`);

      // Invalidate and refetch the 'jobs' query to update the UI.
      // This will cause any component using `useJobs()` to re-render with fresh data.
      queryClient.invalidateQueries({
        queryKey: ["jobs", variables.companyId],
      });
    },
    onError: (error, variables) => {
      // This runs if the mutation fails.
      console.error(`🔥 Mutation failed for job: ${variables.jobId}`, error);
      // Here you could show an error toast to the user.
    },
  });
};
