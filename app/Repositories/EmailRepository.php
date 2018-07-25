<?php

namespace App\Repositories;

use App\Mail\NoticeAfterAccreditationExpiration;
use App\Mail\NoticeBeforeAccreditationExpiration;
use App\Mail\NoticeOnAccreditationExpiration;
use App\Mail\NoticeOnFarmSuspension;
use App\Models\Farm;
use Carbon\Carbon;

use Log;
use Mail;

class EmailRepository
{

    /**
     * Notify breeder users of their accreditation 
     * expiration status through email
     *
     * @return void
     */
    public function sendAccreditationExpirationNotice()
    {
        // Check for Farm accreditation date expirations
        $farms = Farm::all();
        $today = Carbon::today();
        
        foreach ($farms as $farm) {
            // Check each farm's accreditation expiration

            // Data iniialization
            $parsedDate        = explode("-",$farm->farm_accreditation_date);
            $accreditationDate = $this->getMidnightDate('accreditation', $parsedDate);
            $expirationDate    = $this->getMidnightDate('expiration', $parsedDate);
            $twoMonthsBeforeExpirationDate = $this->getMidnightDate(
                'two-months-b-expiration', 
                $parsedDate
            );

            if ($today < $expirationDate) {
                /**
                 * Before expiration
                 */
                $isTwoMonthsBeforeExp = ($today == $twoMonthsBeforeExpirationDate);
                $isTwoWeeksBeforeExp  = ($today->diffInDays($expirationDate, false) === 14);
                $isThreeDaysBeforeExp = ($today->diffInDays($expirationDate, false) === 3);
                $isOneDayBeforeExp    = ($today->diffInDays($expirationDate, false) === 1);

                if (
                    $isTwoMonthsBeforeExp || 
                    $isTwoWeeksBeforeExp  ||
                    $isThreeDaysBeforeExp ||
                    $isOneDayBeforeExp
                ) {
                    // Check if today is 2mos, 2wks, 3d, or 1 day before expiration date
                    $breederUser = $farm->breeder->users()->first();

                    $beforeExpirationPhrase = $this->getNoticePhrase(
                        $isTwoMonthsBeforeExp,
                        $isTwoWeeksBeforeExp,
                        $isThreeDaysBeforeExp,
                        $isOneDayBeforeExp                             
                    );

                    $farmAccreditationDetails = [
                        'name'              => $farm->name,
                        'accreditationNo'   => $farm->farm_accreditation_no,
                        'accreditationDate' => $accreditationDate->format('F d, Y'),
                        'beforeExpiration'  => $beforeExpirationPhrase,
                        'expiration'        => $expirationDate->format('F d, Y')
                    ];

                    // Send notice before expiration email
                    Mail::to($breederUser->email)->queue(
                        new NoticeBeforeAccreditationExpiration($farmAccreditationDetails)
                    );
                }

            } else {  
                /**
                 * After expiration
                 */
                $gracePeriodDate = $this->getMidnightDate('grace', $parsedDate);
                $twoMonthsBeforeGracePeriodDate = $this->getMidnightDate(
                    'two-months-b-grace', 
                    $parsedDate
                );

                $isTwoMonthsBeforeGracePrd = ($today == $twoMonthsBeforeGracePeriodDate);
                $isTwoWeeksBeforeGracePrd  = ($today->diffInDays($gracePeriodDate, false) === 14);
                $isThreeDaysBeforeGracePrd = ($today->diffInDays($gracePeriodDate, false) === 3);
                $isOneDayBeforeGracePrd    = ($today->diffInDays($gracePeriodDate, false) === 1);

                if($today->diffInDays($expirationDate, false) === -1) {
                    // Check if today is 1 day after expiration date
                    $breederUser = $farm->breeder->users()->first();

                    $farmAccreditationDetails = [
                        'name'              => $farm->name,
                        'accreditationNo'   => $farm->farm_accreditation_no,
                        'accreditationDate' => $accreditationDate->format('F d, Y'),
                        'gracePeriod'       => $gracePeriodDate->format('F d, Y'),
                    ];

                    // Send notice of expiration email
                    Mail::to($breederUser->email)->queue(
                        new NoticeOnAccreditationExpiration($farmAccreditationDetails)
                    );
                    
                } elseif (
                    $isTwoMonthsBeforeGracePrd ||
                    $isTwoWeeksBeforeGracePrd  ||
                    $isThreeDaysBeforeGracePrd ||
                    $isOneDayBeforeGracePrd
                ) {
                    // Check if today is 2mos, 2wks, 3d, or 1 day before grace period date
                    $breederUser = $farm->breeder->users()->first();

                    $afterExpirationPhrase = $this->getNoticePhrase(
                        $isTwoMonthsBeforeGracePrd,
                        $isTwoWeeksBeforeGracePrd,
                        $isThreeDaysBeforeGracePrd,
                        $isOneDayBeforeGracePrd                             
                    );

                    $farmAccreditationDetails = [
                        'name'              => $farm->name,
                        'accreditationNo'   => $farm->farm_accreditation_no,
                        'accreditationDate' => $accreditationDate->format('F d, Y'),
                        'afterExpiration'   => $afterExpirationPhrase,
                        'expiration'        => $expirationDate->format('F d, Y'),
                        'gracePeriod'       => $gracePeriodDate->format('F d, Y')
                    ];

                    // Send notice before grace period finishes email
                    Mail::to($breederUser->email)->queue(
                        new NoticeAfterAccreditationExpiration($farmAccreditationDetails)
                    );

                } elseif ($today->diffInDays($gracePeriodDate, false) === -1) {
                    // Check if today is 1 day after grace period date
                    $breederUser = $farm->breeder->users()->first();

                    $farmAccreditationDetails = [
                        'name'              => $farm->name,
                        'accreditationNo'   => $farm->farm_accreditation_no,
                        'accreditationDate' => $accreditationDate->format('F d, Y')
                    ];

                    // Suspend farm
                    $farm->is_suspended = 1;
                    $farm->save();

                    // Send notice on suspension of farm email
                    Mail::to($breederUser->email)->queue(
                        new NoticeOnFarmSuspension($farmAccreditationDetails)
                    );

                }

            }
        }
    }

