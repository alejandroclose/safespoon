// src/middleware.js
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/dashboard/establishments',
  '/dashboard/menus',
  '/dashboard/qrcodes',
  '/dashboard/settings'
];

// Role-specific route protection
const roleBasedRoutes = {
  '/dashboard/establishments/new': ['admin', 'establishment_owner'],
  '/dashboard/establishments/[id]': ['admin', 'establishment_owner', 'establishment_staff'],
  '/dashboard/menus/new': ['admin', 'establishment_owner', 'establishment_staff'],
  '/dashboard/menus/[menuId]': ['admin', 'establishment_owner', 'establishment_staff']
};

export async function middleware(request) {
  // Get the pathname from the URL
  const { pathname } = request.nextUrl;
  
  // If it's not a protected route, allow the request to proceed
  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }
  
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });
  
  // If not authenticated, redirect to login page
  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(url);
  }
  
  // Check role-based access if needed
  if (isRoleProtectedRoute(pathname)) {
    const userRole = token.role;
    const allowedRoles = getRolesForRoute(pathname);
    
    if (!allowedRoles.includes(userRole) && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }
  
  // Allow the request to proceed
  return NextResponse.next();
}

// Check if the route is protected
function isProtectedRoute(pathname) {
  return protectedRoutes.some(route => pathname.startsWith(route)) ||
         Object.keys(roleBasedRoutes).some(route => {
           const routePattern = new RegExp(
             `^${route.replace(/\[.*?\]/g, '[^/]+')}`
           );
           return routePattern.test(pathname);
         });
}

// Check if the route has role-based protection
function isRoleProtectedRoute(pathname) {
  return Object.keys(roleBasedRoutes).some(route => {
    const routePattern = new RegExp(
      `^${route.replace(/\[.*?\]/g, '[^/]+')}`
    );
    return routePattern.test(pathname);
  });
}

// Get allowed roles for a route
function getRolesForRoute(pathname) {
  for (const [route, roles] of Object.entries(roleBasedRoutes)) {
    const routePattern = new RegExp(
      `^${route.replace(/\[.*?\]/g, '[^/]+')}`
    );
    if (routePattern.test(pathname)) {
      return roles;
    }
  }
  return [];
}

// Configure which paths to apply middleware to
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/establishments/:path*',
    '/api/menus/:path*',
  ]
};