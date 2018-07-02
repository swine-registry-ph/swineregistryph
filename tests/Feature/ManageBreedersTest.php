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
        $customizedBreederData = [];
        $breeders = Breeder::with('farms')->get();

        // Customize breeder data for easier querying
        foreach ($breeders as $breeder) {
            array_push($customizedBreederData, 
                [
                    'id'        => $breeder->id,
                    'name'      => $breeder->users[0]->name,
                    'email'     => $breeder->users[0]->email,
                    'status'    => $breeder->status_instance,
                    'farms'     => $breeder->farms
                ]
            );
        }
        
        $response = $this->actingAs($this->adminUser)
                         ->get('/admin/manage/breeders');

        $response->assertViewIs('users.admin.manageBreeders');
        $response->assertViewHas('customizedBreederData', collect($customizedBreederData));
    }

    /**
     * Test if creation of breeder is successful
     *
     * @return void
     */
    public function testAdminCreateBreeder()
    {
        // Imitate AJAX request
        $response = $this->actingAs($this->adminUser)
            ->withHeaders([
                'HTTP_X-Requested-With' => 'XMLHttpRequest'
            ])
            ->json('POST', '/admin/manage/breeders',
                [
                    'name'  => 'Sample Breeder',
                    'email' => 'breeder@example.com',
                ]
            );

        $response
            ->assertStatus(200)
            ->assertJson([
                'id'        => 1,
                'name'      => 'Sample Breeder',
                'email'     => 'breeder@example.com',    
                'status'    => 'active',
                'farms'     => []                   
            ]);
    }
}