    /**
     * Create Midnight Carbon Date for requested type
     *
     * @param  string $type
     * @param  array  $parsedDate
     * @return Carbon
     */
    private function getMidnightDate($type, $parsedDate)
    {
        switch ($type) {
            case 'accreditation':
                
                return Carbon::create(
                    $parsedDate[0], 
                    $parsedDate[1], 
                    $parsedDate[2], 
                    0, 
                    0, 
                    0
                );
            
            case 'expiration':

                return Carbon::create(
                    $parsedDate[0], 
                    $parsedDate[1], 
                    $parsedDate[2], 
                    0, 
                    0, 
                    0
                )->addYear();
            
            case 'two-months-b-expiration':
            
                return Carbon::create(
                    $parsedDate[0], 
                    $parsedDate[1], 
                    $parsedDate[2], 
                    0, 
                    0, 
                    0
                )->addYear()->subMonths(2);

            case 'grace':
            
                return Carbon::create(
                    $parsedDate[0], 
                    $parsedDate[1], 
                    $parsedDate[2], 
                    0, 
                    0, 
                    0
                )->addYear()->addMonths(3);

            case 'two-months-b-grace':
            
                return Carbon::create(
                    $parsedDate[0], 
                    $parsedDate[1], 
                    $parsedDate[2], 
                    0, 
                    0, 
                    0
                )->addYear()->addMonths(1);

            default:
                break;
        }
    }

    /**
     * Get appropriate time notice phrase needed for email
     *
     * @param  boolean $twoMs
     * @param  boolean $twoWks
     * @param  boolean $threeDys
     * @param  boolean $oneDy
     * @return string
     */
    private function getNoticePhrase($twoMs, $twoWks, $threeDys, $oneDy)
    {
        if($twoMs) return '2 months';
        elseif($twoWks) return '2 weeks';
        elseif($threeDys) return '3 days';
        elseif($oneDy) return '1 day';
    }
}