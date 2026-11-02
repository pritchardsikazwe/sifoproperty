# SifoProperty

Independent property and rental management platform by Sifonet Technologies.

## Product modules
- Dashboard and property portfolio
- Buildings, units, availability and rental rates
- Owners, tenants and applications
- Leases, renewals, deposits and contract dates
- Rent schedules, invoices, receipts and arrears
- Maintenance requests, inspections and work orders
- Property expenses and owner statements
- Occupancy, income and arrears reports
- Roles, permissions and audit history

## Run locally
Requires Node.js 20 or newer.

```bash
npm install
npm run dev
npm run build
```

## Current implementation status
The repository contains an interactive React + TypeScript + Vite frontend foundation. Module navigation, searchable registers and add/edit/delete demo workflows are implemented. Demo changes are held in browser memory and are lost on refresh. No authentication, database, live tenant or financial records, payment integrations or production integrations are connected yet.

## Planned production stages
1. Product requirements and Zambia rental/property workflows
2. Dedicated Supabase project, schema, migrations and row-level security
3. Authentication, company tenancy, roles and audit trail
4. Persistent property, unit, tenant, lease and payment workflows
5. Maintenance, owner statements, reports, notifications and backups
6. Automated tests, security review and deployment

SifoProperty is independent from SifoBooks and SifoHotel. Never put production secrets in this repository.
