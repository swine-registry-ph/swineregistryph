<?php

namespace Tests\Feature;

use Artisan;
use App\Models\Genomics;
use App\Models\User;
use Carbon\Carbon;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class ManageLaboratoryResultsTest extends TestCase
{
    use DatabaseMigrations, DatabaseTransactions;

    protected $genomicsUser;

    /**
     * Initialize data needed for testing
     */
    protected function setUp()
    {
        parent::setUp();

        Artisan::call('db:seed');

        $this->genomicsUser = factory(User::class)->create();

        // Create Genomics Profile
        $genomics = factory(Genomics::class)->create();
        $genomics->users()->save($this->genomicsUser);
    }

    /**
     * Test if creation of laboratory results is successful
     *
     * @return void
     */
    public function testGenomicsCreateLabResults()
    {
        // Imitate AJAX request
        $response = $this->actingAs($this->genomicsUser)
            ->withHeaders([
                'HTTP_X-Requested-With' => 'XMLHttpRequest'
            ])
            ->json('POST', '/genomics/manage/laboratory-results',
                [
                    'laboratoryResultNo'  => '123456',
                    'animalId'            => '6543',
                    'sex'                 => 'male',
                    'farmId'              => 1,
                    'farmName'            => '',
                    'dateResult'          => Carbon::now()->format('F d, Y'),
                    'dateSubmitted'       => Carbon::now()->subWeeks(2)->format('F d, Y'),
                    'tests'             => [
                        'esr'                 => 'BB',
                        'prlr'                => 'AA',
                        'rbp4'                => 'BB',
                        'lif'                 => 'BB',
                        'hfabp'               => 'AA',
                        'igf2'                => 'CC',
                        'lepr'                => 'BB',
                        'myog'                => 'AA',
                        'pss'                 => 'NEGATIVE',
                        'rn'                  => 'NEGATIVE',
                        'bax'                 => 'NEGATIVE',
                        'fut1'                => 'AA',
                        'mx1'                 => 'RESISTANT',
                        'nramp'               => 'BB',
                        'bpi'                 => 'GG'
                    ]
                ]
            );

        $response
            ->assertStatus(200);
    }
}
