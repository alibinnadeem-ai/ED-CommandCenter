# ED Command Center

Next.js command-center shell backed by Neon/Postgres route handlers. The UI reads patients and lookup lists from the database instead of browser-only static data.

## Getting Started

1. Add your Neon connection string:

```bash
cp .env.example .env.local
```

Then set `DATABASE_URL` in `.env.local`.

2. Create the database schema:

```bash
npm run db:migrate
```

3. Seed lookup and demo data in Neon:

```bash
npm run db:seed
```

This seeds reference lookup data plus the seven legacy demo patients that used to be hardcoded in the browser-only board.

Seeded tables:

- `ed_locations`
- `ed_arrival_methods`
- `ed_chief_complaints`
- `ed_owner_roles`
- `ed_lab_options`
- `ed_imaging_options`
- `ed_risk_flags`
- `ed_patients`
- `ed_patient_risk_flags`

Risk flags can use `tone` values such as `critical`, `high`, `warning`, `info`, `throughput`, or `success`. Use `watch_key` values such as `sepsis`, `stroke`, `fast_dispo`, and `dispo_ready` when a flag should drive dashboard counters.

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
