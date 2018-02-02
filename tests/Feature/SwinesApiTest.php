<?php

namespace Tests\Feature;

use App\Models\Swine;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class SwinesApiTest extends TestCase
{
    use DatabaseMigrations, DatabaseTransactions;

    /**
     * Initialize data needed for testing
     */
    protected function setUp()
    {
        parent::setUp();

        $this->swinesEndpoint = '/api/v1/swines';
    }

    /**
     * Test api/swines endpoint
     *
     * @return void
     */
    public function testSwinesEndpointIsWorking()
    {
        $swinesEndpoint = $this->swinesEndpoint;
        $response = $this->get("{$swinesEndpoint}");

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                '*' => [
                    'id',
                    'collection_id',
                    'breed_id',
                    'farm_id',
                    'gpSire_id',
                    'gpDam_id',
                    'primaryPhoto_id',
                    'registration_no',
                    'date_registered',
                    'created_at',
                    'udpated_at'
                ]
            ]);
    }

    public function testSpecificSwineEndpointIsWorking()
    {
        $swinesEndpoint = $this->swinesEndpoint;
        $testIds = [1, 2, 3];

        foreach ($testIds as $testId) {
            $response = $this->get("{$swinesEndpoint}/{$testId}");

            $response
                ->assertStatus(200)
                ->assertJsonStructure([
                    '*' => [
                        'id',
                        'collection_id',
                        'breed_id',
                        'farm_id',
                        'gpSire_id',
                        'gpDam_id',
                        'primaryPhoto_id',
                        'registration_no',
                        'date_registered',
                        'created_at',
                        'udpated_at'
                    ]
                ]);
        }
    }
}
