<?php

namespace Tests\Feature;

use Artisan;
use App\Models\Farm;
use Laravel\Passport\ClientRepository;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class FarmsApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Initialize data needed for testing
     */
    protected function setUp()
    {
        parent::setUp();

        Artisan::call('db:seed');

        $this->farmsEndpoint = '/api/v1/farms';
        $this->clientRepository = new ClientRepository;
        $this->accessToken = $this->getAccessToken();
    }

    /**
     * Make sure only those who have access token
     * can access the api/v1/farms endpoint
     *
     * @return void
     */
    public function testFarmsEndpointRequiresAccessToken()
    {
        $farmsEndpoint = $this->farmsEndpoint;
        $response = $this->get("{$farmsEndpoint}");

        $response->assertStatus(302);
    }

    /**
     * Make sure only those who have access token can
     * access the api/v1/farms/{farmId} endpoint
     *
     * @return void
     */
    public function testSpecificFarmEndpointRequiresAccessToken()
    {
        $farmsEndpoint = $this->farmsEndpoint;
        $response = $this->get("{$farmsEndpoint}/1");

        $response->assertStatus(302);
    }

    /**
     * Test api/v1/farms endpoint
     *
     * @return void
     */
    public function testFarmsEndPointIsWorking()
    {
        $farmsEndpoint = $this->farmsEndpoint;
        $response = $this->get("{$farmsEndpoint}", [
            'Authorization' => "Bearer {$this->accessToken}"
        ]);

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
                    'province_code',
                    'farm_code',
                    'farm_accreditation_no',
                    'created_at',
                    'updated_at',
                    'swines'
                ]
            ]);
    }

    /**
     * Test api/v1/farms/{farmId} endpoint
     *
     * @return void
     */
    public function testSpecificFarmEndpointIsWorking()
    {
        $farmsEndpoint = $this->farmsEndpoint;
        $testIds = [1, 2, 3];

        foreach ($testIds as $testId) {
            $response = $this->get("{$farmsEndpoint}/{$testId}", [
                'Authorization' => "Bearer {$this->accessToken}"
            ]);

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
                        'province_code',
                        'farm_code',
                        'farm_accreditation_no',
                        'created_at',
                        'updated_at',
                        'swines'
                    ]
                ]);
        }
    }

    /**
     * Make Client id and secret through Client Credentials
     * Grant and get its access token
     *
     * @return string
     */
    private function getAccessToken()
    {
        $client = $this->clientRepository->create(
            1, 'SwineCart Application', 'http://localhost'
        );

        $response = $this->post("/oauth/token", [
            'grant_type' => 'client_credentials',
            'client_id' => $client->id,
            'client_secret' => $client->secret
        ]);

        return json_decode((string) $response->content(), true)['access_token'];
    }
}
