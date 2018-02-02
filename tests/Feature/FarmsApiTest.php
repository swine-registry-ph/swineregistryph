<?php

namespace Tests\Feature;

use App\Models\Farm;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class FarmsApiTest extends TestCase
{
    use DatabaseMigrations, DatabaseTransactions;

    /**
     * Initialize data needed for testing
     */
    protected function setUp()
    {
        parent::setUp();

        $this->farmsEndpoint = '/api/v1/farms';
    }

    /**
     * Test api/farms endpoint
     *
     * @return void
     */
    public function testFarmsEndPointIsWorking()
    {
        $farmsEndpoint = $this->farmsEndpoint;
        $response = $this->get("{$farmsEndpoint}");

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                '*' => [
                    'id',
                    'breeder_id',
                    'name',
                    'address_line1',
                    'address_line2',
                    'province',
                    'type',
                    'created_at',
                    'updated_at',
                    'swines'
                ]
            ]);
    }

    /**
     * Test api/farms/{farmId} endpoint
     *
     * @return void
     */
    public function testSpecificFarmEndpointIsWorking()
    {
        $farmsEndpoint = $this->farmsEndpoint;
        $testIds = [1, 2, 3];

        foreach ($testIds as $testId) {
            $response = $this->get("{$farmsEndpoint}/{$testId}");

            $response
                ->assertStatus(200)
                ->assertJsonStructure([
                    '*' => [
                        'id',
                        'breeder_id',
                        'name',
                        'address_line1',
                        'address_line2',
                        'province',
                        'type',
                        'created_at',
                        'updated_at',
                        'swines'
                    ]
                ]);
        }
    }
}
