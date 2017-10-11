<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BreederController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show Breeder's homepage view
     *
     * @return void
     */
    public function index()
    {
        return view('users.breeder.manage');
    }
}
