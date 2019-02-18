<?php

namespace Tests\Feature;

use Artisan;
use App\Models\Breeder;
use App\Models\Farm;
use App\Models\CertificateRequest;
use App\Models\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class ManageCertificateRequestsTest extends TestCase
{
    use DatabaseMigrations, DatabaseTransactions;

    protected $breederUser;

    /**
     * Initialize data needed for testing
     */
    protected function setUp()
    {
        parent::setUp();

        Artisan::call('db:seed');

        $this->breederUser = factory(User::class)->create();

        // Create Breeder Profile
        $breeder = factory(Breeder::class)->create();
        $breeder->users()->save($this->breederUser);
    }

    /**
     * Test if creation of certificate request is successful
     *
     * @return void
     */
    public function testBreederCreateCertificateRequest()
    {
        // Imitate AJAX request
        $response = $this->actingAs($this->breederUser)
            ->withHeaders([
                'HTTP_X-Requested-With' => 'XMLHttpRequest'
            ])
            ->json('POST', '/breeder/certificates',
                [
                    'breederId' => 1,
                    'farmId'    => 1,
                ]
            );

        $response
            ->assertStatus(200)
            ->assertJson([
                'id'             => 1,
                'adminName'      => '',
                'dateRequested'  => '',
                'datePayment'    => '',
                'dateDelivery'   => '',
                'receiptNo'      => '',
                'status'         => 'draft'                   
            ]);
    }
}
