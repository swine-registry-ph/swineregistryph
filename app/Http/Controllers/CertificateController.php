<?php

namespace App\Http\Controllers;

use App\Models\Farm;
use App\Models\InspectionItem;
use App\Models\InspectionRequest;
use App\Models\Swine;
use App\Repositories\CustomHelpers;
use Carbon\Carbon;
use Illuminate\Http\Request;

use Auth;

class CertificateController extends Controller
{
    /**
     * Show Breeder's inspection requests
     *
     * @return  View
     */
    public function breederViewAll(Request $request)
    {
        $this->breederUser = Auth::user();
        $breeder = $this->breederUser->userable()->first();

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
        // foreach ($inspectionRequests as $inspectionRequest) {
        //     $evaluatorName = ($request->evaluator) 
        //         ? $inspectionRequest->evaluator->users()->first()->name
        //         : '';
        //     $farm = $inspectionRequest->farm;

        //     $customInspectionRequests[] = [
        //         'id'             => $inspectionRequest->id,
        //         'farmName'       => "{$farm->name}, {$farm->province}",
        //         'evaluatorName'  => $evaluatorName,
        //         'dateRequested'  => $this->changeDateFormat($inspectionRequest->date_requested),
        //         'dateInspection' => $this->changeDateFormat($inspectionRequest->date_inspection),
        //         'dateApproved'   => $this->changeDateFormat($inspectionRequest->date_approved),
        //         'status'         => $inspectionRequest->status
        //     ];
        // }

        // Farm options
        foreach ($breeder->farms as $farm) {
            if(!$farm->is_suspended){
                $farmOptions[] = [
                    'text'  => $farm->name . ' , ' . $farm->province,
                    'value' => $farm->id
                ];
            }
        }

        $approvedSwines = collect([]);
        $currentFilterOptions = collect($currentFilterOptions);
        $farmOptions = collect($farmOptions);

        return view('users.breeder.certificateRequests', 
            compact(
                'approvedSwines',
                'currentFilterOptions',
                'farmOptions'
            )
        );
    }
}
