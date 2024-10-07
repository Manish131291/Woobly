import { useTranslation } from 'react-i18next';

import '../styles/template.style.scss';

const ModuleTemplate: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t('webView')}</h1>
    </div>
  );
};

export default ModuleTemplate;
