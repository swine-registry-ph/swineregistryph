<?php

namespace App\Http\Controllers;

use App\Models\Swine;
use App\Repositories\PedigreeRepository;
use Illuminate\Http\Request;

use Auth;

class PedigreeController extends Controller
{
    protected $pedigreeRepo;

    /**
     * Create a new controller instance.
     *
     * @return  void
     */
    public function __construct(PedigreeRepository $pedigreeRepository)
    {
        $this->middleware('role:breeder');

        $this->pedigreeRepo = $pedigreeRepository;
    }

    /**
     * View Swine Pedigree page
     *
     * @return  void
     */
    public function index()
    {
        $breederUser = Auth::user()->userable()->first();
        $swines = $breederUser->swines;
        $autocompleteData = [];

        foreach ($swines as $swine) {
            $autocompleteData[$swine->registration_no] = null;
        }

        return view('users.breeder.pedigree', compact('autocompleteData'));
    }

    /**
     * Get pedigree of a swine
     *
     * @param   Request     $request
     * @param   string      $regNo
     * @param   integer     $generation
     * @return  JSON
     */
    public function getSwinePedigree(Request $request, $regNo, $generation)
    {
        if($request->ajax()){
            $swine = Swine::where('registration_no', $regNo)->first();

            return ($swine)
                ? $this->pedigreeRepo->buildPedigree($swine, $generation)
                : abort(404);
        }
    }
}
