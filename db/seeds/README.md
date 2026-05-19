Run all seeds with:

```bash
npm run db:seed
```

The seed files run in filename order:

- `001_reference_data.sql` seeds lookup tables needed by the UI.
- `002_demo_patients.sql` restores the seven legacy hardcoded board patients.

Lookup tables:

- `ed_locations`
- `ed_arrival_methods`
- `ed_chief_complaints`
- `ed_owner_roles`
- `ed_lab_options`
- `ed_imaging_options`
- `ed_risk_flags`

Patient rows are inserted with stable UUIDs so rerunning the seed updates the demo rows instead of duplicating them.

The app reads these values dynamically through `/api/ed-command-center`.
