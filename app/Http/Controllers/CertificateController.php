<?php

namespace App\Http\Controllers;

use App\Models\CertificateRequest;
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
    use CustomHelpers;

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
                'createCertificateRequest',
                // 'addSwinesToInspectionRequest',
                // 'removeInspectionItem',
                // 'requestForInspection'
            ]);
        
        $this->middleware('role:evaluator')
            ->only([
                // 'evaluatorViewAll'
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

        $certificateRequests = $breeder->certificateRequests;
        $customCertificateRequests = [];
        $farmOptions = [];
        $currentFilterOptions = [
            'status' => []
        ];

        if ($request->status) {
            $statusArray = explode(' ', $request->status);
            $certificateRequests = $certificateRequests
                ->whereIn('status', $statusArray)
                ->values();

            // Include status in currentFilterOptions
            $currentFilterOptions['status'] = $statusArray;
        }

        // Customize Certificate request data
        foreach ($certificateRequests as $certificateRequest) {
            $adminName = ($certificateRequest->admin) 
                ? $certificateRequest->admin->users()->first()->name
                : '';
            $farm = $certificateRequest->farm;

            $customCertificateRequests[] = [
                'id'             => $certificateRequest->id,
                'farmName'       => "{$farm->name}, {$farm->province}",
                'adminName'      => $adminName,
                'dateRequested'  => $this->changeDateFormat($certificateRequest->date_requested),
                'datePayment'    => $this->changeDateFormat($certificateRequest->date_payment),
                'dateDelivery'   => $this->changeDateFormat($certificateRequest->date_delivery),
                'receiptNo'      => $certificateRequest->receipt_no,
                'status'         => $certificateRequest->status
            ];
        }

        // Farm options
        foreach ($breeder->farms as $farm) {
            if (!$farm->is_suspended) {
                $farmOptions[] = [
                    'text'  => $farm->name . ' , ' . $farm->province,
                    'value' => $farm->id
                ];
            }
        }

        $customCertificateRequests = collect($customCertificateRequests);
        $currentFilterOptions = collect($currentFilterOptions);
        $farmOptions = collect($farmOptions);

        return view('users.breeder.certificateRequests', 
            compact(
                'customCertificateRequests',
                'currentFilterOptions',
                'farmOptions'
            )
        );
    }

    /**
     * Create a Certificate Request
     *
     * @param   Request $request
     * @return  Array
     */
    public function createCertificateRequest(Request $request)
    {
        if ($request->ajax()) {
            $farm = Farm::find($request->farmId);

            $certificateRequest = new CertificateRequest;
            $certificateRequest->breeder_id = $request->breederId;
            $certificateRequest->farm_id = $request->farmId;
            $certificateRequest->save();

            // Return custom data
            return [
                'id'             => $certificateRequest->id,
                'farmName'       => "{$farm->name}, {$farm->province}",
                'adminName'      => '',
                'dateRequested'  => '',
                'datePayment'    => '',
                'dateDelivery'   => '',
                'receiptNo'      => '',
                'status'         => 'draft'
            ];
        }
    }

    /**
     * ------------------------------------------
     * COMMON METHODS
     * ------------------------------------------
     */

    /**
     * Get included swines and available swines to add
     * for respective certificate request
     *
     * @param   Request $request
     * @param   integer $certificateRequestId
     * @return  Collection
     */
    public function getSwinesOfCertificateRequest(Request $request, int $certificateRequestId)
    {
        if ($request->ajax()) {
            $certificateRequest = CertificateRequest::where('id', $certificateRequestId)
                ->with('certificateItems.swine.swineProperties')->first();
            $farm = Farm::find($certificateRequest->farm_id);
            $relatedSwines = $farm->swines()->with(['inspectionItem', 'swineProperties'])->get();
            $availableSwines = [];
            $includedSwines = [];

            // Transform swine data already included in the certificate request
            foreach ($certificateRequest->certificateItems as $item) {
                $swine = $item->swine;

                $includedSwines[] = [
                    'itemId'         => $item->id,
                    'swineId'        => $swine->id,
                    'breedTitle'     => $swine->breed->title,
                    'registrationNo' => $swine->registration_no,
                    'farmSwineId'    => $swine->swineProperties
                                        ->where('property_id', 24)->first()->value
                ];
            }

            // Transform swine data available to be included in the certificate request
            foreach ($relatedSwines as $swine) {
                // Only include swine that's approved by inspection
                if ($swine->inspectionItem && $swine->inspectionItem->is_approved) {
                    $availableSwines[] = [
                        'itemId'         => 0,
                        'swineId'        => $swine->id,
                        'breedTitle'     => $swine->breed->title,
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
}
