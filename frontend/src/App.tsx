import { Route, Routes } from 'react-router-dom';
import { AuthShell } from '@/components/auth/auth-shell';
import { HomePage } from '@/pages/home-page';
import { LoginPage } from '@/pages/login-page';
import { RegisterCompanyPage } from '@/pages/register-company-page';
import { RegisterProfessionalPage } from '@/pages/register-professional-page';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route element={<AuthShell />}>
        <Route path="entrar" element={<LoginPage />} />
        <Route path="cadastro/empresa" element={<RegisterCompanyPage />} />
        <Route
          path="cadastro/profissional"
          element={<RegisterProfessionalPage />}
        />
      </Route>
    </Routes>
  );
}

export default App;
