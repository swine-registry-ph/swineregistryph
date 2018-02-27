<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class APICredentialsCreated extends Mailable
{
    use Queueable, SerializesModels;

    protected $client;
    protected $process = 'create';

    /**
     * Create a new message instance.
     *
     * @param  array $client
     * @return void
     */
    public function __construct($client)
    {
        // $client is an associative array that should consist of
        // 'name', 'id', 'secret', and 'redirect' keys
        $this->client = $client;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $introLines = ['Client API credentials successfully created!'];
        $outroLines = ['Make sure to store your credentials in a safe location.'];

        return $this->view('emails.apicredentials')
                    ->subject('Breed Registry API Credentials')
                    ->with([
                        'level' => 'success',
                        'process' => $this->process,
                        'introLines' => $introLines,
                        'outroLines' => $outroLines,
                        'clientName' => $this->client['name'],
                        'clientId' => $this->client['id'],
                        'clientSecret' => $this->client['secret'],
                        'clientRedirect' => $this->client['redirect']
                    ]);
    }
}
