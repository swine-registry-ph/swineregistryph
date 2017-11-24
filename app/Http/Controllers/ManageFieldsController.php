<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ManageFieldsController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('role:admin');
    }

    /**
     * Show Breeder's homepage view
     *
     * @return void
     */
    public function index()
    {
        return view('users.breeder.home');
    }
}
