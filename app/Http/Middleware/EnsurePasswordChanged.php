<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePasswordChanged
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();
        
        // Skip password change requirement for certain routes
        $exemptRoutes = [
            'password.change',
            'password.update',
            'logout',
        ];
        
        if ($user && 
            $user->mustChangePassword() && 
            !in_array($request->route()->getName(), $exemptRoutes) &&
            !$request->routeIs('password.*')) {
            
            return redirect()->route('password.change')
                ->with('warning', 'You must change your temporary password before continuing.');
        }

        return $next($request);
    }
}