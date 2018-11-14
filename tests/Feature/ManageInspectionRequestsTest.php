<?php

namespace Tests\Feature;

use Artisan;
use App\Models\Breeder;
use App\Models\Farm;
use App\Models\InspectionRequest;
use App\Models\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class ManageInspectionRequestsTest extends TestCase
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
     * Test if creation of inspection request is successful
     *
     * @return void
     */
    public function testBreederCreateInspectionRequest()
    {
        // Imitate AJAX request
        $response = $this->actingAs($this->breederUser)
            ->withHeaders([
                'HTTP_X-Requested-With' => 'XMLHttpRequest'
            ])
            ->json('POST', '/breeder/inspections',
                [
                    'breederId'         => 1,
                    'farmId'            => 1,
                ]
            );

        $response
            ->assertStatus(200)
            ->assertJson([
                'id'             => 1,
                'evaluatorName'  => '',
                'dateRequested'  => '',
                'dateInspection' => '',
                'dateApproved'   => '',
                'status'         => 'draft'                   
            ]);
    }
}
