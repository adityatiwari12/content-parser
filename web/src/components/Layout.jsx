import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/generator', label: 'Generator' },
  { to: '/parser', label: 'Content Parser' },
  { to: '/plagiarism-check', label: 'Plag Check' },
]

function Layout() {
  return (
    <div className="site-shell">
      <header className="topbar">
        <div className="brand">Content Parser Lab</div>
        <nav>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
