<?php

namespace App\Http\Controllers;

use App\Models\Swine;
use Illuminate\Http\Request;

use Auth;

class BreederController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('role:breeder');
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
