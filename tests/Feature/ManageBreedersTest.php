<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Breeder;
use App\Models\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class ManageBreedersTest extends TestCase
{
    use DatabaseMigrations, DatabaseTransactions;

    protected $adminUser;

    /**
     * Initialize data needed for testing
     */
    protected function setUp()
    {
        parent::setUp();

        $this->adminUser = factory(User::class)->create();

        // Create Admin Profile
        $administrator = factory(Admin::class)->create();
        $administrator->users()->save($this->adminUser);
    }

    /**
     * For admin viewing current accredited breeders
     *
     * @return void
     */
    public function testAdminViewManageBreeders()
    {
        $expectedBreeders = Breeder::with('farms')->get();
        
        $response = $this->actingAs($this->adminUser)
                         ->get('/admin/manage/breeders');

        $response->assertViewIs('users.admin.manageBreeders');
        $response->assertViewHas('breeders', $expectedBreeders);
    }
}
