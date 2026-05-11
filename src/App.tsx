import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import { LoginPage, RegisterPage } from './pages/auth';
import { HomePage } from './pages/home';
import { CardsPage, CardDetailPage } from './pages/cards';
import { InventoryPage } from './pages/inventory';
import { ProfilePage, PublicProfilePage } from './pages/profile';
import { AdminPage } from './pages/admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="cards" element={<CardsPage />} />
          <Route path="cards/:id" element={<CardDetailPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="u/:username" element={<PublicProfilePage />} />
          <Route path="admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;