import { useMemo, useState } from "react";
import {
  ArrowDownRight, ArrowUpRight, Bell, Building2, CalendarDays, ChartNoAxesCombined,
  ChevronDown, CircleDollarSign, ClipboardList, DoorOpen, FileText, LayoutDashboard,
  Plus, Search, Settings, ShieldCheck, Users, Wallet, Wrench, X, Pencil, Trash2,
  Menu, MapPin, MoreHorizontal, CheckCircle2, Clock3, AlertTriangle,
} from "lucide-react";

type ModuleKey = "Dashboard" | "Properties" | "Units" | "Tenants" | "Leases" | "Rent & Payments" | "Maintenance" | "Expenses" | "Reports" | "Settings";
type RecordRow = { id: number; name: string; detail: string; status: string; amount?: number; date?: string };
type RecordStore = Record<ModuleKey, RecordRow[]>;
const modules: { name: ModuleKey; icon: typeof LayoutDashboard; hint: string }[] = [
  { name: "Dashboard", icon: LayoutDashboard, hint: "Portfolio overview and daily priorities" },
  { name: "Properties", icon: Building2, hint: "Buildings, locations and ownership" },
  { name: "Units", icon: DoorOpen, hint: "Rental units, occupancy and rates" },
  { name: "Tenants", icon: Users, hint: "Tenant profiles and rental history" },
  { name: "Leases", icon: FileText, hint: "Agreements, renewals and deposits" },
  { name: "Rent & Payments", icon: Wallet, hint: "Rent schedules, collections and arrears" },
  { name: "Maintenance", icon: Wrench, hint: "Requests, inspections and work orders" },
  { name: "Expenses", icon: CircleDollarSign, hint: "Operating costs and supplier charges" },
  { name: "Reports", icon: ChartNoAxesCombined, hint: "Occupancy, rent roll and performance" },
  { name: "Settings", icon: Settings, hint: "Company, payment and access settings" },
];
const blankStore = (): RecordStore => Object.fromEntries(modules.map(m => [m.name, []])) as RecordStore;
const money = (value: number) => new Intl.NumberFormat("en-ZM", { style: "currency", currency: "ZMW", maximumFractionDigits: 2 }).format(value);
const today = new Date().toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });

