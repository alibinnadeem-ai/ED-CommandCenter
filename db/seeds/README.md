Run the reference seed with:

```bash
npm run db:seed
```

Seed these lookup tables before adding patients:

- `ed_locations`
- `ed_arrival_methods`
- `ed_chief_complaints`
- `ed_owner_roles`
- `ed_lab_options`
- `ed_imaging_options`
- `ed_risk_flags`

The app reads these values dynamically through `/api/ed-command-center`.
