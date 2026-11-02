import { useState } from 'react';
import { Building2, Home, Users, FileText, Wallet, Wrench, BarChart3, Search, Bell, ChevronDown } from 'lucide-react';

const sections = [
  { name: 'Overview', icon: Building2 }, { name: 'Properties', icon: Home },
  { name: 'Units', icon: Building2 }, { name: 'Tenants', icon: Users },
  { name: 'Leases', icon: FileText }, { name: 'Rent & Payments', icon: Wallet },
  { name: 'Maintenance', icon: Wrench }, { name: 'Reports', icon: BarChart3 },
];

export default function App() {
  const [active, setActive] = useState('Overview');
  return <div className="app-shell">
    <header className="topbar"><a className="brand" href="#"><span className="brand-mark">S</span><span>Sifo<span className="brand-gold">Property</span><small>Property management</small></span></a>
      <nav className="main-nav">{sections.map(s => <button key={s.name} className={active === s.name ? 'nav-item active' : 'nav-item'} onClick={() => setActive(s.name)}>{s.name}</button>)}</nav>
      <div className="top-actions"><button className="icon-button" aria-label="Search"><Search size={18}/></button><button className="icon-button" aria-label="Notifications"><Bell size={18}/></button><button className="profile">Admin <ChevronDown size={14}/></button></div>
    </header>
    <main className="content"><div className="page-heading"><div><p className="eyebrow">PROPERTY OPERATIONS</p><h1>{active}</h1><p className="muted">Manage your property portfolio, tenants and rental operations.</p></div><button className="primary-button">+ Add {active === 'Overview' ? 'property' : active.toLowerCase().replace(/s$/, '')}</button></div>
      <div className="notice"><strong>Welcome to SifoProperty</strong><span>This is the independent application foundation. Dashboard values are placeholders; no live property or tenant data is connected.</span></div>
      <section className="stats-grid">{[['Properties','0','In your portfolio'],['Occupied units','0','Occupancy not configured'],['Rent received','K0.00','Current month'],['Outstanding rent','K0.00','Awaiting setup']].map(([label,value,sub])=><article className="stat-card" key={label}><span>{label}</span><strong>{value}</strong><small>{sub}</small></article>)}</section>
      <section className="panel-grid"><article className="panel"><div className="panel-title"><h2>Portfolio workspace</h2><span className="status-pill">Setup pending</span></div><p className="muted">Manage properties, units, tenants, leases, rent collections and maintenance from one workspace.</p><div className="quick-links">{sections.slice(1).map(s=><button key={s.name} onClick={()=>setActive(s.name)}><s.icon size={18}/>{s.name}<span>→</span></button>)}</div></article><article className="panel"><h2>Getting started</h2><ol className="steps"><li>Set up your company and property portfolio</li><li>Add buildings, units and rental rates</li><li>Register tenants and capture lease terms</li><li>Set rent schedules, deposits and reminders</li><li>Record payments and maintenance requests</li></ol></article></section>
      <footer>© {new Date().getFullYear()} Sifonet Technologies · SifoProperty</footer>
    </main>
  </div>;
}
