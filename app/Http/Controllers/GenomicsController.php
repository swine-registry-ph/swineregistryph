<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class GenomicsController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('role:genomics');
    }

    /**
     * Show Genomics' homepage view
     *
     * @return  void
     */
    public function index()
    {
        return view('users.genomics.home');
    }

    /**
     * Show form for registering genetic information
     *
     * @return void
     */
    public function showRegisterGeneticInfo()
    {
        return view('users.genomics.registerGeneticInfo');
    }
}