function App() {
  const [active, setActive] = useState<ModuleKey>("Dashboard");
  const [rows, setRows] = useState<RecordStore>(blankStore);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<RecordRow | null>(null);
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [status, setStatus] = useState("Active");
  const [amount, setAmount] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notice, setNotice] = useState(true);
  const allRecords = Object.values(rows).flat();
  const properties = rows.Properties.length;
  const units = rows.Units.length;
  const tenants = rows.Tenants.length;
  const occupied = rows.Units.filter(x => x.status.toLowerCase() === "occupied").length;
  const rentTotal = rows["Rent & Payments"].reduce((sum, x) => sum + Number(x.amount || 0), 0);
  const arrears = rows["Rent & Payments"].filter(x => x.status.toLowerCase() === "overdue").reduce((sum, x) => sum + Number(x.amount || 0), 0);
  const filtered = useMemo(() => (rows[active] || []).filter(r => (r.name + " " + r.detail + " " + r.status).toLowerCase().includes(query.toLowerCase())), [rows, active, query]);
  const current = modules.find(m => m.name === active)!;
  const CurrentIcon = current.icon;
  const openAdd = () => { setEditing(null); setName(""); setDetail(""); setStatus("Active"); setAmount(""); setShowForm(true); };
  const openEdit = (row: RecordRow) => { setEditing(row); setName(row.name); setDetail(row.detail); setStatus(row.status); setAmount(String(row.amount ?? "")); setShowForm(true); };
  const save = () => {
    if (!name.trim()) return;
    const record: RecordRow = { id: editing?.id ?? Date.now(), name: name.trim(), detail: detail.trim(), status, ...(amount.trim() ? { amount: Number(amount) || 0 } : {}) };
    setRows(prev => ({ ...prev, [active]: editing ? prev[active].map(x => x.id === editing.id ? record : x) : [...prev[active], record] }));
    setShowForm(false);
  };
  const remove = (id: number) => { if (window.confirm("Delete this demo record?")) setRows(prev => ({ ...prev, [active]: prev[active].filter(x => x.id !== id) })); };
  const navigate = (name: ModuleKey) => { setActive(name); setQuery(""); setMobileMenu(false); };

  return <div className="property-app">
    <header className="property-topbar">
      <a className="property-brand" href="#" onClick={e => { e.preventDefault(); navigate("Dashboard"); }}>
        <span className="property-brand-mark"><Building2 size={22}/></span>
        <span><b>Sifo<span>Property</span></b><small>Property Management</small></span>
      </a>
      <div className="property-company"><span className="company-avatar">SP</span><span><b>SifoProperty Demo Company</b><small><MapPin size={11}/> Ndola, Zambia</small></span><ChevronDown size={15}/></div>
      <div className="property-top-actions"><span className="demo-chip">DEMO WORKSPACE</span><button aria-label="Notifications"><Bell size={18}/><i>2</i></button><button className="user-chip">AD <ChevronDown size={13}/></button><button className="mobile-menu-trigger" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Open navigation"><Menu/></button></div>
    </header>
    <nav className={"property-nav " + (mobileMenu ? "mobile-open" : "")} aria-label="Main navigation">
      {modules.map(m => { const I = m.icon; return <button key={m.name} className={active === m.name ? "selected" : ""} onClick={() => navigate(m.name)}><I size={15}/><span>{m.name}</span></button>; })}
    </nav>
    <main className="property-content">
      <section className="property-welcome">
        <div><p>PROPERTY OPERATIONS · PORTFOLIO MANAGER</p><h1>Manage your properties with clarity.</h1><span>One workspace for buildings, tenants, leases, rent and maintenance.</span><div className="welcome-meta"><span><CalendarDays size={14}/>{today}</span><span><MapPin size={14}/>Ndola, Zambia</span><span className="live-dot">Independent application</span></div></div>
        <div className="welcome-art"><Building2 size={96}/><span>PROPERTY<br/>PORTFOLIO</span></div>
      </section>
      {notice && <div className="property-notice"><ShieldCheck size={18}/><div><b>Independent SifoProperty workspace</b><span>This is a frontend demo. Records are temporary and no live property database is connected yet.</span></div><button onClick={() => setNotice(false)} aria-label="Dismiss"><X size={16}/></button></div>}
      <section className="property-page-head"><div><p className="eyebrow">SIFOPROPERTY · WORKSPACE</p><h2>{active}</h2><span>{current.hint}</span></div><div className="page-actions">{active !== "Dashboard" && active !== "Reports" && active !== "Settings" && <button className="gold-button" onClick={openAdd}><Plus size={16}/>Add {active === "Properties" ? "property" : "record"}</button>}<button className="outline-button" onClick={() => { setQuery(""); }}><MoreHorizontal size={17}/>Options</button></div></section>
      {active === "Dashboard" ? <>
        <section className="property-kpis">
          <Kpi icon={Building2} label="Properties" value={String(properties)} note="Portfolio records" tone="green"/>
          <Kpi icon={DoorOpen} label="Rental units" value={String(units)} note={occupied + " currently occupied"} tone="blue"/>
          <Kpi icon={Users} label="Tenants" value={String(tenants)} note="Tenant profiles" tone="purple"/>
          <Kpi icon={Wallet} label="Rent recorded" value={money(rentTotal)} note="Demo payment records" tone="gold"/>
          <Kpi icon={AlertTriangle} label="Arrears recorded" value={money(arrears)} note="Marked overdue" tone="red"/>
        </section>
        <section className="property-dashboard-grid">
          <article className="property-panel portfolio-panel"><div className="panel-heading"><div><h3>Portfolio snapshot</h3><p>Current records in this demo workspace</p></div><span className="panel-icon"><Building2 size={19}/></span></div>
            <div className="portfolio-metrics"><div><b>{properties}</b><span>Properties</span></div><div><b>{units}</b><span>Total units</span></div><div><b>{units ? Math.round(occupied / units * 100) : 0}%</b><span>Occupancy</span></div></div>
            <div className="progress-track"><span style={{width: (units ? Math.min(100, occupied / units * 100) : 0) + "%"}}/></div>
            <div className="panel-link-list">{modules.slice(1,5).map(m => <button key={m.name} onClick={() => navigate(m.name)}><span>{m.name}</span><ArrowUpRight size={15}/></button>)}</div>
          </article>
          <article className="property-panel"><div className="panel-heading"><div><h3>Daily operations</h3><p>Items requiring attention</p></div><ClipboardList size={20}/></div>
            <div className="attention-row"><span className="attention-icon amber"><Clock3/></span><div><b>Lease renewals</b><small>{rows.Leases.filter(x => x.status.toLowerCase() === "expiring").length} marked as expiring</small></div><button onClick={() => navigate("Leases")}>Review</button></div>
            <div className="attention-row"><span className="attention-icon red"><Wrench/></span><div><b>Maintenance requests</b><small>{rows.Maintenance.filter(x => x.status.toLowerCase() !== "completed").length} open requests</small></div><button onClick={() => navigate("Maintenance")}>Review</button></div>
            <div className="attention-row"><span className="attention-icon blue"><Wallet/></span><div><b>Rent and arrears</b><small>{rows["Rent & Payments"].filter(x => x.status.toLowerCase() === "overdue").length} overdue entries</small></div><button onClick={() => navigate("Rent & Payments")}>Review</button></div>
          </article>
          <article className="property-panel wide-panel"><div className="panel-heading"><div><h3>Recent property activity</h3><p>Latest records added in this session</p></div><button className="text-action" onClick={() => navigate("Properties")}>View properties <ArrowUpRight size={14}/></button></div>
            {allRecords.length ? <div className="activity-list">{allRecords.slice(-5).reverse().map(r => <div key={r.id}><span className="activity-check"><CheckCircle2 size={16}/></span><div><b>{r.name}</b><small>{r.detail || "Record created"} · {r.status}</small></div><span>{r.amount ? money(r.amount) : "—"}</span></div>)}</div> : <div className="property-empty"><Building2 size={26}/><b>Your portfolio starts here</b><span>Add a property, then register its units, tenants and leases.</span><button className="gold-button" onClick={() => navigate("Properties")}><Plus size={15}/>Add first property</button></div>}
          </article>
          <article className="property-panel"><div className="panel-heading"><div><h3>Setup checklist</h3><p>Recommended onboarding sequence</p></div><ShieldCheck size={20}/></div>
            {["Create your property portfolio","Add buildings and rental units","Register tenants and lease terms","Set rent cycles and deposits","Configure payments and maintenance"].map((x,i)=><div className="setup-step" key={x}><span>{i+1}</span>{x}</div>)}
          </article>
        </section>
      </> : active === "Reports" ? <section className="property-panel"><div className="panel-heading"><div><h3>Property reports centre</h3><p>Operational and financial reports from your property records</p></div><ChartNoAxesCombined/></div><div className="report-cards">{["Property register","Unit occupancy","Rent roll & arrears","Tenant ledger","Lease expiry schedule","Maintenance summary","Income & expenses","Owner statements"].map(x=><button key={x}><ClipboardList size={18}/><b>{x}</b><span>Report template · demo data only</span></button>)}</div></section> : active === "Settings" ? <section className="property-panel"><h3>Property configuration</h3><p className="panel-subtitle">Independent application configuration areas</p><div className="settings-cards">{[["Company profile","Business identity, address and branding"],["Property setup","Property types, owners and locations"],["Rental rules","Rent cycles, due dates, deposits and late fees"],["Payment methods","Bank transfer, cash and mobile money"],["Users & permissions","Roles, access rights and approvals"],["Data & backups","Dedicated database, backups and retention"]].map(([a,b])=><div key={a}><b>{a}</b><span>{b}</span><small>Configuration phase</small></div>)}</div></section> : <section className="property-panel records-panel"><div className="records-toolbar"><div><h3>{active} register</h3><p>{filtered.length} records · {current.hint}</p></div><label className="property-search"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder={"Search " + active.toLowerCase()}/></label></div>
          {filtered.length ? <div className="property-table-wrap"><table><thead><tr><th>Name / Reference</th><th>Details</th><th>Status</th><th>Amount</th><th>Actions</th></tr></thead><tbody>{filtered.map(r=><tr key={r.id}><td><b>{r.name}</b><small>REF-{String(r.id).slice(-6)}</small></td><td>{r.detail || "—"}</td><td><span className={"record-badge " + r.status.toLowerCase().replaceAll(" ","-")}>{r.status}</span></td><td>{r.amount ? money(r.amount) : "—"}</td><td><div className="record-actions"><button onClick={() => openEdit(r)} aria-label="Edit"><Pencil size={15}/></button><button onClick={() => remove(r.id)} aria-label="Delete"><Trash2 size={15}/></button></div></td></tr>)}</tbody></table></div> : <div className="property-empty"><span className="empty-icon"><CurrentIcon size={25}/></span><b>No {active.toLowerCase()} recorded yet</b><span>Start by adding your first {active.toLowerCase().replace(" & payments"," payment")} record. Demo records are temporary.</span><button className="gold-button" onClick={openAdd}><Plus size={15}/>Add first record</button></div>}
        </section>}
      <footer className="property-footer">© {new Date().getFullYear()} Sifonet Technologies · SifoProperty · Independent application</footer>
    </main>
    {showForm && <div className="property-modal-backdrop" onClick={() => setShowForm(false)}><form className="property-modal" onSubmit={e => {e.preventDefault();save();}} onClick={e => e.stopPropagation()}><div className="modal-heading"><div><p>SIFOPROPERTY · {active.toUpperCase()}</p><h3>{editing ? "Update record" : "Add new record"}</h3></div><button type="button" onClick={() => setShowForm(false)}><X/></button></div><label>Name / title<input autoFocus required value={name} onChange={e => setName(e.target.value)} placeholder="Enter name or reference"/></label><label>Details<input value={detail} onChange={e => setDetail(e.target.value)} placeholder="Address, contact, unit type or notes"/></label><label>Status<select value={status} onChange={e => setStatus(e.target.value)}><option>Active</option><option>Occupied</option><option>Vacant</option><option>Pending</option><option>Overdue</option><option>Expiring</option><option>Completed</option><option>Inactive</option></select></label><label>Amount (ZMW), if applicable<input type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00"/></label><div className="modal-actions"><button type="button" className="outline-button" onClick={() => setShowForm(false)}>Cancel</button><button className="gold-button" type="submit">{editing ? "Save changes" : "Add record"}</button></div><small className="modal-note">Demo only: no records are sent to a server.</small></form></div>}
  </div>;
}

function Kpi({ icon: Icon, label, value, note, tone }: { icon: typeof Building2; label: string; value: string; note: string; tone: string }) {
  return <article className="property-kpi"><span className={"kpi-icon " + tone}><Icon size={21}/></span><div><small>{label}</small><b>{value}</b><span>{note}</span></div></article>;
}
