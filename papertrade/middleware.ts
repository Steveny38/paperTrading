import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { createClient } from './utils/supabase/server'

export async function middleware(request: NextRequest) {
  
  if(request.nextUrl.pathname.startsWith("/dashboard")){
    const supabase =  createClient()
    const {data: {user}} = await (await supabase).auth.getUser()

    if(!user){
      return NextResponse.redirect(new URL('/login', request.url), {
        status: 302,
      })
    } 


    
  } else if(request.nextUrl.pathname.startsWith("/portfolio")){
    const supabase =  createClient()
    const {data: {user}} = await (await supabase).auth.getUser()

    if(!user){
      return NextResponse.redirect(new URL('/login', request.url), {
        status: 302,
      })
    }}

  


  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}