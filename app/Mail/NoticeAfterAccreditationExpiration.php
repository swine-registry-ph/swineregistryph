<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class NoticeAfterAccreditationExpiration extends Mailable
{
    use Queueable, SerializesModels;

    protected $farmAccreditationDetails;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($farmAccreditationDetails)
    {
        // $farmDetails is an associative array that should consist of
        // 'name', 'accreditationNo' , 'accreditationDate',
        // 'afterExpiration', 'expiration',
        // & 'gracePeriod' keys
        $this->farmAccreditationDetails = $farmAccreditationDetails;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        // Data initialization
        $afterExpiration = $this->farmAccreditationDetails['afterExpiration'];
        $expiration = $this->farmAccreditationDetails['expiration'];
        $gracePeriod = $this->farmAccreditationDetails['gracePeriod'];
        $farmDetails = 
            [
                'name'                  => $this->farmAccreditationDetails['name'],
                'accreditationNo'      => $this->farmAccreditationDetails['accreditationNo'],
                'accreditationDate'    => $this->farmAccreditationDetails['accreditationDate']
            ];

        $introLines = 
            [
                "Please be notified that it's already {$afterExpiration} after the expiration of your breeder farm's accreditation which was on {$expiration}.",
                'The following are the details of your farm:'
            ];

        $outroLines = 
            [
                "Please settle your renewal of accreditation within the grace period of 3 months which ends on {$gracePeriod}",
                'Note that failure to renew the farm\'s accreditation will lead to its suspension in the system
                 thus, being unable to use it for swine registration.'
            ];

        return $this->view('emails.accreditationNotice')
                    ->subject('SBRPH: Farm Accreditation Expiration Grace Period')
                    ->with([
                        'level'         => 'success',
                        'introLines'    => $introLines,
                        'outroLines'    => $outroLines,
                        'farmDetails'   => $farmDetails
                    ]);
    }
}
