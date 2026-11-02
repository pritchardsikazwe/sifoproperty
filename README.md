# SifoProperty

Independent property and rental management platform by Sifonet Technologies.

## Product boundary
SifoProperty is a standalone application and repository. It is separate from SifoBooks and SifoHotel, with its own deployment and, when configured, its own Supabase project.

## Initial scope
- Property portfolio and building records
- Units, rooms and availability
- Landlords, owners and tenants
- Applications, leases and renewals
- Rent schedules, invoices, receipts and arrears
- Deposits and other tenant charges
- Maintenance requests and work orders
- Property expenses and owner statements
- Occupancy, income and arrears reports
- User roles, permissions and audit history

## Development
This repository starts with a React + TypeScript + Vite frontend shell. Backend credentials and Supabase integration are intentionally not configured yet.

```bash
npm install
npm run dev
```
