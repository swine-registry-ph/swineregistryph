<?php

namespace Tests\Feature;

use Artisan;
use App\Models\Admin;
use App\Models\Genomics;
use App\Models\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class ManageGenomicsTest extends TestCase
{
    use DatabaseMigrations, DatabaseTransactions;

    protected $adminUser;

    /**
     * Initialize data needed for testing
     */
    protected function setUp()
    {
        parent::setUp();

        Artisan::call('db:seed');

        $this->adminUser = factory(User::class)->create();

        // Create Admin Profile
        $administrator = factory(Admin::class)->create();
        $administrator->users()->save($this->adminUser);
    }

    /**
     * For admin viewing current genomics
     *
     * @return void
     */
    public function testAdminViewManageGenomics()
    {
        $customizedGenomicsData = [];
        $genomics = Genomics::with('users')
            ->where('status_instance', 'active')
            ->get();
        
        foreach ($genomics as $aGenomic) {
            $customizedGenomicsData[] = [
                'genomicsId'  => $aGenomic->id,
                'userId'      => $aGenomic->users[0]->id,
                'name'        => $aGenomic->users[0]->name,
                'email'       => $aGenomic->users[0]->email,
                'status'      => $aGenomic->status_instance
            ];
        }

        $response = $this->actingAs($this->adminUser)
                         ->get('/admin/manage/genomics');

        $response->assertViewIs('users.admin.manageGenomics');
        $response->assertViewHas('customizedGenomicsData', collect($customizedGenomicsData));
    }

     /**
     * Test if creation of genomics is successful
     *
     * @return void
     */
    public function testAdminCreateGenomics()
    {
        // Imitate AJAX request
        $response = $this->actingAs($this->adminUser)
            ->withHeaders([
                'HTTP_X-Requested-With' => 'XMLHttpRequest'
            ])
            ->json('POST', '/admin/manage/genomics',
                [
                    'name'  => 'Sample Genomics',
                    'email' => 'genomics@example.com',
                ]
            );

        $response
            ->assertStatus(200)
            ->assertJson([
                'name'      => 'Sample Genomics',
                'email'     => 'genomics@example.com',    
                'status'    => 'active'           
            ]);
    }

    /**
     * Test if updating of genomics is successful
     *
     * @return void
     */
    public function testAdminUpdateGenomics()
    {
        // Imitate AJAX request
        $response = $this->actingAs($this->adminUser)
            ->withHeaders([
                'HTTP_X-Requested-With' => 'XMLHttpRequest'
            ])
            ->json('PATCH', '/admin/manage/genomics',
                [
                    'userId'    => 2,
                    'name'      => 'Sample Edited Genomics',
                    'email'     => 'genomicsEdited@example.com',
                ]
            );

        $response
            ->assertStatus(200)
            ->assertJson([
                'updated' => true
            ]);
    }

    /**
     * Test if deleting of genomics is successful
     *
     * @return void
     */
    public function testAdminDeleteGenomics()
    {
        // Imitate AJAX request
        $response = $this->actingAs($this->adminUser)
            ->withHeaders([
                'HTTP_X-Requested-With' => 'XMLHttpRequest'
            ])
            ->json('DELETE', '/admin/manage/genomics/2');

        $response
            ->assertStatus(200)
            ->assertJson([
                'deleted' => true
            ]);
    }
}
