<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterSwineRequest;
use App\Models\Breed;
use App\Models\Photo;
use App\Models\Property;
use App\Models\Swine;
use App\Models\SwineProperty;
use App\Repositories\CustomHelpers;
use App\Repositories\SwineRepository;
use Carbon\Carbon;
use Illuminate\Http\Request;

use Auth;
use Storage;
use PDF;

class SwineController extends Controller
{
    use CustomHelpers;

    protected $user;
    protected $breederUser;
    protected $swineRepo;

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
        $this->swineRepo = $swineRepository;
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

        // Get farm options for farm filter checkbox
        foreach ($this->breederUser->farms as $farm) {
            if(!$farm->is_suspended){
                $farmOptions[] = [
                    'text' => $farm->name . ' , ' . $farm->province,
                    'value' => $farm->id
                ];
            }
        }

        // Get breed options for breed filter checkbox
        foreach(Breed::all() as $breed){
            $breedOptions[] = [
                'text' => $breed->title,
                'value' => $breed->id
            ];
        }

        $farmOptions = collect($farmOptions);
        $breedOptions = collect($breedOptions);

        return view('users.breeder.registerSwine', compact('farmOptions', 'breedOptions'));
    }

    /**
     * View already registered swine
     *
     * @return  View
     */
    public function viewRegisteredSwine()
    {
        $swines = $this->breederUser->swines()->with(['swineProperties.property', 'breed', 'photos', 'farm'])->get();
        $farmOptions = [];
        $breedOptions = [];

        // Get farm options for farm from input select
        foreach ($this->breederUser->farms as $farm) {
            if(!$farm->is_suspended){
                $farmOptions[] = [
                    'text' => $farm->name . ' , ' . $farm->province,
                    'value' => $farm->id
                ];
            }
        }

        // Get breed options for breed input select
        foreach(Breed::all() as $breed){
            $breedOptions[] = [
                'text' => $breed->title,
                'value' => $breed->id
            ];
        }

        $farmOptions = collect($farmOptions);
        $breedOptions = collect($breedOptions);

        return view('users.breeder.viewRegisteredSwine', compact('swines', 'farmOptions', 'breedOptions'));
    }

    /**
     * View Registry Certicate
     *
     * @param   integer     $swineId
     * @return  PDF
     */
    public function viewRegistryCertificate($swineId)
    {
        $swine = Swine::where('id', $swineId)->with('swineProperties', 'farm')->first();

        if($swine){
            $view = \View::make('users.breeder._certificate', compact('swine'));
            $html = $view->render();

            $tagvs = [
                'h1' => [
                    ['h' => 0, 'n' => 0]
                ],
                'h2' => [
                    ['h' => 0, 'n' => 0]
                ],
                'p' => [
                    ['h' => 0, 'n' => 0]
                ]
            ];

            // Set configuration and show pdf
            PDF::setPageOrientation('L');
            PDF::SetCellPadding(0);
            PDF::setHtmlVSpace($tagvs);
            PDF::setFont('dejavusanscondensed', '', 10);
            PDF::SetTitle("{$swine->registration_no} Certificate of Registry");
            PDF::AddPage();
            PDF::WriteHTML($html, true, false, true, false, '');
            PDF::Output("{$swine->registration_no}.pdf");
        }
        else return abort(404);
    }

    /**
     * View temporary Registry Certificate
     *
     * @param   Request      $request
     * @return  PDF
     */
    public function viewTempRegistryCertificate(Request $request)
    {
        $swine = Swine::where('id', 1)->with('swineProperties', 'farm')->first();

        $view = \View::make('users.breeder._certificate', compact('swine'));
        $html = $view->render();

        $tagvs = [
            'h1' => [
                ['h' => 0, 'n' => 0]
            ],
            'h2' => [
                ['h' => 0, 'n' => 0]
            ],
            'p' => [
                ['h' => 0, 'n' => 0]
            ]
        ];

        // Set configuration and show pdf
        PDF::setPageOrientation('L');
        PDF::SetCellPadding(0);
        PDF::setHtmlVSpace($tagvs);
        PDF::setFont('dejavusanscondensed', '', 10);
        PDF::SetTitle("{$swine->registration_no} Certificate of Registry");
        PDF::AddPage();
        PDF::WriteHTML($html, true, false, true, false, '');
        PDF::Output("{$swine->registration_no}.pdf");
    }

    /**
     * Get Swine according to registration number
     *
     * @param   Request     $request
     * @param   integer     $regNo
     * @return  JSON
     */
    public function getSwine(Request $request, $sex, $regNo)
    {
        if($request->ajax()){
            $swine = Swine::where('registration_no', $regNo)->first();

            if($swine){
                $swineSex = $this->getSwinePropValue($swine,1);

                if($swineSex === $sex){
                    return $data = [
                        'existingRegNo'             => $swine->registration_no,
                        'imported' => [
                            'regNo'                 => ($swine->farm_id == 0) ? $swine->registration_no : '',
                            'farmOfOrigin'          => ($swine->farm_id == 0) ? $this->getSwinePropValue($swine, 26) : '',
                            'countryOfOrigin'       => ($swine->farm_id == 0) ? $this->getSwinePropValue($swine, 27) : ''
                        ],
                        'farmFromId'                => $swine->farm_id,
                        'sex'                       => $this->getSwinePropValue($swine, 1),
                        'birthDate'                 => $this->changeDateFormat($this->getSwinePropValue($swine, 2)),
                        'birthWeight'               => $this->getSwinePropValue($swine, 3),
                        'adgBirthEndDate'           => $this->changeDateFormat($this->getSwinePropValue($swine, 5)),
                        'adgBirthEndWeight'         => $this->getSwinePropValue($swine, 6),
                        'adgTestStartDate'          => $this->changeDateFormat($this->getSwinePropValue($swine, 8)),
                        'adgTestStartWeight'        => $this->getSwinePropValue($swine, 9),
                        'adgTestEndDate'            => $this->changeDateFormat($this->getSwinePropValue($swine, 10)),
                        'adgTestEndWeight'          => $this->getSwinePropValue($swine, 11),
                        'houseType'                 => $this->getSwinePropValue($swine, 12),
                        'bft'                       => $this->getSwinePropValue($swine, 13),
                        'bftCollected'              => $this->changeDateFormat($this->getSwinePropValue($swine, 14)),
                        'feedIntake'                => $this->getSwinePropValue($swine, 15),
                        'teatNo'                    => $this->getSwinePropValue($swine, 17),
                        'parity'                    => $this->getSwinePropValue($swine, 18),
                        'littersizeAliveMale'       => $this->getSwinePropValue($swine, 19),
                        'littersizeAliveFemale'     => $this->getSwinePropValue($swine, 20),
                        'littersizeWeaning'         => $this->getSwinePropValue($swine, 21),
                        'litterweightWeaning'       => $this->getSwinePropValue($swine, 22),
                        'dateWeaning'               => $this->changeDateFormat($this->getSwinePropValue($swine, 23)),
                        'farmSwineId'               => $this->getSwinePropValue($swine, 24),
                        'geneticInfoId'             => $this->getSwinePropValue($swine, 25)
                    ];
                }
                else return 'Swine with registration no. ' . $regNo . ' is not '. $sex . '.';
            }
            else return 'Swine with registration no. ' . $regNo . ' cannot be found.';
        }
    }

    /**
     * Add Swine to database
     *
     * @param   Request     $request
     * @return  integer
     */
    public function addSwineInfo(RegisterSwineRequest $request)
    {
        if($request->ajax()){
            $gpSireInstance = $this->swineRepo->addParent($request->gpSire);
            $gpDamInstance = $this->swineRepo->addParent($request->gpDam);
            $gpOneInstance = $this->swineRepo->addSwine($request->gpOne, $gpSireInstance->id, $gpDamInstance->id);

            return $gpOneInstance;
        }
    }

}
