<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Auth;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {

    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Manage homepage viewing depending on user role
        $user = Auth::user();

        if($user->isAdmin()) return redirect()->action('AdminController@index');
        else if($user->isBreeder()) return redirect()->action('BreederController@index');
        else if($user->isGenomics()) return redirect()->action('GenomicsController@index');
        else if($user->isEvaluator()) return redirect()->action('EvaluatorController@index');
        else redirect()->route('logout');
    }
}
