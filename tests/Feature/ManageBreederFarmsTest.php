<?php

namespace Tests\Feature;

use Artisan;
use App\Models\Admin;
use App\Models\Breeder;
use App\Models\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class ManageBreederFarmsTest extends TestCase
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
     * Test if creation of breeder farm is successful
     *
     * @return void
     */
    public function testAdminCreateFarm()
    {
        // Imitate AJAX request
        $response = $this->actingAs($this->adminUser)
            ->withHeaders([
                'HTTP_X-Requested-With' => 'XMLHttpRequest'
            ])
            ->json('POST', '/admin/manage/farms',
                [
                    'breederId'         => 1,
                    'name'              => 'John and Piolo Farms',
                    'farmCode'          => 'JAP',
                    'accreditationDate' => 'July 9, 2017',
                    'accreditationNo'   => 12345,
                    'addressLine1'      => '2826 Putho-Tuntungin St.',
                    'addressLine2'      => 'Bungad, Alfonso',
                    'province'          => 'Romblon',
                    'provinceCode'      => 'ROM'
                ]
            );

        $response
            ->assertStatus(200)
            ->assertJson([
                'id'                        => 6,
                'breeder_id'                => 1,
                'name'                      => 'John and Piolo Farms',
                'farm_code'                 => 'JAP',    
                'farm_accreditation_date'   => '2017-07-09',
                'farm_accreditation_no'     => 12345,
                'address_line1'             => '2826 Putho-Tuntungin St.',
                'address_line2'             => 'Bungad, Alfonso',
                'province'                  => 'Romblon',
                'province_code'             => 'ROM'                   
            ]);
    }

    /**
     * Test if editing of breeder farm is successful
     *
     * @return void
     */
    public function testAdminUpdateFarm()
    {
        // Imitate AJAX request
        $response = $this->actingAs($this->adminUser)
            ->withHeaders([
                'HTTP_X-Requested-With' => 'XMLHttpRequest'
            ])
            ->json('PATCH', '/admin/manage/farms',
                [
                    'farmId'            => 1,
                    'name'              => 'Pogi and Piolo Farms 2',
                    'farmCode'          => 'PAP',
                    'accreditationDate' => 'July 9, 2017',
                    'accreditationNo'   => 12345,
                    'addressLine1'      => '2826 Putho-Tuntungin St.',
                    'addressLine2'      => 'Bungad, Alfonso',
                    'province'          => 'Romblon',
                    'provinceCode'      => 'ROM'
                ]
            );

        $response
            ->assertStatus(200)
            ->assertJson([
                'updated' => true
            ]);;
    }

    /**
     * Test if renwal of breeder's farm is successful
     *
     * @return void
     */
    public function testAdminRenewFarm()
    {
        // Imitate AJAX request
        $response = $this->actingAs($this->adminUser)
            ->withHeaders([
                'HTTP_X-Requested-With' => 'XMLHttpRequest'
            ])
            ->json('PATCH', '/admin/manage/farms/renew',
                [
                    'farmId'               => 1,
                    'newAccreditationDate' => 'July 24, 2018'
                ]
            );

        $response
            ->assertStatus(200)
            ->assertJson([
                'updated' => true
            ]);
    }
}
