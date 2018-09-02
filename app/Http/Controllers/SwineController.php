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
        $farmOptions  = [];
        $breedOptions = [];

        // Get farm options for farm filter checkbox
        foreach ($this->breederUser->farms as $farm) {
            if(!$farm->is_suspended){
                $farmOptions[] = [
                    'text'  => $farm->name . ' , ' . $farm->province,
                    'value' => $farm->id
                ];
            }
        }

        // Get breed options for breed filter checkbox
        foreach (Breed::all() as $breed) {
            $breedOptions[] = [
                'text'  => $breed->title,
                'value' => $breed->id
            ];
        }

        $farmOptions  = collect($farmOptions);
        $breedOptions = collect($breedOptions);

        return view('users.breeder.registerSwine', compact('farmOptions', 'breedOptions'));
    }

    /**
     * View already registered swine
     *
     * @return  View
     */
    public function viewRegisteredSwine(Request $request)
    {
        $swines = $this->breederUser
            ->swines()
            ->with(['swineProperties.property', 'breed', 'photos', 'farm'])
            ->get();
        $currentFilterOptions = [
            'breed' => [],
            'farm'  => [],
            'sex'   => [],
            'sc'    => 0
        ];
        $currentSearchParameter = '';
        $filteredSwines         = $swines;
        $farmOptions            = [];
        $breedOptions           = [];
        $breedArray             = []; 
        $farmArray              = []; 
        $sexArray               = [];

        // Filter swine according to requested filters
        if($request->q){
            $filteredSwines = $filteredSwines
                ->where('registration_no', $request->q)
                ->values();

            // Retain current search parameter
            $currentSearchParameter = $request->q;
        }

        if($request->breed){
            $breedArray = explode(' ',$request->breed);
            $filteredSwines = $filteredSwines
                ->whereIn('breed_id', $breedArray)
                ->values();

            // Include breed in currentFilterOptions
            $currentFilterOptions['breed'] = $breedArray;
        }
        
        if($request->farm){
            $farmArray = explode(' ',$request->farm);
            $filteredSwines = $filteredSwines
                ->whereIn('farm_id', $farmArray)
                ->values();
            
            // Include farm in currentFilterOptions
            $currentFilterOptions['farm'] = $farmArray;
        }
        
        if($request->sc){
            $filteredSwines = $filteredSwines
                ->where('swinecart', $request->sc)
                ->values();

            // Include swineCart in currentFilterOptions
            $currentFilterOptions['sc'] = (int) $request->sc;
        } 
        
        if($request->sex){
            $sexArray = explode(' ',$request->sex);
            foreach ($filteredSwines as $key => $swine) {
                // Unset array item if not found in sex filter
                if(!in_array($swine->swineProperties[0]->value, $sexArray)){
                    unset($filteredSwines[$key]);
                }
            }

            $filteredSwines = $filteredSwines->values();

            // Include sex in currentFilterOptions
            $currentFilterOptions['sex'] = $sexArray;
        }

        // Get farm options for farm from input select
        foreach ($this->breederUser->farms as $farm) {
            if(!$farm->is_suspended){
                $farmOptions[] = [
                    'text'  => $farm->name . ' , ' . $farm->province,
                    'value' => $farm->id
                ];
            }
        }

        // Get breed options for breed input select
        foreach (Breed::all() as $breed) {
            $breedOptions[] = [
                'text'  => $breed->title,
                'value' => $breed->id
            ];
        }

        $currentFilterOptions = collect($currentFilterOptions);
        $farmOptions          = collect($farmOptions);
        $breedOptions         = collect($breedOptions);

        return view(
            'users.breeder.viewRegisteredSwine', 
            compact(
                'filteredSwines', 
                'currentFilterOptions', 
                'currentSearchParameter', 
                'farmOptions', 
                'breedOptions'
            )
        );
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
            $swineInfo = $this->getSwineInfo($swine);
            $view = \View::make('users.breeder._certificate', compact('swineInfo'));
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
     * @param   string      $sex
     * @param   string      $regNo
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
     * @param   RegisterSwineRequest     $request
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

    /**
     * Get essential info for swine. Used for viewing 
     * swine registry certificate
     *
     * @param   Swine   $swine
     * @return  Array
     */
    private function getSwineInfo(Swine $swine)
    {
        $farm = $swine->farm;

        return [
            'registrationNo'            => $swine->registration_no,
            'imported' => [
                'regNo'                 => ($swine->farm_id == 0) ? $swine->registration_no : '',
                'farmOfOrigin'          => ($swine->farm_id == 0) ? $this->getSwinePropValue($swine, 26) : '',
                'countryOfOrigin'       => ($swine->farm_id == 0) ? $this->getSwinePropValue($swine, 27) : ''
            ],
            'breed'                     => $swine->breed->title,
            'breedCode'                 => $swine->breed->code,
            'breederName'               => $swine->breeder->users()->first()->name,
            'farmName'                  => $farm->name,
            'farmCode'                  => $farm->farm_code,
            'farmAddressLine1'          => $farm->address_line1,
            'farmAddressLine2'          => $farm->address_line2,
            'farmProvince'              => $farm->province,
            'farmProvinceCode'          => $farm->province_code,
            'farmAccreditationNo'       => $farm->farm_accreditation_no,
            'sex'                       => $this->getSwinePropValue($swine, 1),
            'birthDate'                 => $this->changeDateFormat($this->getSwinePropValue($swine, 2)),
            'birthYear'                 => $this->changeDateFormat($this->getSwinePropValue($swine, 2), 'year'),
            'adgFromBirth'              => $this->getSwinePropValue($swine, 4),
            'adgOnTest'                 => $this->getSwinePropValue($swine, 7),
            'houseType'                 => $this->getSwinePropValue($swine, 12),
            'bft'                       => $this->getSwinePropValue($swine, 13),
            'feedEfficiency'            => $this->getSwinePropValue($swine, 16),
            'teatNo'                    => $this->getSwinePropValue($swine, 17),
            'littersizeAliveMale'       => $this->getSwinePropValue($swine, 19),
            'littersizeAliveFemale'     => $this->getSwinePropValue($swine, 20),
            'farmSwineId'               => $this->getSwinePropValue($swine, 24),
            'geneticInfoId'             => $this->getSwinePropValue($swine, 25)
        ];
    }
}
