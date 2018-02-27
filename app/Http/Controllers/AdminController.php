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
        return view('users.admin.home');
    }

    /**
     * View registered swine categorized by farms
     *
     * @return View
     */
    public function viewRegisteredSwine()
    {
        $farms = Farm::with('swines')->get();

        return view('users.admin.dashboard', compact('farms'));
    }

    /**
     * View and manage client ids and secrets
     *
     * @return View
     */
    public function viewManageAPIs()
    {
        return view('users.admin.manageAPIs');
    }

}
