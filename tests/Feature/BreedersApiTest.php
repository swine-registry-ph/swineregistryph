<?php

namespace Tests\Feature;

use App\Models\Breeder;
use Tests\TestCase;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class BreedersApiTest extends TestCase
{
    use DatabaseMigrations, DatabaseTransactions;

    /**
     * Initialize data needed for testing
     */
    protected function setUp()
    {
        parent::setUp();

        $this->breedersEndpoint = '/api/v1/breeders';
    }

    /**
     * Test api/breeders endpoint
     *
     * @return void
     */
    public function testBreedersEndpointIsWorking()
    {
        $breedersEndpoint = $this->breedersEndpoint;
        $response = $this->get("{$breedersEndpoint}");

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                '*' => [
                    'id',
                    'status_instance',
                    'farms'
                ]
            ]);
    }

    /**
     * Test api/breeders/{breederId} endpoint
     *
     * @return void
     */
    public function testSpecificBreederEndpointIsWorking()
    {
        $breedersEndpoint = $this->breedersEndpoint;
        $testIds = [1, 2, 3];

        foreach ($testIds as $testId) {
            $response = $this->get("{$breedersEndpoint}/{$testId}");

            $response
                ->assertStatus(200)
                ->assertJsonStructure([
                    '*' => [
                        'id',
                        'status_instance',
                        'farms'
                    ]
                ])
                ;
        }
    }
}
