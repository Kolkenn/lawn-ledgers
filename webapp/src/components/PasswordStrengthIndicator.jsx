import { useTranslation } from 'react-i18next';

// A simple checkmark icon component
const CheckIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

// A simple X icon component
const XIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
  </svg>
);

const Requirement = ({ met, text }) => (
  <li className={`flex items-center transition-colors ${met ? 'text-green-600' : 'text-gray-500'}`}>
    {met ? <CheckIcon className="h-5 w-5 mr-2" /> : <XIcon className="h-5 w-5 mr-2" />}
    <span>{text}</span>
  </li>
);

const PasswordStrengthIndicator = ({ validation }) => {
  const { t } = useTranslation();
  
  return (
    <ul className="mt-2 space-y-1 text-sm">
      <Requirement met={validation.length} text={t('passwordRequirements.length')} />
      <Requirement met={validation.uppercase} text={t('passwordRequirements.uppercase')} />
      <Requirement met={validation.lowercase} text={t('passwordRequirements.lowercase')} />
      <Requirement met={validation.number} text={t('passwordRequirements.number')} />
      <Requirement met={validation.special} text={t('passwordRequirements.special')} />
    </ul>
  );
};

export default PasswordStrengthIndicator;