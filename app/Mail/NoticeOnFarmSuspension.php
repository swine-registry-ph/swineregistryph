<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class NoticeOnFarmSuspension extends Mailable
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
                'name'                  => $this->farmAccreditationDetails['name'],
                'accreditationNo'      => $this->farmAccreditationDetails['accreditationNo'],
                'accreditationDate'    => $this->farmAccreditationDetails['accreditationDate']
            ];

        $introLines = 
            [
                'Please be notified that your farm has been suspended in our system.',
                'The following are the details of your farm:'
            ];

        $outroLines = 
            [
                'Your farm cannot be used to register swine unless you settle its renewal of accreditation.',
                'Kindly contact the administrator after settling your renewal.'
            ];

        return $this->view('emails.accreditationNotice')
                    ->subject('SBRPH: Farm Suspension')
                    ->with([
                        'level'         => 'success',
                        'introLines'    => $introLines,
                        'outroLines'    => $outroLines,
                        'farmDetails'   => $farmDetails
                    ]);
    }
}
