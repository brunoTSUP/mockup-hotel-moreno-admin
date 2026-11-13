import { useState } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BedDouble,
  ClipboardList,
  Users,
  Building2,
  LogIn,
  LogOut,
  MessageSquareText,
  Settings2,
  Menu,
  ChevronDown,
  ShieldCheck,
  Headphones,
  X,
  Hotel,
  Bell,
  Check,
  PanelLeftClose,
} from "lucide-react";
import { useHotel } from "../../store/HotelContext";
import { Avatar } from "../ui/shared";
import { dateLabel, nowLocal } from "../../lib/utils";
const links = [
  ["/", "Dashboard", LayoutDashboard],
  ["/quartos", "Quartos", BedDouble],
  ["/hospedagens", "Hospedagens", ClipboardList],
  ["/hospedes", "Hóspedes", Users],
  ["/empresas", "Empresas", Building2],
  ["/check-ins", "Check-in", LogIn],
  ["/check-outs", "Check-out", LogOut],
  ["/templates", "Templates", MessageSquareText],
  ["/configuracoes", "Configurações", Settings2],
] as const;
export function Brand() {
  return (
    <div className="brand">
      <span className="brand-icon">
        <Hotel size={25} />
      </span>
      <div>
        <strong>HOTEL MORENO</strong>
      </div>
    </div>
  );
}
export function Layout() {
  const [menu, setMenu] = useState(false);
  const [alerts, setAlerts] = useState(false);
  const { toast, db } = useHotel();
  const location = useLocation();
  const title =
    links.find(([path]) =>
      path === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(path),
    )?.[1] || "Visão geral";
  const overdue = db.stays.filter(
    (s) => s.status === "Ativa" && s.end < nowLocal(),
  ).length;
  return (
    <div className="app-shell">
      <aside className={`sidebar ${menu ? "is-open" : ""}`}>
        <Link to="/" className="brand-link" onClick={() => setMenu(false)}>
          <Brand />
        </Link>
        <button
          className="sidebar-close"
          onClick={() => setMenu(false)}
          aria-label="Fechar menu"
        >
          <X size={20} />
        </button>
        <div className="sidebar-caption">PRINCIPAL</div>
        <nav>
          {links.map(([to, label, Icon], i) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setMenu(false)}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""} ${i === 7 ? "nav-divider" : ""}`
              }
            >
              <Icon size={19} />
              <span>{label}</span>
              {to === "/hospedagens" && (
                <span className="nav-count">
                  {db.stays.filter((s) => s.status === "Ativa").length}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="reception-note">
            <Headphones size={19} />
            <div>
              <strong>Hospitalidade em cada detalhe.</strong>
              <span>Itajobi, São Paulo</span>
            </div>
          </div>
          <div className="demo-label">
            <span />
            Ambiente de demonstração
          </div>
          <div className="sidebar-user">
            <Avatar name="Administrador" small />
            <div>
              <strong>Administrador</strong>
              <span>Acesso de demonstração</span>
            </div>
            <Link to="/login" aria-label="Sair" title="Sair">
              <LogOut size={18} />
            </Link>
          </div>
        </div>
      </aside>
      {menu && (
        <button
          className="mobile-overlay"
          onClick={() => setMenu(false)}
          aria-label="Fechar menu"
        />
      )}
      <div className="main-shell">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="menu-button"
              onClick={() => setMenu(!menu)}
              aria-label="Abrir menu"
            >
              <Menu size={21} />
            </button>
            <PanelLeftClose size={18} className="desktop-panel" />
            <span className="topbar-divider" />
            <span>{title}</span>
          </div>
          <div className="topbar-right">
            <span className="today-date">
              {dateLabel(nowLocal(), "EEEE, dd 'de' MMMM")}
            </span>
            <span className="topbar-divider" />
            <Avatar name="Administrador" small />
            <span className="topbar-user">Administrador</span>
            <ChevronDown size={14} />
          </div>
        </header>
        <main key={location.pathname} className="page-content">
          <Outlet />
        </main>
        <footer className="app-footer">
          <span>© {new Date().getFullYear()} Hotel Moreno</span>
          <span>
            <ShieldCheck size={13} /> Seus dados aqui são apenas demonstrativos
          </span>
        </footer>
      </div>
      {toast && (
        <div className="toast" role="status">
          <Check size={18} />
          {toast}
        </div>
      )}
    </div>
  );
}
