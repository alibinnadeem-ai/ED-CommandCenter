WITH seed_patients (
  id,
  initials,
  bed_number,
  age,
  sex,
  esi_level,
  location_code,
  arrival_method_code,
  chief_complaint_code,
  chief_complaint_detail,
  owner_role_code,
  next_milestone,
  lab_option_code,
  imaging_option_code,
  notes,
  arrived_minutes_ago
) AS (
  VALUES
    (
      '10000000-0000-4000-8000-000000000001'::uuid,
      'J.S.',
      '12',
      77,
      'F',
      2,
      'main_ed',
      'ems',
      'chest_cardiac',
      'Chest pain radiating to jaw, diaphoretic',
      'MD',
      'Delta trop #2 + EKG repeat ~ 19:55',
      'cmp_cbc_troponin',
      'ct_pe_protocol',
      'High risk ACS. INR 3.1. CT pending read.',
      138
    ),
    (
      '10000000-0000-4000-8000-000000000002'::uuid,
      'R.T.',
      '4',
      77,
      'F',
      2,
      'main_ed',
      'ems',
      'neuro_ams',
      'AMS, stroke symptoms, L-sided weakness',
      'MD',
      'CT head read + Lactate #2 OVERDUE',
      'full_sepsis_panel',
      'ct_head',
      'Lactate 4.2 CRITICAL. Neuro no callback 30m+.',
      142
    ),
    (
      '10000000-0000-4000-8000-000000000003'::uuid,
      'M.K.',
      '7',
      28,
      'F',
      3,
      'main_ed',
      'walk_in',
      'abdominal',
      'RLQ pain, positive UPT, no US yet',
      'PA',
      'RUQ US result + UA',
      'ua_upt',
      'ruq_us',
      'Ectopic rule-out. UPT positive. US pending - priority.',
      42
    ),
    (
      '10000000-0000-4000-8000-000000000004'::uuid,
      'A.B.',
      '15',
      34,
      'M',
      4,
      'fast_track',
      'walk_in',
      'trauma_lac',
      '2cm lac R forearm, repair needed',
      'RN',
      'Repair + tetanus + AVS ~ 20:30',
      NULL,
      NULL,
      'Simple repair. Verify anticoag before discharge.',
      28
    ),
    (
      '10000000-0000-4000-8000-000000000005'::uuid,
      'D.W.',
      '9',
      52,
      'M',
      3,
      'main_ed',
      'private_vehicle',
      'respiratory',
      'Fever 38.9, SOB, productive cough',
      'MD',
      'Lactate + BC x2 results',
      'lactate_bc_x2',
      'cxr',
      'Possible pneumonia with SIRS criteria.',
      65
    ),
    (
      '10000000-0000-4000-8000-000000000006'::uuid,
      'L.P.',
      '3',
      41,
      'F',
      3,
      'main_ed',
      'walk_in',
      'htn_ha',
      'BP 210/120, headache, no focal neuro deficits',
      'MD',
      'BP recheck post-medication',
      'bmp_cbc',
      NULL,
      'BP controlled post-labetalol. Near dispo.',
      55
    ),
    (
      '10000000-0000-4000-8000-000000000007'::uuid,
      'K.M.',
      '11',
      29,
      'M',
      4,
      'fast_track',
      'walk_in',
      'msk_ortho',
      'Ankle sprain, R/O fracture',
      'PA',
      'XR result read',
      NULL,
      'xr_extremity',
      'Ottawa negative. XR ordered. Fast track.',
      22
    )
)
INSERT INTO ed_patients (
  id,
  initials,
  bed_number,
  age,
  sex,
  esi_level,
  location_id,
  arrival_method_id,
  chief_complaint_id,
  chief_complaint_detail,
  owner_role_id,
  next_milestone,
  lab_option_id,
  imaging_option_id,
  notes,
  arrived_at,
  discharged_at
)
SELECT
  seed.id,
  seed.initials,
  seed.bed_number,
  seed.age,
  seed.sex,
  seed.esi_level,
  loc.id,
  arr.id,
  cc.id,
  seed.chief_complaint_detail,
  owner_role.id,
  seed.next_milestone,
  lab.id,
  imaging.id,
  seed.notes,
  now() - seed.arrived_minutes_ago * interval '1 minute',
  NULL
