<?php

namespace App\Http\Controllers;

use App\Models\InspectionRequest;
use App\Repositories\CustomHelpers;
use Illuminate\Http\Request;

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
        $inspectionRequests = InspectionRequest::all();
        $customInspectionRequests = [];
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

        $currentFilterOptions = collect($currentFilterOptions);
        $customInspectionRequests = collect($customInspectionRequests);

        return view('users.breeder.inspectionRequests', 
            compact(
                'customInspectionRequests',
                'currentFilterOptions'
            )
        );
    }
}
