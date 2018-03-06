<?php

namespace App\Http\Controllers;

use App\Mail\APICredentialsCreated;
use App\Mail\APICredentialsUpdated;
use App\Mail\APICredentialsRevoked;
use Illuminate\Http\Request;
use Laravel\Passport\Http\Controllers\ClientController;

use Mail;

class PassportClientOverrideController extends ClientController
{
    /**
     * Override Laravel Passport's store method
     * to include sending of email
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validation->make($request->all(), [
            'name' => 'required|max:255',
            'redirect' => 'required|url',
        ])->validate();


        $client = $this->clients->create(
            $request->user()->getKey(), $request->name, $request->redirect
        )->makeVisible('secret');

        // Email admin user
        if($client) {
            $this->sendEmail($request, $client, 'store');
        }

        return $client;
    }

    /**
     * Override Laravel Passport's update method
     * to include sending of email
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $clientId
     * @return \Illuminate\Http\Response|\Laravel\Passport\Client
     */
    public function update(Request $request, $clientId)
    {
        $client = $this->clients->findForUser($clientId, $request->user()->getKey());

        if (! $client) {
            return new Response('', 404);
        }

        $this->validation->make($request->all(), [
            'name' => 'required|max:255',
            'redirect' => 'required|url',
        ])->validate();

        $updatedClient = $this->clients->update(
            $client, $request->name, $request->redirect
        );

        // Email admin user
        if($updatedClient){
            $this->sendEmail($request, $updatedClient, 'update');
        }

        return $updatedClient;
    }

    /**
     * Override Laravel Passport's destroy method
     * to include sending of email
     *
     * @param  Request  $request
     * @param  string  $clientId
     * @return Response
     */
    public function destroy(Request $request, $clientId)
    {
        $client = $this->clients->findForUser($clientId, $request->user()->getKey());

        if (! $client) {
            return new Response('', 404);
        }

        // Email admin User
        $this->sendEmail($request, $client, 'destroy');

        $this->clients->delete(
            $client
        );
    }

    /**
     * Email admin user of actions made in
     * managing API credentials
     *
     * @param  Request $request
     * @param  array $client
     * @param  string $process
     * @return void
     */
    private function sendEmail($request, $client, $process)
    {
        // Prepare data needed
        $clientDetails = [];
        $clientDetails['name'] = $client->name;
        $clientDetails['id'] = $client->id;
        $clientDetails['secret'] = $client->secret;
        $clientDetails['redirect'] = $client->redirect;

        // Send email according to process
        switch ($process) {
            case 'store':
                Mail::to($request->user())->queue(new APICredentialsCreated($clientDetails));
                break;

            case 'update':
                Mail::to($request->user())->queue(new APICredentialsUpdated($clientDetails));
                break;

            case 'destroy':
                Mail::to($request->user())->queue(new APICredentialsRevoked($clientDetails));
                break;

            default:
                break;
        }
    }
}
