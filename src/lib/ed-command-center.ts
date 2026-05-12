import { getSql } from "./db";

export type LookupOption = {
  id: string;
  label: string;
  code: string | null;
  sortOrder: number;
};

export type LocationOption = LookupOption & {
  isWaitingArea: boolean;
};

export type RiskFlagOption = LookupOption & {
  tone: string;
  watchKey: string | null;
};

export type CommandCenterConfig = {
  arrivalMethods: LookupOption[];
  chiefComplaints: LookupOption[];
  imagingOptions: LookupOption[];
  labOptions: LookupOption[];
  locations: LocationOption[];
  ownerRoles: LookupOption[];
  riskFlags: RiskFlagOption[];
};

export type PatientPayload = {
  initials?: unknown;
  bedNumber?: unknown;
  age?: unknown;
  sex?: unknown;
  esiLevel?: unknown;
  locationId?: unknown;
  arrivalMethodId?: unknown;
  chiefComplaintId?: unknown;
  chiefComplaintDetail?: unknown;
  ownerRoleId?: unknown;
  nextMilestone?: unknown;
  labOptionId?: unknown;
  imagingOptionId?: unknown;
  riskFlagIds?: unknown;
  notes?: unknown;
};

type LookupRow = {
  id: string;
  label: string;
  code: string | null;
  sort_order: number;
};

type LocationRow = LookupRow & {
  is_waiting_area: boolean;
};

type RiskFlagRow = LookupRow & {
  tone: string;
  watch_key: string | null;
};

type PatientRow = {
  id: string;
  initials: string;
  bed_number: string;
  age: number | null;
  sex: string | null;
  esi_level: number;
  location_id: string | null;
  arrival_method_id: string | null;
  chief_complaint_id: string | null;
  chief_complaint_detail: string | null;
  owner_role_id: string | null;
  next_milestone: string | null;
  lab_option_id: string | null;
  imaging_option_id: string | null;
  notes: string | null;
  arrived_at: string;
  created_at: string;
  updated_at: string;
  location_label: string | null;
  location_code: string | null;
  location_sort_order: number | null;
  location_is_waiting_area: boolean | null;
  arrival_method_label: string | null;
  arrival_method_code: string | null;
  arrival_method_sort_order: number | null;
  chief_complaint_label: string | null;
  chief_complaint_code: string | null;
  chief_complaint_sort_order: number | null;
  owner_role_label: string | null;
  owner_role_code: string | null;
  owner_role_sort_order: number | null;
  lab_option_label: string | null;
  lab_option_code: string | null;
  lab_option_sort_order: number | null;
  imaging_option_label: string | null;
  imaging_option_code: string | null;
  imaging_option_sort_order: number | null;
};

type PatientRiskFlagRow = RiskFlagRow & {
  patient_id: string;
};

