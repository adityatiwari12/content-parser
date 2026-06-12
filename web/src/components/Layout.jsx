import { NavLink, Outlet } from 'react-router-dom'

const primaryNav = [
  { to: '/', label: 'Overview', end: true },
  { to: '/how-it-works', label: 'How it works' },
]

const toolNav = [
  { to: '/generator', label: 'Document Synthesis' },
  { to: '/parser', label: 'Semantic Analysis' },
  { to: '/plagiarism-check', label: 'Provenance Scan' },
]

function Layout() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="site-header__inner">
          <NavLink to="/" className="brand">
            <span className="brand__mark" aria-hidden="true">A</span>
            <div className="brand__text">
              <span className="brand__name">Axiom Lab</span>
              <span className="brand__subtitle">Research Intelligence Suite</span>
            </div>
          </NavLink>

          <nav className="site-nav" aria-label="Primary">
            {primaryNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `nav-item ${isActive ? 'nav-item--active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <nav className="site-nav site-nav--tools" aria-label="Research tools">
            {toolNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item nav-item--tool ${isActive ? 'nav-item--active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="site-header__meta">
            <span className="system-status">
              <span className="system-status__indicator" aria-hidden="true" />
              Inference cluster operational
            </span>
          </div>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="site-footer__inner">
          <div className="site-footer__brand">
            <strong>Axiom Lab</strong>
            <span>Scholarly AI infrastructure for research teams</span>
          </div>
          <div className="site-footer__models">
            <span>Models</span>
            <code>axiom-writer-v2</code>
            <code>semantic-net-7b</code>
            <code>trace-scan-xl</code>
          </div>
          <div className="site-footer__legal">
            <span>v2.4.1 · Research preview</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
