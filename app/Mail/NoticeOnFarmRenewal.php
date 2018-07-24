<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class NoticeOnFarmRenewal extends Mailable
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
        // 'name', 'accreditationNo' , & 'accreditationDate' keys
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
        $farmDetails = 
            [
                'name'                 => $this->farmAccreditationDetails['name'],
                'accreditationNo'      => $this->farmAccreditationDetails['accreditationNo'],
                'accreditationDate'    => $this->farmAccreditationDetails['accreditationDate']
            ];

        $introLines = 
            [
                "Your farm accreditation has been renewed already!",
                'The following are the new details of your farm:'
            ];

        $outroLines = 
            [
                ''
            ];

        return $this->view('emails.accreditationNotice')
                    ->subject('SBRPH: Farm Accreditation Renewal')
                    ->with([
                        'level'         => 'success',
                        'introLines'    => $introLines,
                        'outroLines'    => $outroLines,
                        'farmDetails'   => $farmDetails
                    ]);
    }
}
