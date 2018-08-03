<?php

namespace Tests\Feature;

use Artisan;
use App\Models\Admin;
use App\Models\Evaluator;
use App\Models\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class ManageEvaluatorsTest extends TestCase
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
     * For admin viewing current evaluators
     *
     * @return void
     */
    public function testAdminViewManageEvaluators()
    {
        $customizedEvaluatorData = [];
        $evaluators = Evaluator::with('users')
            ->where('status_instance', 'active')
            ->get();
        
        foreach ($evaluators as $evaluator) {
            $customizedEvaluatorData[] = [
                'evaluatorId' => $evaluator->id,
                'userId'      => $evaluator->users[0]->id,
                'name'        => $evaluator->users[0]->name,
                'email'       => $evaluator->users[0]->email,
                'status'      => $evaluator->status_instance
            ];
        }

        $response = $this->actingAs($this->adminUser)
                         ->get('/admin/manage/evaluators');

        $response->assertViewIs('users.admin.manageEvaluators');
        $response->assertViewHas('customizedEvaluatorData', collect($customizedEvaluatorData));
    }

     /**
     * Test if creation of evaluator is successful
     *
     * @return void
     */
    public function testAdminCreateEvaluator()
    {
        // Imitate AJAX request
        $response = $this->actingAs($this->adminUser)
            ->withHeaders([
                'HTTP_X-Requested-With' => 'XMLHttpRequest'
            ])
            ->json('POST', '/admin/manage/evaluators',
                [
                    'name'  => 'Sample Evaluator',
                    'email' => 'evaluator@example.com',
                ]
            );

        $response
            ->assertStatus(200)
            ->assertJson([
                'name'      => 'Sample Evaluator',
                'email'     => 'evaluator@example.com',    
                'status'    => 'active'           
            ]);
    }

    /**
     * Test if updating of evaluator is successful
     *
     * @return void
     */
    public function testAdminUpdateEvaluator()
    {
        // Imitate AJAX request
        $response = $this->actingAs($this->adminUser)
            ->withHeaders([
                'HTTP_X-Requested-With' => 'XMLHttpRequest'
            ])
            ->json('PATCH', '/admin/manage/evaluators',
                [
                    'userId'    => 3,
                    'name'      => 'Sample Evaluator',
                    'email'     => 'evaluator@example.com',
                ]
            );

        $response
            ->assertStatus(200)
            ->assertJson([
                'updated' => true
            ]);
    }

    /**
     * Test if deleting of evaluator is successful
     *
     * @return void
     */
    public function testAdminDeleteEvaluator()
    {
        // Imitate AJAX request
        $response = $this->actingAs($this->adminUser)
            ->withHeaders([
                'HTTP_X-Requested-With' => 'XMLHttpRequest'
            ])
            ->json('DELETE', '/admin/manage/evaluators/3');

        $response
            ->assertStatus(200)
            ->assertJson([
                'deleted' => true
            ]);
    }    
}
