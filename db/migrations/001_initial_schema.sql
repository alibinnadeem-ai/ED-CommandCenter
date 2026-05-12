CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS ed_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE,
  label text NOT NULL,
  is_waiting_area boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ed_arrival_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE,
  label text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ed_chief_complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE,
  label text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ed_owner_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE,
  label text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ed_lab_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE,
  label text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ed_imaging_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE,
  label text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ed_risk_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE,
  label text NOT NULL,
  tone text NOT NULL DEFAULT 'warning',
  watch_key text,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ed_patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  initials text NOT NULL,
  bed_number text NOT NULL,
  age integer CHECK (age IS NULL OR (age >= 0 AND age <= 130)),
  sex text CHECK (sex IS NULL OR sex IN ('M', 'F', 'X')),
  esi_level smallint NOT NULL CHECK (esi_level BETWEEN 1 AND 5),
  location_id uuid REFERENCES ed_locations(id) ON DELETE SET NULL,
  arrival_method_id uuid REFERENCES ed_arrival_methods(id) ON DELETE SET NULL,
  chief_complaint_id uuid REFERENCES ed_chief_complaints(id) ON DELETE SET NULL,
  chief_complaint_detail text,
  owner_role_id uuid REFERENCES ed_owner_roles(id) ON DELETE SET NULL,
  next_milestone text,
  lab_option_id uuid REFERENCES ed_lab_options(id) ON DELETE SET NULL,
  imaging_option_id uuid REFERENCES ed_imaging_options(id) ON DELETE SET NULL,
  notes text,
  arrived_at timestamptz NOT NULL DEFAULT now(),
  discharged_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ed_patient_risk_flags (
  patient_id uuid NOT NULL REFERENCES ed_patients(id) ON DELETE CASCADE,
  risk_flag_id uuid NOT NULL REFERENCES ed_risk_flags(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (patient_id, risk_flag_id)
);

CREATE TABLE IF NOT EXISTS ed_audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid,
  action text NOT NULL,
  changes jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ed_patients_active_idx
  ON ed_patients (discharged_at, esi_level, arrived_at);

CREATE INDEX IF NOT EXISTS ed_patients_location_idx
  ON ed_patients (location_id);

CREATE INDEX IF NOT EXISTS ed_patient_risk_flags_flag_idx
  ON ed_patient_risk_flags (risk_flag_id);

CREATE INDEX IF NOT EXISTS ed_audit_events_entity_idx
  ON ed_audit_events (entity_type, entity_id, created_at DESC);
