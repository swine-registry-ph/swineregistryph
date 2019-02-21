<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class GenomicsCreated extends Mailable
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
        // 'name', 'email', and 'initialPassword' keys
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
            'You now have a Genomics account!',
            'The following is your genomics user credentials:'
        ];
        $outroLines = ['Note that this is just an initial password. Make sure to change your initial password in your Genomics\' profile.'];

        return $this->view('emails.newgenomics')
                    ->subject('Swine Breed Registry PH Genomics Account')
                    ->with([
                        'level'             => 'success',
                        'introLines'        => $introLines,
                        'outroLines'        => $outroLines,
                        'name'              => $this->genomics['name'],
                        'email'             => $this->genomics['email'],
                        'initialPassword'   => $this->genomics['initialPassword'],
                        'actionText'        => 'Login',
                        'actionUrl'         => route('login')
                    ]);
    }
}
