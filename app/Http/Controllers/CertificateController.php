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
use Image;
use PDF;

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
                'requestForApproval'
            ]);
        
        $this->middleware('role:admin')
            ->only([
                'adminViewAll',
                'markForDelivery'
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
                'id'               => $certificateRequest->id,
                'farmName'         => "{$farm->name}, {$farm->province}",
                'adminName'        => $adminName,
                'dateRequested'    => $this->changeDateFormat($certificateRequest->date_requested),
                'dateDelivery'     => $this->changeDateFormat($certificateRequest->date_delivery),
                'receiptNo'        => $certificateRequest->receipt_no,
                'paymentPhotoName' => $certificateRequest->payment_photo_name,
                'status'           => $certificateRequest->status
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
                'id'               => $certificateRequest->id,
                'farmName'         => "{$farm->name}, {$farm->province}",
                'adminName'        => '',
                'dateRequested'    => '',
                'dateDelivery'     => '',
                'receiptNo'        => '',
                'paymentPhotoName' => '',
                'status'           => 'draft'
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

            if (!$request->paymentPhoto)
                return [
                    'requested' => false,
                    'message'   => 'No Photo included.'
                ];

            $imageData = $request->paymentPhoto;
            $photoName = 'request_' 
                . uniqid($certificateRequestId) 
                . '.' 
                . explode('/', explode(
                        ':', 
                        substr($imageData, 0, strpos($imageData, ';'))
                    )[1])[1];
            $image = Image::make($imageData)
                ->save(public_path('storage/images/payments/') . $photoName);

            $certificateRequest->date_requested = Carbon::now()->format('Y-m-d');
            $certificateRequest->status = 'requested';
            $certificateRequest->payment_photo_name = $photoName;
            $certificateRequest->save();

            return [
                'dateRequested'    => $this->changeDateFormat($certificateRequest->date_requested),
                'paymentPhotoName' => $certificateRequest->payment_photo_name,
                'requested'        => true
            ];
        }
    }

    /**
     * ------------------------------------------
     * ADMIN-SPECIFIC METHODS
     * ------------------------------------------
     */

    /**
     * Show requested inspections to Administrator
     *
     * @return  View
     */
    public function adminViewAll(Request $request)
    {
        $certificateRequests = CertificateRequest::whereIn(
                'status', 
                ['requested', 'on_delivery']
            )->get();
        $customCertificateRequests = [];
        $currentFilterOptions = [
            'status' => []
        ];

        if($request->status) {
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
                'id'               => $certificateRequest->id,
                'farmName'         => "{$farm->name}, {$farm->province}",
                'adminName'        => $adminName,
                'dateRequested'    => $this->changeDateFormat($certificateRequest->date_requested),
                'dateDelivery'     => $this->changeDateFormat($certificateRequest->date_delivery),
                'receiptNo'        => $certificateRequest->receipt_no,
                'paymentPhotoName' => $certificateRequest->payment_photo_name,
                'status'           => $certificateRequest->status
            ];
        }

        $customCertificateRequests = collect($customCertificateRequests);
        $currentFilterOptions = collect($currentFilterOptions);

        return view('users.admin.certificateRequests', 
            compact(
                'customCertificateRequests',
                'currentFilterOptions'
            )
        );
    }

    /**
     * Mark Certificate Request for Delivery
     *
     * @param   Request $request
     * @param   integer $certificateRequestId
     * @return  JSON
     */
    public function markForDelivery(Request $request, int $certificateRequestId)
    {
        if ($request->ajax()) {
            $certificateRequest = CertificateRequest::find($certificateRequestId);
            $certificateRequest->date_delivery = Carbon::createFromFormat(
                    'F d, Y', 
                    $request->dateDelivery
                )->toDateString();
            $certificateRequest->receipt_no = $request->receiptNo;
            $certificateRequest->status = 'on_delivery';
            $certificateRequest->save();
            
            return [
                'dateDelivery' => $this->changeDateFormat(
                        $certificateRequest->date_delivery  
                    ),
                'receiptNo' => $certificateRequest->receipt_no,
                'marked' => true
            ];
        }
    }

    /**
     * Download registry certificates
     *
     * @param  Request $request
     * @param  integer $certificateRequestId
     * @return PDF
     */
    public function viewRegistryCertificates(
        Request $request, 
        int $certificateRequestId
    ) {
        
        $certificateRequest = CertificateRequest::find($certificateRequestId);

        if ($certificateRequest->status != 'on_delivery') {
            return response('Certificate Request must be on delivery.', 400);
        }

        $items = $certificateRequest
            ->certificateItems()
            ->with('swine.swineProperties', 'swine.farm')
            ->get();

        if (empty($items)) {
            return response('Certificate Request has no swines', 404);
        }

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
        PDF::SetTitle("Certificate_Request_{$certificateRequest->id}");

        foreach ($items as $item) {
            $swine = $item->swine;
            $swineInfo = $this->getSwineInfo($swine);

            $view = \View::make('users.admin._certificate', compact('swineInfo'));
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

            
            PDF::AddPage();
            PDF::WriteHTML($html, true, false, true, false, '');
        }

        PDF::Output("Certificate_Request_{$certificateRequest->id}.pdf");
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
            'labResultNo'               => $this->getSwinePropValue($swine, 25),
            'selectionIndex'            => $this->getSwinePropValue($swine, 28)
        ];
    }
}
