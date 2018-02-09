<?php

namespace Tests\Feature;

use App\Models\Breeder;
use Laravel\Passport\ClientRepository;
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
        $this->clientRepository = new ClientRepository;
        $this->accessToken = $this->getAccessToken();
    }

    /**
     * Make sure only those who have access token
     * can access the api/v1/breeders endpoint
     *
     * @return void
     */
    public function testBreedersEndpointRequiresAccessToken()
    {
        $breedersEndpoint = $this->breedersEndpoint;
        $response = $this->get("{$breedersEndpoint}");

        $response->assertStatus(302);
    }

    /**
     * Make sure only those who have access token can access
     * the api/v1/breeders/{breederId} endpoint
     *
     * @return void
     */
    public function testSpecificBreederEndpointRequiresAccessToken()
    {
        $breedersEndpoint = $this->breedersEndpoint;
        $response = $this->get("{$breedersEndpoint}/1");

        $response->assertStatus(302);
    }

    /**
     * Test api/v1/breeders endpoint
     *
     * @return void
     */
    public function testBreedersEndpointIsWorking()
    {
        $breedersEndpoint = $this->breedersEndpoint;
        $response = $this->get("{$breedersEndpoint}", [
            'Authorization' => "Bearer {$this->accessToken}"
        ]);

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
     * Test api/v1/breeders/{breederId} endpoint
     *
     * @return void
     */
    public function testSpecificBreederEndpointIsWorking()
    {
        $breedersEndpoint = $this->breedersEndpoint;
        $testIds = [1, 2, 3];

        foreach ($testIds as $testId) {
            $response = $this->get("{$breedersEndpoint}/{$testId}", [
                'Authorization' => "Bearer {$this->accessToken}"
            ]);

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
