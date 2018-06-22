<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Breeder;
use App\Models\Farm;
use App\Models\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class ViewRegisteredSwineTest extends TestCase
{
    use DatabaseMigrations, DatabaseTransactions;

    protected $adminUser, $breederUser;

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
     * Make sure breeder user cannot access admin view of registered swine
     *
     * @return void
     */
    public function testAdminCannotAccessBreederViewRegisteredSwine()
    {
        $response = $this->actingAs($this->breederUser)
                         ->get('/admin/view-registered-swine');

        $response->assertStatus(302);
    }

    /**
     * Make sure admin user cannot access breeder view of registered swine
     *
     * @return void
     */
    public function testBreederCannotAccessAdminViewRegisteredSwine()
    {
        $response = $this->actingAs($this->adminUser)
                         ->get('/breeder/manage-swine/view');

        $response->assertStatus(302);
    }

    /**
     * For admin viewing registered swine
     *
     * @return void
     */
    public function testAdminViewRegisteredSwine()
    {
        $expectedFarms = Farm::with('swines')->get();
        $response = $this->actingAs($this->adminUser)
                         ->get('/admin/view-registered-swine');

        $response->assertViewIs('users.admin.dashboard');
        $response->assertViewHas('farms', $expectedFarms);
    }

    /**
     * For breeder viewing registered swine
     *
     * @return void
     */
    public function testBreederViewRegisteredSwine()
    {
        $expectedSwines = $this->breederUser->userable()->first()
                               ->swines()->with(['swineProperties.property', 'breed', 'photos', 'farm'])
                               ->get();

        $response = $this->actingAs($this->breederUser)
                         ->get('/breeder/manage-swine/view');

        $response->assertViewIs('users.breeder.viewRegisteredSwine');
        $response->assertViewHas('swines', $expectedSwines);
    }
}
