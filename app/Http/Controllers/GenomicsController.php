<?php

namespace App\Http\Controllers;

use App\Models\LaboratoryResult;
use App\Models\LaboratoryTest;
use App\Repositories\GenomicsRepository;
use Illuminate\Http\Request;

use Auth;

class GenomicsController extends Controller
{
    protected $user;
    protected $genomicsUser;
    protected $genomicsRepo;
    
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(GenomicsRepository $genomicsRepo)
    {
        $this->middleware('role:genomics');
        $this->middleware(function($request, $next){
            $this->user = Auth::user();
            $this->genomicsUser = Auth::user()->userable()->first();

            return $next($request);
        });
        $this->genomicsRepo = $genomicsRepo;
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
     * @return  void
     */
    public function showRegisterGeneticInfo()
    {
        return view('users.genomics.registerGeneticInfo');
    }

    /**
     * Add laboratory results
     *
     * @param   Request $request
     * @return  void
     */
    public function addLaboratoryResults(Request $request)
    {

        return $this->genomicsRepo->addLabResults($request, $this->genomicsUser);
    }
}
