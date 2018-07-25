<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class NoticeOnAccreditationExpiration extends Mailable
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
        // $farmAccreditationDetails is an associative array that should consist of
        // 'name', 'accreditationNo' , 'accreditationDate', & 'gracePeriod' keys
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
        $gracePeriod = $this->farmAccreditationDetails['gracePeriod'];
        $farmDetails = 
            [
                'name'                 => $this->farmAccreditationDetails['name'],
                'accreditationNo'      => $this->farmAccreditationDetails['accreditationNo'],
                'accreditationDate'    => $this->farmAccreditationDetails['accreditationDate']
            ];
        $introLines = 
            [
                "Please be notified that your breeder farm's accreditation has expired.",
                'The following are the details of your farm:'
            ];
        $outroLines = 
            [
                "We will be giving a 3-month grace period ({$gracePeriod}) to settle the renewal of your accreditation.",
                'Note that failure to renew the farm\'s accreditation will lead to its suspension in the system
                 thus, being unable to use it for swine registration.'
            ];

        return $this->view('emails.accreditationNotice')
                    ->subject('SBRPH: Farm Accreditation Expiration')
                    ->with([
                        'level'         => 'success',
                        'introLines'    => $introLines,
                        'outroLines'    => $outroLines,
                        'farmDetails'   => $farmDetails
                    ]);
    }
}
