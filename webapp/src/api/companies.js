import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { sleep } from "../utils/sleep";

/**
 * Fetches a single company document from Firestore.
 * @param {string} companyId The ID of the company to fetch.
 * @returns {Promise<object|null>} The company data object or null if not found.
 */
export const getCompany = async (companyId) => {
  console.log(`📞 [API] getCompany called with companyId: ${companyId}`);
  await sleep(1500); // Simulate network delay
  if (!companyId) return null;
  const companySnap = await getDoc(doc(db, "companies", companyId));
  if (!companySnap.exists()) {
    console.log(`🟡 [API] getCompany: No company found for ID: ${companyId}`);
    return null;
  }
  const companyData = { id: companySnap.id, ...companySnap.data() };
  console.log(`✅ [API] getCompany: Found company data.`, companyData);
  return companyData;
};

/**
 * Fetches all company memberships for a given user.
 * @param {string} userId The ID of the user.
 * @returns {Promise<Array<object>>} An array of membership objects.
 */
export const getMemberships = async (userId) => {
  console.log(`📞 [API] getMemberships called for userId: ${userId}`);
  await sleep(1500); // Simulate network delay
  if (!userId) return [];
  const membershipsRef = collection(db, "users", userId, "memberships");
  const membershipSnapshot = await getDocs(membershipsRef);
  const memberships = membershipSnapshot.docs.map((doc) => doc.data());
  console.log(
    `✅ [API] getMemberships: Found ${memberships.length} memberships.`
  );
  return memberships;
};

/**
 * Fetches the role for a specific user within a company.
 * @param {string} userId The user's ID.
 * @param {string} companyId The company's ID.
 * @returns {Promise<string|null>} The user's role or null if not found.
 */
export const getRoleInCompany = async (userId, companyId) => {
  console.log(
    `📞 [API] getRoleInCompany called for userId: ${userId} in companyId: ${companyId}`
  );
  await sleep(1500); // Simulate network delay
  if (!userId || !companyId) return null;
  const memberSnap = await getDoc(
    doc(db, "companies", companyId, "members", userId)
  );
  if (!memberSnap.exists()) {
    console.log(`🟡 [API] getRoleInCompany: No member found.`);
    return null;
  }
  const role = memberSnap.data().role;
  console.log(`✅ [API] getRoleInCompany: Found role: ${role}`);
  return role;
};
