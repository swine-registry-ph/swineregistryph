<?php

namespace App\Http\Controllers;

use App\Models\CertificateItem;
use App\Models\CertificateRequest;
use App\Models\Farm;
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
                'addSwinesToCertificateRequest',
                'removeCertificateItem',
                // 'requestForApproval'
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
     * Show Breeder's certificate requests
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
     * Add swines to respective certificate request. Adding swines
     * is the same as adding certificate items to 
     * respective certificate request
     *
     * @param   Request $request
     * @param   integer $certificateRequestId
     * @return  Collection
     */
    public function addSwinesToCertificateRequest(Request $request, int $certificateRequestId)
    {
        if ($request->ajax()) {
            $certificateRequest = CertificateRequest::find($certificateRequestId);
            $certificateItemsArray = [];
            $includedSwines = [];

            foreach ($request->swineIds as $swineId) {
                $certificateItemsArray[] = [
                    'swine_id' => $swineId
                ];
            }

            $certificateRequest->certificateItems()->createMany($certificateItemsArray);

            // Return updated included and available swine
            // for the respective certificate request
            return $this->getSwinesOfCertificateRequest($request, $certificateRequestId);
        }
    }

    /**
     * Remove certificate item from respective certificate request.
     * Removing a certificate item is the same as removing
     * a swine from respective certificate request
     *
     * @param   Request $request
     * @param   integer $certificateRequestId
     * @param   integer $itemId
     * @return  Collection
     */
    public function removeCertificateItem(Request $request, int $certificateRequestId, int $itemId)
    {
        if ($request->ajax()) {
            $certificateRequestItem = CertificateItem::find($itemId);
            $certificateRequestItem->delete();

            // Return updated included and available swine
            // for the respective certificate request
            return $this->getSwinesOfCertificateRequest($request, $certificateRequestId);
        }
    }

    /**
     * Request certificate request for approval
     *
     * @param  Request $request
     * @param  integer $certificateRequestId
     * @return JSON
     */
    public function requestForApproval(Request $request, int $certificateRequestId)
    {
        if ($request->ajax()) {
            $certificateRequest = CertificateRequest::find($certificateRequestId);

            // Check first if there are items to request
            if (count($certificateRequest->certificateItems) < 1) 
                return ['requested' => false];

            if ($request->receiptNo == '') 
                return ['requested' => false];

            $certificateRequest->date_requested = Carbon::now()->format('Y-m-d');
            $certificateRequest->status = 'requested';
            $certificateRequest->receipt_no = $request->receiptNo;
            $certificateRequest->save();

            return [
                'dateRequested' => $this->changeDateFormat($certificateRequest->date_requested),
                'receiptNo'     => $certificateRequest->receipt_no,
                'requested'     => true
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
                // and not included in other certificate request
                if ($swine->inspectionItem && $swine->inspectionItem->is_approved) {
                    if ($swine->certificateItem) continue;
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