type NormalizedPatient = {
  initials: string;
  bedNumber: string;
  age: number | null;
  sex: string | null;
  esiLevel: number;
  locationId: string | null;
  arrivalMethodId: string | null;
  chiefComplaintId: string | null;
  chiefComplaintDetail: string | null;
  ownerRoleId: string | null;
  nextMilestone: string | null;
  labOptionId: string | null;
  imagingOptionId: string | null;
  riskFlagIds: string[];
  notes: string | null;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function getCommandCenterData() {
  const [config, patients] = await Promise.all([getCommandCenterConfig(), getActivePatients()]);

  return {
    config,
    patients,
  };
}

export async function getCommandCenterConfig(): Promise<CommandCenterConfig> {
  const sql = getSql();
  const [
    arrivalMethods,
    chiefComplaints,
    imagingOptions,
    labOptions,
    locations,
    ownerRoles,
    riskFlags,
  ] = await Promise.all([
    sql.query("SELECT id, label, code, sort_order FROM ed_arrival_methods WHERE active = true ORDER BY sort_order, label", []),
    sql.query("SELECT id, label, code, sort_order FROM ed_chief_complaints WHERE active = true ORDER BY sort_order, label", []),
    sql.query("SELECT id, label, code, sort_order FROM ed_imaging_options WHERE active = true ORDER BY sort_order, label", []),
    sql.query("SELECT id, label, code, sort_order FROM ed_lab_options WHERE active = true ORDER BY sort_order, label", []),
    sql.query("SELECT id, label, code, is_waiting_area, sort_order FROM ed_locations WHERE active = true ORDER BY sort_order, label", []),
    sql.query("SELECT id, label, code, sort_order FROM ed_owner_roles WHERE active = true ORDER BY sort_order, label", []),
    sql.query("SELECT id, label, code, tone, watch_key, sort_order FROM ed_risk_flags WHERE active = true ORDER BY sort_order, label", []),
  ]);

  return {
    arrivalMethods: (arrivalMethods as LookupRow[]).map(toLookupOption),
    chiefComplaints: (chiefComplaints as LookupRow[]).map(toLookupOption),
    imagingOptions: (imagingOptions as LookupRow[]).map(toLookupOption),
    labOptions: (labOptions as LookupRow[]).map(toLookupOption),
    locations: (locations as LocationRow[]).map(toLocationOption),
    ownerRoles: (ownerRoles as LookupRow[]).map(toLookupOption),
    riskFlags: (riskFlags as RiskFlagRow[]).map(toRiskFlagOption),
  };
}

export async function getActivePatients() {
  const sql = getSql();
  const rows = (await sql.query(
    `
      SELECT
        p.id,
        p.initials,
        p.bed_number,
        p.age,
        p.sex,
        p.esi_level,
        p.location_id,
        p.arrival_method_id,
        p.chief_complaint_id,
        p.chief_complaint_detail,
        p.owner_role_id,
        p.next_milestone,
        p.lab_option_id,
        p.imaging_option_id,
        p.notes,
        p.arrived_at,
        p.created_at,
        p.updated_at,
        loc.label AS location_label,
        loc.code AS location_code,
        loc.sort_order AS location_sort_order,
        loc.is_waiting_area AS location_is_waiting_area,
        arr.label AS arrival_method_label,
        arr.code AS arrival_method_code,
        arr.sort_order AS arrival_method_sort_order,
        cc.label AS chief_complaint_label,
        cc.code AS chief_complaint_code,
        cc.sort_order AS chief_complaint_sort_order,
        own.label AS owner_role_label,
        own.code AS owner_role_code,
        own.sort_order AS owner_role_sort_order,
        lab.label AS lab_option_label,
        lab.code AS lab_option_code,
        lab.sort_order AS lab_option_sort_order,
        img.label AS imaging_option_label,
        img.code AS imaging_option_code,
        img.sort_order AS imaging_option_sort_order
      FROM ed_patients p
      LEFT JOIN ed_locations loc ON loc.id = p.location_id
      LEFT JOIN ed_arrival_methods arr ON arr.id = p.arrival_method_id
      LEFT JOIN ed_chief_complaints cc ON cc.id = p.chief_complaint_id
      LEFT JOIN ed_owner_roles own ON own.id = p.owner_role_id
      LEFT JOIN ed_lab_options lab ON lab.id = p.lab_option_id
      LEFT JOIN ed_imaging_options img ON img.id = p.imaging_option_id
      WHERE p.discharged_at IS NULL
      ORDER BY p.esi_level ASC, p.arrived_at ASC
    `,
    [],
  )) as PatientRow[];

  if (!rows.length) {
    return [];
  }

  const patientIds = rows.map((row) => row.id);
  const flagRows = (await sql.query(
    `
      SELECT
        prf.patient_id,
        rf.id,
        rf.label,
        rf.code,
        rf.tone,
        rf.watch_key,
        rf.sort_order
      FROM ed_patient_risk_flags prf
      INNER JOIN ed_risk_flags rf ON rf.id = prf.risk_flag_id
      WHERE prf.patient_id = ANY($1::uuid[])
      ORDER BY rf.sort_order, rf.label
    `,
    [patientIds],
  )) as PatientRiskFlagRow[];

  const flagsByPatient = new Map<string, RiskFlagOption[]>();
  for (const row of flagRows) {
    const flags = flagsByPatient.get(row.patient_id) ?? [];
    flags.push(toRiskFlagOption(row));
    flagsByPatient.set(row.patient_id, flags);
  }

  return rows.map((row) => ({
    id: row.id,
    initials: row.initials,
    bedNumber: row.bed_number,
    age: row.age,
    sex: row.sex,
    esiLevel: row.esi_level,
    locationId: row.location_id,
    location: toNullableLocationOption(row, "location"),
    arrivalMethodId: row.arrival_method_id,
    arrivalMethod: toNullableLookupOption(row, "arrival_method"),
    chiefComplaintId: row.chief_complaint_id,
    chiefComplaint: toNullableLookupOption(row, "chief_complaint"),
    chiefComplaintDetail: row.chief_complaint_detail,
    ownerRoleId: row.owner_role_id,
    ownerRole: toNullableLookupOption(row, "owner_role"),
    nextMilestone: row.next_milestone,
    labOptionId: row.lab_option_id,
    labOption: toNullableLookupOption(row, "lab_option"),
    imagingOptionId: row.imaging_option_id,
    imagingOption: toNullableLookupOption(row, "imaging_option"),
    riskFlags: flagsByPatient.get(row.id) ?? [],
    notes: row.notes,
    arrivedAt: row.arrived_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function createPatient(payload: PatientPayload) {
  const patient = normalizePatient(payload);
  const sql = getSql();
  const rows = (await sql.query(
    `
      WITH new_patient AS (
        INSERT INTO ed_patients (
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
          notes
        )
        VALUES ($1, $2, $3, $4, $5, $6::uuid, $7::uuid, $8::uuid, $9, $10::uuid, $11, $12::uuid, $13::uuid, $14)
        RETURNING id
      ),
      inserted_flags AS (
        INSERT INTO ed_patient_risk_flags (patient_id, risk_flag_id)
        SELECT new_patient.id, flags.risk_flag_id
        FROM new_patient
        CROSS JOIN unnest($15::uuid[]) AS flags(risk_flag_id)
      )
      SELECT id FROM new_patient
    `,
    [
      patient.initials,
      patient.bedNumber,
      patient.age,
      patient.sex,
      patient.esiLevel,
      patient.locationId,
      patient.arrivalMethodId,
      patient.chiefComplaintId,
      patient.chiefComplaintDetail,
      patient.ownerRoleId,
      patient.nextMilestone,
      patient.labOptionId,
      patient.imagingOptionId,
      patient.notes,
      patient.riskFlagIds,
    ],
  )) as { id: string }[];

  const id = rows[0]?.id;

  if (!id) {
    throw new Error("Patient could not be created.");
  }

  await recordAuditEvent("patient", id, "create", patient);

  return getPatientById(id);
}

export async function updatePatient(id: string, payload: PatientPayload) {
  assertUuid(id, "Patient id");

  const patient = normalizePatient(payload);
  const sql = getSql();
  const rows = (await sql.query(
    `
      WITH updated_patient AS (
        UPDATE ed_patients
        SET
          initials = $2,
          bed_number = $3,
          age = $4,
          sex = $5,
          esi_level = $6,
          location_id = $7::uuid,
          arrival_method_id = $8::uuid,
          chief_complaint_id = $9::uuid,
          chief_complaint_detail = $10,
          owner_role_id = $11::uuid,
          next_milestone = $12,
          lab_option_id = $13::uuid,
          imaging_option_id = $14::uuid,
          notes = $15,
          updated_at = now()
        WHERE id = $1::uuid
          AND discharged_at IS NULL
        RETURNING id
      ),
      cleared_flags AS (
        DELETE FROM ed_patient_risk_flags
        WHERE patient_id IN (SELECT id FROM updated_patient)
      ),
      inserted_flags AS (
        INSERT INTO ed_patient_risk_flags (patient_id, risk_flag_id)
        SELECT updated_patient.id, flags.risk_flag_id
        FROM updated_patient
        CROSS JOIN unnest($16::uuid[]) AS flags(risk_flag_id)
      )
      SELECT id FROM updated_patient
    `,
    [
      id,
      patient.initials,
      patient.bedNumber,
      patient.age,
      patient.sex,
      patient.esiLevel,
      patient.locationId,
      patient.arrivalMethodId,
      patient.chiefComplaintId,
      patient.chiefComplaintDetail,
      patient.ownerRoleId,
      patient.nextMilestone,
      patient.labOptionId,
      patient.imagingOptionId,
      patient.notes,
      patient.riskFlagIds,
    ],
  )) as { id: string }[];

  if (!rows[0]) {
    return null;
  }

  await recordAuditEvent("patient", id, "update", patient);

  return getPatientById(id);
}

export async function dischargePatient(id: string) {
  assertUuid(id, "Patient id");

  const sql = getSql();
  const rows = (await sql.query(
    `
      UPDATE ed_patients
      SET discharged_at = now(), updated_at = now()
      WHERE id = $1::uuid
        AND discharged_at IS NULL
      RETURNING id
    `,
    [id],
  )) as { id: string }[];

  if (!rows[0]) {
    return false;
  }

  await recordAuditEvent("patient", id, "discharge", {});

  return true;
}

async function getPatientById(id: string) {
  const patients = await getActivePatients();

  return patients.find((patient) => patient.id === id) ?? null;
}

async function recordAuditEvent(entityType: string, entityId: string, action: string, changes: unknown) {
  const sql = getSql();

  await sql.query(
    "INSERT INTO ed_audit_events (entity_type, entity_id, action, changes) VALUES ($1, $2::uuid, $3, $4::jsonb)",
    [entityType, entityId, action, JSON.stringify(changes)],
  );
}

function toLookupOption(row: LookupRow): LookupOption {
  return {
    id: row.id,
    label: row.label,
    code: row.code,
    sortOrder: row.sort_order,
  };
}

function toLocationOption(row: LocationRow): LocationOption {
  return {
    ...toLookupOption(row),
    isWaitingArea: row.is_waiting_area,
  };
}

function toRiskFlagOption(row: RiskFlagRow): RiskFlagOption {
  return {
    ...toLookupOption(row),
    tone: row.tone,
    watchKey: row.watch_key,
  };
}

function toNullableLookupOption(row: PatientRow, prefix: string): LookupOption | null {
  const id = row[`${prefix}_id` as keyof PatientRow];

  if (!id) {
    return null;
  }

  return {
    id: String(id),
    label: String(row[`${prefix}_label` as keyof PatientRow] ?? ""),
    code: nullableString(row[`${prefix}_code` as keyof PatientRow]),
    sortOrder: Number(row[`${prefix}_sort_order` as keyof PatientRow] ?? 0),
  };
}

function toNullableLocationOption(row: PatientRow, prefix: string): LocationOption | null {
  const option = toNullableLookupOption(row, prefix);

  if (!option) {
    return null;
  }

  return {
    ...option,
    isWaitingArea: Boolean(row[`${prefix}_is_waiting_area` as keyof PatientRow]),
  };
}

function normalizePatient(payload: PatientPayload): NormalizedPatient {
  const initials = requiredText(payload.initials, "Initials", 16);
  const bedNumber = requiredText(payload.bedNumber, "Bed number", 20);
  const esiLevel = Number(payload.esiLevel);

  if (!Number.isInteger(esiLevel) || esiLevel < 1 || esiLevel > 5) {
    throw new Error("ESI level must be a number from 1 to 5.");
  }

  const age = optionalNumber(payload.age, "Age");
  const sex = optionalEnum(payload.sex, "Sex", ["M", "F", "X"]);
  const riskFlagIds = Array.isArray(payload.riskFlagIds)
    ? payload.riskFlagIds.map((value) => optionalUuid(value)).filter((value): value is string => Boolean(value))
    : [];

  return {
    initials,
    bedNumber,
    age,
    sex,
    esiLevel,
    locationId: optionalUuid(payload.locationId),
    arrivalMethodId: optionalUuid(payload.arrivalMethodId),
    chiefComplaintId: optionalUuid(payload.chiefComplaintId),
    chiefComplaintDetail: optionalText(payload.chiefComplaintDetail, 500),
    ownerRoleId: optionalUuid(payload.ownerRoleId),
    nextMilestone: optionalText(payload.nextMilestone, 500),
    labOptionId: optionalUuid(payload.labOptionId),
    imagingOptionId: optionalUuid(payload.imagingOptionId),
    riskFlagIds,
    notes: optionalText(payload.notes, 2000),
  };
}

function requiredText(value: unknown, label: string, maxLength: number) {
  const normalized = optionalText(value, maxLength);

  if (!normalized) {
    throw new Error(`${label} is required.`);
  }

  return normalized;
}

function optionalText(value: unknown, maxLength: number) {
  if (value === null || value === undefined) {
    return null;
  }

  const normalized = String(value).trim();

  if (!normalized) {
    return null;
  }

  return normalized.slice(0, maxLength);
}

function optionalNumber(value: unknown, label: string) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const normalized = Number(value);

  if (!Number.isInteger(normalized) || normalized < 0 || normalized > 130) {
    throw new Error(`${label} must be a whole number from 0 to 130.`);
  }

  return normalized;
}

function optionalEnum(value: unknown, label: string, allowedValues: string[]) {
  const normalized = optionalText(value, 10);

  if (!normalized) {
    return null;
  }

  if (!allowedValues.includes(normalized)) {
    throw new Error(`${label} is invalid.`);
  }

  return normalized;
}

function optionalUuid(value: unknown) {
  const normalized = optionalText(value, 64);

  if (!normalized) {
    return null;
  }

  assertUuid(normalized, "Identifier");

  return normalized;
}

function assertUuid(value: string, label: string) {
  if (!UUID_PATTERN.test(value)) {
    throw new Error(`${label} is invalid.`);
  }
}

function nullableString(value: unknown) {
  return value === null || value === undefined ? null : String(value);
}
