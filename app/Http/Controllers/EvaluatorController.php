<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class EvaluatorController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('role:evaluator');
    }

    /**
     * Show Genomics' homepage view
     *
     * @return  void
     */
    public function index()
    {
        return view('users.evaluator.home');
    }
}
