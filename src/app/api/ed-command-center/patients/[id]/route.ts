import { dischargePatient, updatePatient } from "@/lib/ed-command-center";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PatientRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: PatientRouteContext) {
  try {
    const { id } = await context.params;
    const patient = await updatePatient(id, await request.json());

    if (!patient) {
      return Response.json({ error: { message: "Patient not found." } }, { status: 404 });
    }

    return Response.json({ patient });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(_request: Request, context: PatientRouteContext) {
  try {
    const { id } = await context.params;
    const removed = await dischargePatient(id);

    if (!removed) {
      return Response.json({ error: { message: "Patient not found." } }, { status: 404 });
    }

    return Response.json({ ok: true });
  } catch (error) {
    return toErrorResponse(error);
  }
}

function toErrorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Unable to update patient.";
  const status = message.includes("DATABASE_URL") ? 503 : 400;

  return Response.json({ error: { message } }, { status });
}
