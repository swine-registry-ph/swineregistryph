<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Breeder;
use App\Models\User;
use App\Repositories\SwineRepository;
use App\Repositories\CustomFakers;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class RegisterSwineTest extends TestCase
{
    use DatabaseMigrations, DatabaseTransactions, CustomFakers;

    protected $adminUser, $breederUser, $gpOneData, $gpSireData, $gpDamData;

    /**
     * Initialize data needed for testing
     */
    protected function setUp()
    {
        parent::setUp();

        $this->adminUser = factory(User::class)->create();
        $this->breederUser = factory(User::class)->create();

        // Create Admin Profile
        $administrator = factory(Admin::class)->create();
        $administrator->users()->save($this->adminUser);

        // Create Breeder Profile
        $breeder = factory(Breeder::class)->create();
        $breeder->users()->save($this->breederUser);
    }

    /**
     * Test if able to add swine with 'new'
     * status of parents
     *
     * @return void
     */
    public function testSuccessfulAddSwineWithNewParents()
    {
        $breeds = [
            [ 'id' => 1, 'name' => 'landrace', 'code' => 'LR' ],
            [ 'id' => 2, 'name' => 'largewhite', 'code' => 'LW' ],
            [ 'id' => 3, 'name' => 'duroc', 'code' => 'DR' ],
            [ 'id' => 4, 'name' => 'pietrain', 'code' => 'PT' ]
        ];
        $swineBreedIndex = random_int(0,3);
        $breedId = $breeds[$swineBreedIndex]['id'];

        $response = $this->actingAs($this->breederUser)
            ->json('POST', '/breeder/manage-swine/register',
                [
                    'gpOne' => $this->createGpOneData($breedId),
                    'gpSire' => $this->createGpParentData('new', 'male', $breedId),
                    'gpDam' => $this->createGpParentData('new', 'female', $breedId)
                ]
            );

        $response->assertStatus(200);
    }

    /**
     * Test if able to add swine with 'imported'
     * status of parents
     *
     * @return void
     */
    public function testSuccessfulAddSwineWithImportedParents()
    {
        $breeds = [
            [ 'id' => 1, 'name' => 'landrace', 'code' => 'LR' ],
            [ 'id' => 2, 'name' => 'largewhite', 'code' => 'LW' ],
            [ 'id' => 3, 'name' => 'duroc', 'code' => 'DR' ],
            [ 'id' => 4, 'name' => 'pietrain', 'code' => 'PT' ]
        ];
        $swineBreedIndex = random_int(0,3);
        $breedId = $breeds[$swineBreedIndex]['id'];

        $response = $this->actingAs($this->breederUser)
            ->json('POST', '/breeder/manage-swine/register',
                [
                    'gpOne' => $this->createGpOneData($breedId),
                    'gpSire' => $this->createGpParentData('imported', 'male', $breedId),
                    'gpDam' => $this->createGpParentData('imported', 'female', $breedId)
                ]
            );

        $response->assertStatus(200);
    }

    /**
     * Test if able to add swine with 'registered'
     * status of parents
     *
     * @return void
     */
    public function testSuccessfulAddSwineWithRegisteredParents()
    {
        $breeds = [
            [ 'id' => 1, 'name' => 'landrace', 'code' => 'LR' ],
            [ 'id' => 2, 'name' => 'largewhite', 'code' => 'LW' ],
            [ 'id' => 3, 'name' => 'duroc', 'code' => 'DR' ],
            [ 'id' => 4, 'name' => 'pietrain', 'code' => 'PT' ]
        ];
        $swineBreedIndex = random_int(0,3);
        $breedId = $breeds[$swineBreedIndex]['id'];

        $response = $this->actingAs($this->breederUser)
            ->json('POST', '/breeder/manage-swine/register',
                [
                    'gpOne' => $this->createGpOneData($breedId),
                    'gpSire' => $this->createGpParentData('registered', 'male', $breedId),
                    'gpDam' => $this->createGpParentData('registered', 'female', $breedId)
                ]
            );

        $response->assertStatus(200);
    }

}
