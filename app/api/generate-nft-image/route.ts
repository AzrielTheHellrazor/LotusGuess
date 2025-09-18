import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const question = searchParams.get('question') || '';
  const answer = searchParams.get('answer') || '';
  const flower = searchParams.get('flower') || '';
  const description = searchParams.get('description') || '';

  // Generate SVG image with the decision data
  const svg = `
    <svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ffeef8;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#f0f9ff;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="card-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.95" />
          <stop offset="100%" style="stop-color:#fce4ec;stop-opacity:0.95" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="800" height="800" fill="url(#bg)"/>
      
      <!-- Main card -->
      <rect x="50" y="100" width="700" height="600" rx="30" fill="url(#card-bg)" stroke="#e91e63" stroke-width="4"/>
      
      <!-- Title -->
      <text x="400" y="180" text-anchor="middle" fill="#e91e63" font-family="Arial, sans-serif" font-size="36" font-weight="bold">🌸 LotusGuess Decision</text>
      
      <!-- Flower emoji -->
      <text x="400" y="280" text-anchor="middle" font-size="120">${flower.split(' ')[0] || '🌸'}</text>
      
      <!-- Answer -->
      <text x="400" y="380" text-anchor="middle" fill="#e91e63" font-family="Arial, sans-serif" font-size="48" font-weight="bold">${answer}</text>
      
      <!-- Question -->
      <foreignObject x="80" y="420" width="640" height="120">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Arial, sans-serif; font-size: 24px; color: #333; text-align: center; line-height: 1.4; padding: 20px;">
          <strong>Question:</strong><br/>
          ${question.length > 80 ? question.substring(0, 80) + '...' : question}
        </div>
      </foreignObject>
      
      <!-- Flower meaning -->
      <text x="400" y="600" text-anchor="middle" fill="#666" font-family="Arial, sans-serif" font-size="20" font-style="italic">${flower.split(' ')[1] || ''} - ${description}</text>
      
      <!-- Footer -->
      <text x="400" y="680" text-anchor="middle" fill="#999" font-family="Arial, sans-serif" font-size="18">Made with LotusGuess 🌸</text>
      <text x="400" y="710" text-anchor="middle" fill="#999" font-family="Arial, sans-serif" font-size="14">${new Date().toLocaleDateString()}</text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
