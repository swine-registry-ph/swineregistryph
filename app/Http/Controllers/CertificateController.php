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
