import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db, auth } from '../../firebase/config';
import { collection, addDoc, serverTimestamp, query, onSnapshot, where } from 'firebase/firestore';
import { Send, Users, UserPlus } from 'lucide-react';

const TeamManagement = ({ memberProfile }) => {
  const { t } = useTranslation();
  const isOwner = memberProfile?.role === 'owner';

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('crew');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [members, setMembers] = useState([]);
  const [invites, setInvites] = useState([]);

  const companyId = auth.currentUser?.uid;

  // Queries the top-level collection for pending invites and current members
  useEffect(() => {
    if (!companyId || !isOwner) return;

    const membersQuery = query(collection(db, 'companies', companyId, 'members'));
    const invitesQuery = query(collection(db, 'invitations'), where('companyId', '==', companyId), where('status', '==', 'pending'));

    const unsubMembers = onSnapshot(membersQuery, (snapshot) => {
      setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const unsubInvites = onSnapshot(invitesQuery, (snapshot) => {
      setInvites(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubMembers();
      unsubInvites();
    };
  }, [companyId, isOwner]);

  // Handles sending an invite
  const handleSendInvite = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!inviteEmail) {
        setError('Email is required.');
        return;
    }

    try {
        // Add the invitation to Firestore (invitations collection)
        const inviteDocRef = await addDoc(collection(db, 'invitations'), {
          companyId: companyId,
          companyName: companyProfile.companyName,
          email: inviteEmail.toLowerCase(),
          role: inviteRole,
          status: 'pending',
          invitedAt: serverTimestamp(),
        });
        const inviteCode = inviteDocRef.id;
        const inviteLink = `${window.location.origin}/register?inviteCode=${inviteCode}`;

        // In a real app, you would email this link. For our MVP, we'll show it.
    setSuccess(`Invite sent! Share this link with the user: ${inviteLink}`);
        setInviteEmail('');
    } catch (err) {
        setError(err.message);
        console.error(err);
    }
  };

  if (!isOwner) {
    return null; // Or a message saying "Only owners can manage team members."
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">{t('teamManagement.title')}</h2>

      {/* Invite Form */}
      <div className="mb-8 border-b pb-8">
        <h3 className="text-lg font-medium mb-4">{t('teamManagement.inviteTitle')}</h3>
        <form onSubmit={handleSendInvite} className="flex flex-col sm:flex-row sm:items-end sm:space-x-4 space-y-4 sm:space-y-0">
          <div className="flex-grow">
            <label htmlFor="inviteEmail" className="block text-sm font-medium text-gray-700">{t('teamManagement.emailLabel')}</label>
            <input type="email" id="inviteEmail" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="inviteRole" className="block text-sm font-medium text-gray-700">{t('teamManagement.roleLabel')}</label>
            <select id="inviteRole" value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="crew">{t('teamManagement.roleCrew')}</option>
              <option value="owner">{t('teamManagement.roleOwner')}</option>
            </select>
          </div>
          <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
            <Send className="w-5 h-5 mr-2" />
            {t('teamManagement.sendInvite')}
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
      </div>

      {/* Member & Invite Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center"><Users className="w-5 h-5 mr-2" />{t('teamManagement.currentMembers')}</h3>
          <ul className="space-y-2">
            {members.map(member => (
              <li key={member.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium text-gray-800">{member.email}</span>
                <span className="text-xs font-bold text-gray-500 uppercase">{member.role}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center"><UserPlus className="w-5 h-5 mr-2" />{t('teamManagement.pendingInvites')}</h3>
          <ul className="space-y-2">
            {invites.map(invite => (
              <li key={invite.id} className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                 <span className="text-sm text-gray-800">{invite.email}</span>
                 <span className="text-xs font-bold text-gray-500 uppercase">{invite.role}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;