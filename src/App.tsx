import { useMemo, useState } from 'react';
import { LayoutDashboard, Building2, DoorOpen, Users, FileText, Wallet, Wrench, Receipt, ChartNoAxesCombined, Settings, Search, Bell, Plus, Pencil, Trash2, X, ChevronDown, ClipboardList, ShieldCheck, KeyRound } from 'lucide-react';

type Row = { id: number; name: string; detail: string; status: string };
const modules = [
  { name: 'Dashboard', icon: LayoutDashboard }, { name: 'Properties', icon: Building2 },
  { name: 'Units', icon: DoorOpen }, { name: 'Tenants', icon: Users },
  { name: 'Leases', icon: FileText }, { name: 'Rent & Payments', icon: Wallet },
  { name: 'Maintenance', icon: Wrench }, { name: 'Expenses', icon: Receipt },
  { name: 'Reports', icon: ChartNoAxesCombined }, { name: 'Settings', icon: Settings },
];
const descriptions: Record<string,string> = {
  Properties:'Property portfolio, buildings, locations and ownership records.',
  Units:'Rental units, room types, availability and rental rates.',
  Tenants:'Tenant profiles, contacts, applications and rental history.',
  Leases:'Lease agreements, renewals, deposits and contract dates.',
  'Rent & Payments':'Rent schedules, invoices, receipts, balances and arrears.',
  Maintenance:'Maintenance requests, inspections, work orders and repairs.',
  Expenses:'Property operating costs, supplier bills and owner charges.',
  Reports:'Occupancy, rental income, arrears and property performance.',
  Settings:'Company profile, rent rules, payment settings and user permissions.',
};
const emptyRecords: Record<string, Row[]> = Object.fromEntries(modules.map(m=>[m.name,[]]));
export default function App() {
  const [active,setActive]=useState('Dashboard');
  const [records,setRecords]=useState<Record<string,Row[]>>(emptyRecords);
  const [query,setQuery]=useState('');
  const [modal,setModal]=useState(false);
  const [editing,setEditing]=useState<Row|null>(null);
  const [name,setName]=useState('');
  const [detail,setDetail]=useState('');
  const [status,setStatus]=useState('Active');
  const [notice,setNotice]=useState('Demo workspace is ready. Connect a dedicated backend before entering real tenant, lease or payment information.');
  const allRows=useMemo(()=>Object.values(records).flat(),[records]);
  const visible=(records[active]||[]).filter(r=>(r.name+' '+r.detail+' '+r.status).toLowerCase().includes(query.toLowerCase()));
  const openAdd=()=>{setEditing(null);setName('');setDetail('');setStatus('Active');setModal(true);};
  const openEdit=(r:Row)=>{setEditing(r);setName(r.name);setDetail(r.detail);setStatus(r.status);setModal(true);};
  const save=()=>{if(!name.trim())return;setRecords(prev=>({...prev,[active]:editing?(prev[active]||[]).map(r=>r.id===editing.id?{...r,name:name.trim(),detail:detail.trim(),status}:r):[...(prev[active]||[]),{id:Date.now(),name:name.trim(),detail:detail.trim(),status}]}));setModal(false);setNotice(editing?'Record updated in this demo session.':'Record added to this demo session.');};
  const remove=(id:number)=>{if(confirm('Delete this demo record?'))setRecords(prev=>({...prev,[active]:(prev[active]||[]).filter(r=>r.id!==id)}));};
  const activeModule=modules.find(m=>m.name===active)!;
  const Icon=activeModule.icon;
  return <div className="app-shell">
    <header className="topbar">
      <a className="brand" href="#"><span className="brand-mark">S</span><span>Sifo<span className="brand-gold">Property</span><small>Property management platform</small></span></a>
      <nav className="main-nav">{modules.map(m=>{const I=m.icon;return <button key={m.name} className={active===m.name?'nav-item active':'nav-item'} onClick={()=>{setActive(m.name);setQuery('');}}><I size={15}/>{m.name}</button>;})}</nav>
      <div className="top-actions"><span className="demo-label">DEMO</span><button className="icon-button" aria-label="Notifications"><Bell size={18}/></button><button className="profile">Administrator <ChevronDown size={14}/></button></div>
    </header>
    <main className="content">
      <div className="page-heading"><div><p className="eyebrow">SIFONET TECHNOLOGIES · PROPERTY OPERATIONS</p><h1>{active}</h1><p className="muted">{descriptions[active]||'A complete view of your property portfolio and rental operations.'}</p></div>{active!=='Dashboard'&&active!=='Reports'&&active!=='Settings'&&<button className="primary-button" onClick={openAdd}><Plus size={16}/> Add {active==='Properties'?'property':'record'}</button>}</div>
      <div className="notice"><ShieldCheck size={18}/><div><strong>Independent SifoProperty workspace</strong><span>{notice} Changes currently live only in this browser session.</span></div><button aria-label="Dismiss" onClick={()=>setNotice('Demo workspace. No live backend is connected.')}><X size={16}/></button></div>
      {active==='Dashboard'?<><section className="stats-grid">{[['Properties',records.Properties.length,'Portfolio'],['Rental units',records.Units.length,'Units recorded'],['Tenant records',records.Tenants.length,'Tenants'],['Tracked records',allRows.length,'Across all modules']].map(([label,value,sub])=><article className="stat-card" key={String(label)}><span>{label}</span><strong>{value}</strong><small>{sub}</small></article>)}</section><section className="panel-grid"><article className="panel"><div className="panel-title"><h2>Property workspace</h2><span className="status-pill">Demo mode</span></div><p className="muted">Manage buildings, units, tenants, leases, rent collections, expenses and maintenance.</p><div className="quick-links">{modules.slice(1,8).map(m=>{const I=m.icon;return <button key={m.name} onClick={()=>setActive(m.name)}><I size={18}/>{m.name}<span>→</span></button>;})}</div></article><article className="panel"><h2>Recommended setup sequence</h2><ol className="steps"><li>Set up company and property portfolio</li><li>Add buildings, units and rental rates</li><li>Register tenants and capture lease terms</li><li>Set rent cycles, deposits and payment rules</li><li>Configure maintenance and expense tracking</li></ol></article></section></>:active==='Reports'?<section className="panel"><h2>Property reports centre</h2><p className="muted">Report templates are prepared for the connected data phase.</p><div className="report-grid">{['Property register','Unit occupancy','Rent roll & arrears','Tenant ledger','Maintenance summary','Income & expenses'].map(x=><div className="report-tile" key={x}><ClipboardList size={19}/><strong>{x}</strong><span>Available after data setup</span></div>)}</div></section>:active==='Settings'?<section className="panel"><h2>Property configuration</h2><div className="settings-grid">{[['Company profile','Business details, address and logo'],['Property setup','Property types, owners and locations'],['Rental rules','Rent cycles, due dates and late fees'],['Payment methods','Cash, bank transfer and mobile money'],['User access','Roles, permissions and approvals'],['Data & backups','Supabase connection and backup policy']].map(([a,b])=><div className="setting-row" key={a}><strong>{a}</strong><span>{b}</span><em>Configure in next setup phase</em></div>)}</div></section>:<section className="panel"><div className="table-toolbar"><div><h2>{active} register</h2><p className="muted">{visible.length} records shown · {descriptions[active]}</p></div><label className="search-box"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search records..."/></label></div>{visible.length===0?<div className="empty-state"><div className="empty-icon"><Icon size={24}/></div><strong>No {active.toLowerCase()} yet</strong><span>Add your first record to start testing this module. Data is temporary in demo mode.</span><button className="primary-button" onClick={openAdd}><Plus size={15}/> Add first record</button></div>:<div className="table-wrap"><table><thead><tr><th>Name / Reference</th><th>Details</th><th>Status</th><th>Actions</th></tr></thead><tbody>{visible.map(r=><tr key={r.id}><td><strong>{r.name}</strong><small>REF-{String(r.id).slice(-6)}</small></td><td>{r.detail||'—'}</td><td><span className="record-status">{r.status}</span></td><td><div className="row-actions"><button onClick={()=>openEdit(r)} aria-label="Edit"><Pencil size={15}/></button><button onClick={()=>remove(r.id)} aria-label="Delete"><Trash2 size={15}/></button></div></td></tr>)}</tbody></table></div>}</section>}
      <footer>© {new Date().getFullYear()} Sifonet Technologies · SifoProperty · Independent application</footer>
    </main>
    {modal&&<div className="modal-backdrop" onClick={()=>setModal(false)}><div className="modal" onClick={e=>e.stopPropagation()}><div className="modal-head"><div><p className="eyebrow">SIFOPROPERTY · {active.toUpperCase()}</p><h2>{editing?'Edit record':'Add new record'}</h2></div><button className="close-button" onClick={()=>setModal(false)}><X size={19}/></button></div><label>Name / title<input autoFocus value={name} onChange={e=>setName(e.target.value)} placeholder="Enter name or title"/></label><label>Details / reference<input value={detail} onChange={e=>setDetail(e.target.value)} placeholder="Optional details"/></label><label>Status<select value={status} onChange={e=>setStatus(e.target.value)}><option>Active</option><option>Pending</option><option>Inactive</option></select></label><div className="modal-actions"><button className="secondary-button" onClick={()=>setModal(false)}>Cancel</button><button className="primary-button" onClick={save} disabled={!name.trim()}>{editing?'Save changes':'Save record'}</button></div></div></div>}
  </div>;
}
