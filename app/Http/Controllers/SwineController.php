<?php

namespace App\Http\Controllers;

use App\Models\Breed;
use App\Models\Photo;
use App\Models\Property;
use App\Models\Swine;
use App\Models\SwineProperty;
use App\Repositories\SwineRepository;
use Carbon\Carbon;
use Illuminate\Http\Request;

use Auth;
use Storage;

class SwineController extends Controller
{
    protected $user;
    protected $breederUser;
    protected $swineRepository;

    // Constant variable paths
    const SWINE_IMG_PATH = '/images/swine/';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(SwineRepository $swineRepository)
    {
        $this->middleware('role:breeder');
        $this->middleware(function($request, $next){
            $this->user = Auth::user();
            $this->breederUser = Auth::user()->userable()->first();

            return $next($request);
        });
        $this->swineRepository = $swineRepository;
    }

    /**
     * Show Registration form for adding swine
     *
     * @return  View
     */
    public function showRegistrationForm()
    {
        $farmOptions = [];
        $breedOptions = [];

        // Get farm options for farm from input select
        foreach ($this->breederUser->farms as $farm) {
            array_push($farmOptions,
                [
                    'text' => $farm->name . ' , ' . $farm->province,
                    'value' => $farm->id
                ]
            );
        }

        // Get breed options for breed input select
        foreach(Breed::all() as $breed){
            array_push($breedOptions,
                [
                    'text' => $breed->title,
                    'value' => $breed->id
                ]
            );
        }

        $farmOptions = collect($farmOptions);
        $breedOptions = collect($breedOptions);

        return view('users.breeder.form', compact('farmOptions', 'breedOptions'));
    }

    /**
     * View already registered swine
     *
     * @return  View
     */
    public function viewRegisteredSwine()
    {
        $swines = $this->breederUser->swines()->with(['swineProperties.property', 'breed', 'photos', 'farm', 'certificate.photos'])->get();

        return view('users.breeder.viewRegisteredSwine', compact('swines'));
    }

    /**
     * View Registry Certicate
     *
     * @param   integer     $swineId
     * @return  View
     */
    public function viewRegistryCertificate($swineId)
    {
        $swine = Swine::where('id', $swineId)->with('swineProperties')->first();

        return view('users.breeder.registryCertificate', compact('swine'));
    }

    /**
     * Get Swine according to registration number
     *
     * @param   Request     $request
     * @param   integer     $regNo
     * @return  JSON
     */
    public function getSwine(Request $request, $regNo)
    {
        if($request->ajax()){
            $swine = Swine::where('registration_no', $regNo)->with('swineProperties')->first();

            foreach ($swine->swineProperties as $swineProperty) {
                $swineProperty->title = Property::find($swineProperty->property_id)->property;
            }

            return ($swine) ? $swine : 'Swine with registration no. ' . $regNo . ' cannot be found.';
        }
    }

    /**
     * Add Swine to database
     *
     * @param   Request     $request
     * @return  integer
     */
    public function addSwineInfo(Request $request)
    {
        if($request->ajax()){
            $gpSireInstance = $this->swineRepository->addParent($request->gpSire);
            $gpDamInstance = $this->swineRepository->addParent($request->gpDam);
            $gpOneInstance = $this->swineRepository->addSwine($request->gpOne, $gpSireInstance->id, $gpDamInstance->id);

            return $gpOneInstance;
        }
    }

}
