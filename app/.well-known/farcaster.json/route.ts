export async function GET() {
  // Redirect to Farcaster hosted manifest
  return Response.redirect(
    "https://api.farcaster.xyz/miniapps/hosted-manifest/019959de-9ed2-e882-fe2a-4acd4f9ae5c1",
    307
  );
}
