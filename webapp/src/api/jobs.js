import {
  doc,
  updateDoc,
  serverTimestamp,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * Marks a specific job as complete in Firestore.
 * @param {object} params
 * @param {string} params.jobId - The ID of the job to complete.
 * @param {string} params.companyId - The ID of the company the job belongs to.
 * @param {string} params.notes - Any completion notes.
 * @returns {Promise<void>}
 */
export const completeJob = async ({ jobId, companyId, notes }) => {
  console.log(`📞 [API] completeJob called for jobId: ${jobId}`);
  const jobRef = doc(db, "companies", companyId, "jobs", jobId);
  await updateDoc(jobRef, {
    status: "completed",
    completedAt: serverTimestamp(),
    completionNotes: notes,
  });
};