FROM seed_patients seed
INNER JOIN ed_locations loc ON loc.code = seed.location_code
INNER JOIN ed_arrival_methods arr ON arr.code = seed.arrival_method_code
INNER JOIN ed_chief_complaints cc ON cc.code = seed.chief_complaint_code
INNER JOIN ed_owner_roles owner_role ON owner_role.code = seed.owner_role_code
LEFT JOIN ed_lab_options lab ON lab.code = seed.lab_option_code
LEFT JOIN ed_imaging_options imaging ON imaging.code = seed.imaging_option_code
ON CONFLICT (id) DO UPDATE
SET initials = EXCLUDED.initials,
    bed_number = EXCLUDED.bed_number,
    age = EXCLUDED.age,
    sex = EXCLUDED.sex,
    esi_level = EXCLUDED.esi_level,
    location_id = EXCLUDED.location_id,
    arrival_method_id = EXCLUDED.arrival_method_id,
    chief_complaint_id = EXCLUDED.chief_complaint_id,
    chief_complaint_detail = EXCLUDED.chief_complaint_detail,
    owner_role_id = EXCLUDED.owner_role_id,
    next_milestone = EXCLUDED.next_milestone,
    lab_option_id = EXCLUDED.lab_option_id,
    imaging_option_id = EXCLUDED.imaging_option_id,
    notes = EXCLUDED.notes,
    arrived_at = EXCLUDED.arrived_at,
    discharged_at = NULL,
    updated_at = now();

WITH seed_patient_ids (patient_id) AS (
  VALUES
    ('10000000-0000-4000-8000-000000000001'::uuid),
    ('10000000-0000-4000-8000-000000000002'::uuid),
    ('10000000-0000-4000-8000-000000000003'::uuid),
    ('10000000-0000-4000-8000-000000000004'::uuid),
    ('10000000-0000-4000-8000-000000000005'::uuid),
    ('10000000-0000-4000-8000-000000000006'::uuid),
    ('10000000-0000-4000-8000-000000000007'::uuid)
)
DELETE FROM ed_patient_risk_flags patient_flags
USING seed_patient_ids seed
WHERE patient_flags.patient_id = seed.patient_id;

WITH seed_patient_flags (patient_id, risk_flag_code) AS (
  VALUES
    ('10000000-0000-4000-8000-000000000001'::uuid, 'acs_pe'),
    ('10000000-0000-4000-8000-000000000001'::uuid, 'anticoag'),
    ('10000000-0000-4000-8000-000000000001'::uuid, 'ams_risk'),
    ('10000000-0000-4000-8000-000000000002'::uuid, 'stroke'),
    ('10000000-0000-4000-8000-000000000002'::uuid, 'sepsis'),
    ('10000000-0000-4000-8000-000000000002'::uuid, 'anticoag'),
    ('10000000-0000-4000-8000-000000000003'::uuid, 'ectopic'),
    ('10000000-0000-4000-8000-000000000003'::uuid, 'g1p0'),
    ('10000000-0000-4000-8000-000000000004'::uuid, 'anticoag_possible'),
    ('10000000-0000-4000-8000-000000000004'::uuid, 'fast_dispo'),
    ('10000000-0000-4000-8000-000000000005'::uuid, 'sepsis_risk'),
    ('10000000-0000-4000-8000-000000000006'::uuid, 'fast_dispo'),
    ('10000000-0000-4000-8000-000000000006'::uuid, 'dispo_ready'),
    ('10000000-0000-4000-8000-000000000007'::uuid, 'fast_dispo')
)
INSERT INTO ed_patient_risk_flags (patient_id, risk_flag_id)
SELECT seed.patient_id, risk_flag.id
FROM seed_patient_flags seed
INNER JOIN ed_risk_flags risk_flag ON risk_flag.code = seed.risk_flag_code
ON CONFLICT (patient_id, risk_flag_id) DO NOTHING;
