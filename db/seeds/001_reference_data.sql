INSERT INTO ed_locations (code, label, is_waiting_area, sort_order)
VALUES
  ('main_ed', 'Main ED', false, 10),
  ('fast_track', 'Fast Track', false, 20),
  ('waiting_room', 'Waiting Room', true, 30),
  ('triage', 'Triage', true, 40),
  ('trauma_bay', 'Trauma Bay', false, 50)
ON CONFLICT (code) DO UPDATE
SET label = EXCLUDED.label,
    is_waiting_area = EXCLUDED.is_waiting_area,
    sort_order = EXCLUDED.sort_order,
    active = true,
    updated_at = now();

INSERT INTO ed_arrival_methods (code, label, sort_order)
VALUES
  ('walk_in', 'Walk-in', 10),
  ('ems', 'EMS', 20),
  ('transfer', 'Transfer', 30),
  ('private_vehicle', 'Private Vehicle', 40)
ON CONFLICT (code) DO UPDATE
SET label = EXCLUDED.label,
    sort_order = EXCLUDED.sort_order,
    active = true,
    updated_at = now();

INSERT INTO ed_chief_complaints (code, label, sort_order)
VALUES
  ('chest_cardiac', 'Chest / Cardiac', 10),
  ('neuro_ams', 'Neuro / AMS', 20),
  ('abdominal', 'Abdominal', 30),
  ('respiratory', 'Respiratory', 40),
  ('trauma_lac', 'Trauma / Lac', 50),
  ('msk_ortho', 'MSK / Ortho', 60),
  ('htn_ha', 'HTN / HA', 70),
  ('fever_infx', 'Fever / Infx', 80),
  ('seizure', 'Seizure', 90),
  ('other', 'Other', 100)
ON CONFLICT (code) DO UPDATE
SET label = EXCLUDED.label,
    sort_order = EXCLUDED.sort_order,
    active = true,
    updated_at = now();

INSERT INTO ed_owner_roles (code, label, sort_order)
VALUES
  ('MD', 'MD', 10),
  ('PA', 'PA', 20),
  ('RN', 'RN', 30),
  ('CHG', 'CHG', 40)
ON CONFLICT (code) DO UPDATE
SET label = EXCLUDED.label,
    sort_order = EXCLUDED.sort_order,
    active = true,
    updated_at = now();

INSERT INTO ed_lab_options (code, label, sort_order)
VALUES
  ('bmp_cbc', 'BMP + CBC', 10),
  ('cmp_cbc_troponin', 'CMP + CBC + Troponin', 20),
  ('lactate_bc_x2', 'Lactate + BC x2', 30),
  ('ua_upt', 'UA + UPT', 40),
  ('d_dimer_bnp', 'D-Dimer + BNP', 50),
  ('full_sepsis_panel', 'Full sepsis panel', 60),
  ('lfts_lipase', 'LFTs + Lipase', 70),
  ('coags_cbc', 'Coags + CBC', 80),
  ('pending', 'Pending', 90)
ON CONFLICT (code) DO UPDATE
SET label = EXCLUDED.label,
    sort_order = EXCLUDED.sort_order,
    active = true,
    updated_at = now();

INSERT INTO ed_imaging_options (code, label, sort_order)
VALUES
  ('cxr', 'CXR', 10),
  ('ct_head', 'CT Head', 20),
  ('ct_ap', 'CT A/P', 30),
  ('ct_pe_protocol', 'CT PE Protocol', 40),
  ('ct_spine', 'CT Spine', 50),
  ('ruq_us', 'RUQ US', 60),
  ('pelvic_us', 'Pelvic US', 70),
  ('xr_extremity', 'XR Extremity', 80),
  ('echo', 'Echo', 90),
  ('pending', 'Pending', 100)
ON CONFLICT (code) DO UPDATE
SET label = EXCLUDED.label,
    sort_order = EXCLUDED.sort_order,
    active = true,
    updated_at = now();

INSERT INTO ed_risk_flags (code, label, tone, watch_key, sort_order)
VALUES
  ('acs_pe', 'ACS/PE', 'critical', null, 10),
  ('stroke', 'STROKE!', 'critical', 'stroke', 20),
  ('sepsis', 'SEPSIS', 'critical', 'sepsis', 30),
  ('trauma', 'TRAUMA', 'critical', null, 40),
  ('ectopic', 'ECTOPIC?', 'high', null, 50),
  ('ams_risk', 'AMS RISK', 'high', null, 60),
  ('sepsis_risk', 'SEPSIS RISK', 'high', 'sepsis', 70),
  ('g1p0', 'G1P0', 'warning', null, 80),
  ('anticoag', 'ANTICOAG', 'warning', null, 90),
  ('anticoag_possible', 'ANTICOAG?', 'info', null, 100),
  ('fast_dispo', 'FAST DISPO', 'throughput', 'fast_dispo', 110),
  ('dispo_ready', 'DISPO READY', 'success', 'dispo_ready', 120)
ON CONFLICT (code) DO UPDATE
SET label = EXCLUDED.label,
    tone = EXCLUDED.tone,
    watch_key = EXCLUDED.watch_key,
    sort_order = EXCLUDED.sort_order,
    active = true,
    updated_at = now();
