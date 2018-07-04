<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class BreederCreated extends Mailable
{
    use Queueable, SerializesModels;

    protected $breeder;

    /**
     * Create a new message instance.
     *
     * @param  array $breeder
     * @return void
     */
    public function __construct($breeder)
    {
        // $breeder is an associative array that should consist of
        // 'email', and 'initialPassword' keys
        $this->breeder = $breeder;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $introLines = [
            'You now have a Breeder account!',
            'The following is your breeder user credentials:'
        ];
        $outroLines = ['Note that this is just an initial password. Make sure to change your initial password in your Breeder\'s profile.'];

        return $this->view('emails.newbreeder')
                    ->subject('Swine Breed Registry PH Breeder Account')
                    ->with([
                        'level'             => 'success',
                        'introLines'        => $introLines,
                        'outroLines'        => $outroLines,
                        'name'              => $this->breeder['name'],
                        'email'             => $this->breeder['email'],
                        'initialPassword'   => $this->breeder['initialPassword'],
                        'actionText'        => 'Login',
                        'actionUrl'         => route('login')
                    ]);
    }
}
