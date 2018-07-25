<?php

namespace App\Http\Controllers;

use App\Mail\BreederCreated;
use App\Mail\NoticeOnFarmRenewal;
use App\Models\Breeder;
use App\Models\Farm;
use App\Models\User;
use App\Repositories\CustomHelpers;
use Carbon\Carbon;
use Illuminate\Http\Request;

use Mail;

class ManageBreedersController extends Controller
{
    use CustomHelpers;

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
     * Show manage breeders page
     *
     * @return View
     */
    public function index()
    {
        $customizedBreederData = [];
        $breeders = Breeder::with('farms', 'users')->get();
        
        // Customize breeder data for easier querying
        foreach ($breeders as $breeder) {
            array_push($customizedBreederData, 
                [
                    'breederId' => $breeder->id,
                    'userId'    => $breeder->users[0]->id,
                    'name'      => $breeder->users[0]->name,
                    'email'     => $breeder->users[0]->email,
                    'status'    => $breeder->status_instance,
                    'farms'     => $breeder->farms
                ]
            );
        }
        
        $customizedBreederData = collect($customizedBreederData)->sortBy('name');
        $customizedBreederData = collect($customizedBreederData->values()->all());
        $provinceOptions = collect($this->getProvinceOptions())->sortBy('text');
        $provinceOptionsSorted = collect($provinceOptions->values()->all());
        
        return view('users.admin.manageBreeders', compact('customizedBreederData', 'provinceOptionsSorted'));
    }

    /**
     * Add Breeder details
     *
     * @param   Request $request
     * @return  JSON
     */
    public function addBreeder(Request $request)
    {
        if($request->ajax()){

            $initialPassword = str_random(8);

            $breederUser = User::create([
                'name'          => $request->name,
                'email'         => $request->email,
                'password'      => bcrypt($initialPassword),
                'userable_id'   => 0,
                'userable_type' => ''
            ]);

            $breeder = Breeder::create([]);
            $breeder->users()->save($breederUser);

            // Send email to newly created Breeder user
            // Put sending of email in queue
            $breederDetails = [
                'name'              => $breederUser->name,
                'email'             => $breederUser->email,
                'initialPassword'   => $initialPassword
            ];

            Mail::to($breederUser->email)->queue(new BreederCreated($breederDetails));

            return [
                'breederId' => $breeder->id,
                'userId'    => $breederUser->id,
                'name'      => $breederUser->name,
                'email'     => $breederUser->email,
                'status'    => $breederUser->userable()->first()->status_instance,
                'farms'     => []
            ];
        }
    }

    /**
     * Update Breeder details
     *
     * @param   Request $request
     * @return  JSON
     */
    public function updateBreeder(Request $request)
    {
        if($request->ajax()){

            $breederUser = User::find($request->userId);
            $breederUser->name = $request->name;
            $breederUser->email = $request->email;
            $breederUser->save();

            return [
                'updated' => true
            ];
        }
    }

    /**
     * Add Breeder farm details
     *
     * @param   Request $request
     * @return  JSON
     */
    public function addFarm(Request $request)
    {
        if($request->ajax()){

            $breeder = Breeder::find($request->breederId);

            // Check if breeder exists
            if($breeder){
                $farm = new Farm;
                $farm->name = $request->name;
                $farm->farm_code = $request->farmCode;
                $farm->farm_accreditation_no = $request->accreditationNo;
                $farm->farm_accreditation_date = Carbon::createFromFormat(
                    'F d, Y', 
                    $request->accreditationDate
                )->toDateString();
                $farm->address_line1 = $request->addressLine1;
                $farm->address_line2 = $request->addressLine2;
                $farm->province = $request->province;
                $farm->province_code = $request->provinceCode;

                // Attach farm to breeder
                $breeder->farms()->save($farm);

                return $farm;
            }
            else return response('Breeder not found.', 404);
             
        }
    }

    /**
     * Update Breeder farm details
     *
     * @param   Request $request
     * @return  JSON
     */
    public function updateFarm(Request $request)
    {
        if($request->ajax()){
            $farm = Farm::find($request->farmId);

            // Check if farm exists
            if($farm){

                $farm->name = $request->name;
                $farm->farm_code = $request->farmCode;
                $farm->farm_accreditation_no = $request->accreditationNo;
                $farm->farm_accreditation_date = Carbon::createFromFormat(
                    'F d, Y', 
                    $request->accreditationDate
                )->toDateString();
                $farm->address_line1 = $request->addressLine1;
                $farm->address_line2 = $request->addressLine2;
                $farm->province = $request->province;
                $farm->province_code = $request->provinceCode;
                $farm->save();

                return [
                    'updated' => true
                ];
            }
            else return response('Farm not found.', 404);
            
        }
    }

    /**
     * Renew suspended farm
     *
     * @param   Request $request
     * @return  JSON
     */
    public function renewFarm(Request $request)
    {
        if($request->ajax()){
            $farm = Farm::find($request->farmId);

            if($farm){
                $farm->farm_accreditation_date = Carbon::createFromFormat(
                    'F d, Y', 
                    $request->newAccreditationDate
                )->toDateString();
                $farm->is_suspended = 0;
                $farm->save();
    
                $breederUser = $farm->breeder->users()->first();
                $farmDetails = [
                    'name'              => $farm->name,
                    'accreditationNo'   => $farm->farm_accreditation_no,
                    'accreditationDate' => Carbon::createFromFormat(
                                                'Y-m-d', 
                                                $farm->farm_accreditation_date
                                            )->format('F d, Y')
                ];
    
                // Send Email of Farm Renewal
                Mail::to($breederUser->email)->queue(new NoticeOnFarmRenewal($farmDetails));
    
                return [
                    'updated' => true
                ];
            }
            else return response('Farm not found.', 404);

        }
    }
}
