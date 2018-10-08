<?php

namespace App\Http\Controllers;

use App\Models\Farm;
use App\Models\InspectionRequest;
use App\Repositories\CustomHelpers;
use Illuminate\Http\Request;

use Auth;

class InspectionController extends Controller
{
    use CustomHelpers;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('role:breeder');
    }

    /**
     * Show Breeder's homepage view
     *
     * @return void
     */
    public function breederView(Request $request)
    {
        $breeder = Auth::user()->userable()->first();

        $inspectionRequests = $breeder->inspectionRequests;
        $customInspectionRequests = [];
        $farmOptions = [];
        $currentFilterOptions = [
            'status' => []
        ];

        if($request->status) {
            $statusArray = explode(' ', $request->status);
            $inspectionRequests = $inspectionRequests
                ->whereIn('status', $statusArray)
                ->values();

            // Include status in currentFilterOptions
            $currentFilterOptions['status'] = $statusArray;
        }

        // Customize Inspection request data
        foreach ($inspectionRequests as $inspectionRequest) {
            $evaluatorName = ($request->evaluator) 
                ? $inspectionRequest->evaluator->users()->first()->name
                : '';
            $farm = $inspectionRequest->farm;

            $customInspectionRequests[] = [
                'id'             => $inspectionRequest->id,
                'farmName'       => "{$farm->name}, {$farm->province}",
                'evaluatorName'  => $evaluatorName,
                'dateRequested'  => $this->changeDateFormat($inspectionRequest->date_requested),
                'dateInspection' => $this->changeDateFormat($inspectionRequest->date_inspection),
                'status'         => $inspectionRequest->status
            ];
        }

        // Farm options
        foreach ($breeder->farms as $farm) {
            if(!$farm->is_suspended){
                $farmOptions[] = [
                    'text'  => $farm->name . ' , ' . $farm->province,
                    'value' => $farm->id
                ];
            }
        }

        $customInspectionRequests = collect($customInspectionRequests);
        $currentFilterOptions = collect($currentFilterOptions);
        $farmOptions = collect($farmOptions);

        return view('users.breeder.inspectionRequests', 
            compact(
                'customInspectionRequests',
                'currentFilterOptions',
                'farmOptions'
            )
        );
    }

    /**
     * Create an Inspection Request
     *
     * @param   Request     $request
     * @return  Array
     */
    public function createInspectionRequest(Request $request)
    {
        if($request->ajax()) {
            $farm = Farm::find($request->farmId);

            $inspectionRequest = new InspectionRequest;
            $inspectionRequest->breeder_id = $request->breederId;
            $inspectionRequest->farm_id = $request->farmId;
            $inspectionRequest->save();

            // Return custom data
            return [
                'id'             => $inspectionRequest->id,
                'farmName'       => "{$farm->name}, {$farm->province}",
                'evaluatorName'  => '',
                'dateRequested'  => '',
                'dateInspection' => '',
                'status'         => 'draft'
            ];
        }
    }
}
