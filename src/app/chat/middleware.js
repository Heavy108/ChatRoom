// app/chat/_middleware.js
import { NextResponse } from 'next/server';

export function middleware(req) {
  const username = req.cookies.get('username');

  if (!username) {
    return NextResponse.redirect('/login');
  }

  return NextResponse.next();
}
