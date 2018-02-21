<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class APICredentialsUpdated extends Mailable
{
    use Queueable, SerializesModels;

    protected $client;
    protected $process = 'update';

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
            'Client credentials updated.',
            'Here\'s the updated credentials:'
        ];
        $outroLines = [];

        return $this->view('emails.apicredentials')
                    ->subject('Breed Registry API Credentials Updated')
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
