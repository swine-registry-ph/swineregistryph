<?php

namespace Tests\Feature;

use Artisan;
use App\Models\Swine;
use Laravel\Passport\ClientRepository;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class SwinesApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Initialize data needed for testing
     */
    protected function setUp()
    {
        parent::setUp();

        Artisan::call('db:seed');

        $this->swinesEndpoint = '/api/v1/swines';
        $this->clientRepository = new ClientRepository;
        $this->accessToken = $this->getAccessToken();
    }

    /**
     * Make sure only those who have access token
     * can access the api/v1/swines endpoint
     *
     * @return void
     */
    public function testSwinesEndpointRequiresAccessToken()
    {
        $swinesEndpoint = $this->swinesEndpoint;
        $response = $this->get("{$swinesEndpoint}");

        $response->assertStatus(302);
    }

    /**
     * Make sure only those who have access token can
     * access the api/v1/swines/{swineId} endpoint
     *
     * @return void
     */
    public function testSpecificSwineEndpointRequiresAccessToken()
    {
        $swinesEndpoint = $this->swinesEndpoint;
        $response = $this->get("{$swinesEndpoint}/1");

        $response->assertStatus(302);
    }

    /**
     * Test api/v1/swines endpoint
     *
     * @return void
     */
    public function testSwinesEndpointIsWorking()
    {
        $swinesEndpoint = $this->swinesEndpoint;
        $response = $this->get("{$swinesEndpoint}", [
            'Authorization' => "Bearer {$this->accessToken}"
        ]);

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                '*' => [
                    'id',
                    'breeder_id',
                    'breed_id',
                    'farm_id',
                    'gpSire_id',
                    'gpDam_id',
                    'sidePhoto_id',
                    'frontPhoto_id',
                    'backPhoto_id',
                    'topPhoto_id',
                    'registration_no',
                    'date_registered',
                    'swinecart',
                    'created_at',
                    'updated_at'
                ]
            ]);
    }

    /**
     * Test api/v1/swines/{swineId} endpoint
     *
     * @return void
     */
    public function testSpecificSwineEndpointIsWorking()
    {
        $swinesEndpoint = $this->swinesEndpoint;
        $testIds = [1, 4, 7];

        foreach ($testIds as $testId) {
            $response = $this->get("{$swinesEndpoint}/{$testId}", [
                'Authorization' => "Bearer {$this->accessToken}"
            ]);

            $response
                ->assertStatus(200)
                ->assertJsonStructure([
                    'id',
                    'breeder_id',
                    'breed_id',
                    'farm_id',
                    'gpSire_id',
                    'gpDam_id',
                    'sidePhoto_id',
                    'frontPhoto_id',
                    'backPhoto_id',
                    'topPhoto_id',
                    'registration_no',
                    'date_registered',
                    'swinecart',
                    'created_at',
                    'updated_at'
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
