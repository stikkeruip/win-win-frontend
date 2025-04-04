import { NextResponse } from 'next/server';

// Mock admin credentials - in a real app, these would be stored securely
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password';

// Simple JWT token generation (for demo purposes only)
// In a real app, use a proper JWT library with secure keys
function generateToken(username: string): string {
  // This is a very simplified token for demonstration
  // In production, use a proper JWT library with secure keys
  return Buffer.from(JSON.stringify({
    username,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
  })).toString('base64');
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { username, password } = body;

    // Validate credentials
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Check credentials against mock values
    // In a real app, you would validate against a database
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Generate a token
      const token = generateToken(username);

      // Return success response with token
      return NextResponse.json({ token });
    } else {
      // Return error for invalid credentials
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}