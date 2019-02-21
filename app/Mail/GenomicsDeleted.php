<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class GenomicsDeleted extends Mailable
{
    use Queueable, SerializesModels;

    protected $genomics;

    /**
     * Create a new message instance.
     *
     * @param  array $genomics
     * @return void
     */
    public function __construct($genomics)
    {
        // $genomics is an associative array that should consist of
        // 'name', 'email' keys
        $this->genomics = $genomics;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $introLines = [
            'Your Genomics account was deleted!',
            'The following is your deleted genomics user credentials:'
        ];
        $outroLines = ['Contact administrator for more queries.'];

        return $this->view('emails.genomicsNotice')
                    ->subject('Swine Breed Registry PH Genomics Account Deleted')
                    ->with([
                        'level'             => 'success',
                        'introLines'        => $introLines,
                        'outroLines'        => $outroLines,
                        'name'              => $this->genomics['name'],
                        'email'             => $this->genomics['email']
                    ]);
    }
}
