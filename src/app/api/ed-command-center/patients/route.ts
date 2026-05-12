import { createPatient } from "@/lib/ed-command-center";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const patient = await createPatient(await request.json());

    return Response.json({ patient }, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}

function toErrorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Unable to save patient.";
  const status = message.includes("DATABASE_URL") ? 503 : 400;

  return Response.json({ error: { message } }, { status });
}
