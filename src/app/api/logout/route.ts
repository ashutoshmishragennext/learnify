import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token');

  if (!token) {
    return NextResponse.json({ message: "Login First!" }, { status: 401 });
  }

  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.set('token', '', {
    httpOnly: true,
    expires: new Date(0), // Expire the cookie
    path: '/', // Ensure the cookie is cleared across the entire domain
  });

  return response;
}
