<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class APICredentialsRevoked extends Mailable
{
    use Queueable, SerializesModels;

    protected $client;
    protected $process = 'revoke';

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
        $introLines = [
            "Client credentals for {$this->client['name']} revoked.",
            'The following credentials are revoked:'
        ];
        $outroLines = [];

        return $this->view('emails.apicredentials')
                    ->subject('Breed Registry API Credentials Revoked')
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
