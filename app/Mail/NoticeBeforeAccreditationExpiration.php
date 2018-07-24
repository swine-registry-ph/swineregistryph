<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class NoticeBeforeAccreditationExpiration extends Mailable
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
        // 'name', 'accreditationNo' , 'accreditationDate', 
        // 'beforeExpiration' & 'expiration' keys
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
        $beforeExpiration = $this->farmAccreditationDetails['beforeExpiration'];
        $expiration = $this->farmAccreditationDetails['expiration'];
        $farmDetails = 
            [
                'name'                 => $this->farmAccreditationDetails['name'],
                'accreditationNo'      => $this->farmAccreditationDetails['accreditationNo'],
                'accreditationDate'    => $this->farmAccreditationDetails['accreditationDate']
            ];
        $introLines = 
            [
                "Please be notified that it's just {$beforeExpiration} before the expiration of your breeder farm's accreditation which is on {$expiration}.",
                'The following are the details of your farm:'
            ];
        $outroLines = 
            [
                'Please settle your renewal of accreditation as soon as possible.'
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
