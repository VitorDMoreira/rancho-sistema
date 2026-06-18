import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReservasPage } from './pages/ReservasPage'
import { FinanceiroPage } from './pages/FinanceiroPage'
import { CadastroPage } from './pages/CadastroPage'
import { RelatoriosPage } from './pages/RelatoriosPage'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { AuthProvider, useAuth } from './features/auth/AuthContext'

const queryClient = new QueryClient()

function Sidebar() {
  const location = useLocation()
  const { usuario, logout } = useAuth()
  const links = [
    { to: '/dashboard', label: '🏠 Dashboard' },
    { to: '/cadastro',  label: '📋 Cadastros' },
    { to: '/reservas',  label: '📅 Reservas' },
    { to: '/financeiro', label: '💰 Financeiro' },
    { to: '/relatorios', label: '📊 Relatórios' },
  ]
  return (
    <aside className="w-56 bg-white shadow-md min-h-screen p-4 flex flex-col justify-between">
      <nav className="flex flex-col gap-1">
        {links.map(l => (
          <Link key={l.to} to={l.to}
            className={`px-4 py-2 rounded text-sm font-medium ${
              location.pathname === l.to
                ? 'bg-green-100 text-green-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}>
            {l.label}
          </Link>
        ))}
      </nav>
      {usuario && (
        <div className="border-t pt-3 mt-3">
          <p className="text-sm font-medium text-gray-700 truncate">{usuario.nome}</p>
          <p className="text-xs text-gray-400 truncate mb-2">{usuario.email}</p>
          <button onClick={logout} className="text-xs text-red-500 hover:underline">Sair</button>
        </div>
      )}
    </aside>
  )
}

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { usuario } = useAuth()
  if (!usuario) return <Navigate to="/login" replace />
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<ProtectedLayout><DashboardPage /></ProtectedLayout>} />
      <Route path="/cadastro" element={<ProtectedLayout><CadastroPage /></ProtectedLayout>} />
      <Route path="/reservas" element={<ProtectedLayout><ReservasPage /></ProtectedLayout>} />
      <Route path="/financeiro" element={<ProtectedLayout><FinanceiroPage /></ProtectedLayout>} />
      <Route path="/relatorios" element={<ProtectedLayout><RelatoriosPage /></ProtectedLayout>} />
    </Routes>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-gray-100">
            <header className="bg-green-700 text-white px-6 py-3">
              <h1 className="text-lg font-bold">🏡 Rancho Sistema</h1>
            </header>
            <AppRoutes />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
