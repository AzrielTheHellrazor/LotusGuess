import { minikitConfig } from "../../../minikit.config";

export async function GET() {
  // Return Farcaster manifest as JSON
  return Response.json(minikitConfig);
}