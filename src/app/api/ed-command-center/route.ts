import { getCommandCenterData } from "@/lib/ed-command-center";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    return Response.json(await getCommandCenterData());
  } catch (error) {
    return toErrorResponse(error);
  }
}

function toErrorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Unable to load command center data.";
  const status = message.includes("DATABASE_URL") ? 503 : 500;

  return Response.json({ error: { message } }, { status });
}
