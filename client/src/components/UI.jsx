import React from "react";
import { Loader2, Search, Plus, MoreHorizontal, ArrowUpRight, AlertTriangle } from "lucide-react";

export function PageHeader({ eyebrow, title, description, action, actionText = "Add New" }) {
  return (
    <div className="page-header">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action && <button className="btn btn-primary" onClick={action}><Plus size={16} />{actionText}</button>}
    </div>
  );
}

export function StatCard({ title, value, note, icon: Icon, tone = "blue" }) {
  return (
    <div className={`stat-card ${tone}`}>
      <div className="stat-icon"><Icon size={20} /></div>
      <div className="stat-copy"><span>{title}</span><strong>{value}</strong><small><ArrowUpRight size={12} /> {note}</small></div>
    </div>
  );
}

export function Card({ title, subtitle, action, children, className = "" }) {
  return (
    <section className={`card ${className}`}>
      {(title || subtitle || action) && <div className="card-head"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{action || <MoreHorizontal size={18} className="muted-icon" />}</div>}
      <div className="card-body">{children}</div>
    </section>
  );
}

export function SearchBox({ value, onChange, placeholder = "Search..." }) {
  return <div className="search-box"><Search size={17} /><input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} /></div>;
}

export function LoadingState({ text = "Loading..." }) {
  return <div className="state-box"><Loader2 className="spin" size={25} /><span>{text}</span></div>;
}

export function ErrorState({ message, retry }) {
  return <div className="state-box error-state"><AlertTriangle size={25} /><strong>Unable to load</strong><span>{message}</span>{retry && <button className="btn btn-primary" onClick={retry}>Try Again</button>}</div>;
}

export function EmptyState({ text = "No data available" }) {
  return <div className="empty-state">{text}</div>;
}

export function StatusPill({ children, tone = "blue" }) {
  return <span className={`status-pill ${tone}`}>{children}</span>;
}

export function Progress({ value, tone = "blue" }) {
  return <div className="progress"><span className={tone} style={{ width: `${Math.max(0, Math.min(100, Number(value) || 0))}%` }} /></div>;
}

export function Toolbar({ search, setSearch, placeholder, children }) {
  return <div className="toolbar"><SearchBox value={search} onChange={setSearch} placeholder={placeholder} /><div className="toolbar-actions">{children}</div></div>;
}
