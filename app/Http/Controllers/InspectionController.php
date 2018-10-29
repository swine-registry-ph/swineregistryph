<?php

namespace App\Http\Controllers;

use App\Models\Farm;
use App\Models\InspectionItem;
use App\Models\InspectionRequest;
use App\Repositories\CustomHelpers;
use Carbon\Carbon;
use Illuminate\Http\Request;

use Auth;

class InspectionController extends Controller
{
    use CustomHelpers;

    protected $evaluatorUser, $breederUser;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('role:breeder')
            ->only([
                'breederViewAll',
                'createInspectionRequest',
                'getSwinesOfInspectionRequest',
                'addSwinesToInspectionRequest',
                'removeInspectionItem',
                'requestForInspection'
            ]);
        
        $this->middleware('role:evaluator')
            ->only([
                'evaluatorViewAll',
            ]);
    }

    /**
     * ------------------------------------------
     * BREEDER-SPECIFIC METHODS
     * ------------------------------------------
     */

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
                'dateApproved'   => $this->changeDateFormat($inspectionRequest->date_approved),
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
                'dateApproved'   => '',
                'status'         => 'draft'
            ];
        }
    }

    /**
     * Get included swines and available swines to add
     * for respective inspection request
     *
     * @param   Request $request
     * @param   integer $inspectionRequestId
     * @return  Collection
     */
    public function getSwinesOfInspectionRequest(Request $request, int $inspectionRequestId)
    {
        if($request->ajax()) {
            $inspectionRequest = InspectionRequest::where('id',$inspectionRequestId)
                ->with('inspectionItems.swine.swineProperties')->first();
            $farm = Farm::find($inspectionRequest->farm_id);
            $relatedSwines = $farm->swines()->with(['inspectionItem', 'swineProperties'])->get();
            $availableSwines = [];
            $includedSwines = [];

            // Transform swine data already included in the inspection request
            foreach ($inspectionRequest->inspectionItems as $item) {
                $swine = $item->swine;

                $includedSwines[] = [
                    'itemId'         => $item->id,
                    'swineId'        => $swine->id,
                    'registrationNo' => $swine->registration_no,
                    'farmSwineId'    => $swine->swineProperties
                                        ->where('property_id', 24)->first()->value
                ];
            }

            // Transform swine data available to be included in the inspection request
            foreach ($relatedSwines as $swine) {
                // Only include swine that's not part of any inspection request
                if(!$swine->inspectionItem) {
                    $availableSwines[] = [
                        'itemId'         => 0,
                        'swineId'        => $swine->id,
                        'registrationNo' => $swine->registration_no,
                        'farmSwineId'    => $swine->swineProperties
                                            ->where('property_id', 24)->first()->value
                    ];
                }
            }

            // Sort data according to farmSwineId
            $availableSwines = collect($availableSwines)
                ->sortBy('farmSwineId')->values()->all();
            $includedSwines = collect($includedSwines)
                ->sortBy('farmSwineId')->values()->all();

            return collect([
                'included'  => $includedSwines,
                'available' => $availableSwines 
            ]);
        }
    }

    /**
     * Add swines to respective inspection request. Adding swines
     * is the same as adding an inspection items to 
     * respective inspection request
     *
     * @param   Request $request
     * @param   integer $inspectionRequestId
     * @return  Collection
     */
    public function addSwinesToInspectionRequest(Request $request, int $inspectionRequestId)
    {
        if($request->ajax()) {
            $inspectionRequest = InspectionRequest::find($inspectionRequestId);
            $inspectionItemsArray = [];
            $includedSwines = [];

            foreach ($request->swineIds as $swineId) {
                $inspectionItemsArray[] = [
                    'swine_id' => $swineId
                ];
            }

            $inspectionRequest->inspectionItems()->createMany($inspectionItemsArray);

            // Return updated included and available swine
            // for the respective inspection request
            return $this->getSwinesOfInspectionRequest($request, $inspectionRequestId);
        }
    }

    /**
     * Remove inspection item from respective inspection request.
     * Removing an inspection item is the same as removing
     * a swine from respective inspection request
     *
     * @param   Request $request
     * @param   integer $inspectionRequestId
     * @param   integer $itemId
     * @return  Collection
     */
    public function removeInspectionItem(Request $request, int $inspectionRequestId, int $itemId)
    {
        if($request->ajax()) {
            $inspectionRequestItem = InspectionItem::find($itemId);
            $inspectionRequestItem->delete();

            // Return updated included and available swine
            // for the respective inspection request
            return $this->getSwinesOfInspectionRequest($request, $inspectionRequestId);
        }
    }

    /**
     * Request inspection
     *
     * @param  Request $request
     * @param  integer $inspectionRequestId
     * @return JSON
     */
    public function requestForInspection(Request $request, int $inspectionRequestId)
    {
        if($request->ajax()) {
            $inspectionRequest = InspectionRequest::find($inspectionRequestId);
            $inspectionRequest->date_requested = Carbon::now()->format('Y-m-d');
            $inspectionRequest->status = 'requested';
            $inspectionRequest->save();

            return [
                'dateRequested' => $this->changeDateFormat($inspectionRequest->date_requested),
                'requested' => true
            ];
        }
    }

    /**
     * ------------------------------------------
     * EVALUATOR-SPECIFIC METHODS
     * ------------------------------------------
     */

    /**
     * Show requested inspections to Evaluator
     *
     * @return  View
     */
    public function evaluatorViewAll(Request $request)
    {
        $inspectionRequests = InspectionRequest::whereIn(
                'status', 
                ['requested', 'for_inspection', 'approved']
            )->get();
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
                'dateApproved'   => $this->changeDateFormat($inspectionRequest->date_approved),
                'status'         => $inspectionRequest->status
            ];
        }

        $customInspectionRequests = collect($customInspectionRequests);
        $currentFilterOptions = collect($currentFilterOptions);

        return view('users.evaluator.inspectionRequests', 
            compact(
                'customInspectionRequests',
                'currentFilterOptions',
                'farmOptions'
            )
        );
    }

}
