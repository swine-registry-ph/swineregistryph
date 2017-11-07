<?php

namespace App\Http\Controllers;

use App\Models\Farm;
use Illuminate\Http\Request;

class AdminController extends Controller
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
     * Show Admin's homepage view
     *
     * @return void
     */
    public function index()
    {
        $farms = Farm::with('swines')->get();

        return view('users.admin.dashboard', compact('farms'));
    }

    /**
     * View Farms and its respective swines
     *
     * @return View
     */
    public function viewFarms()
    {
        $farms = Farm::with('swines')->get();

        return view('users.admin.dashboard', compact('farms'));
    }

}
