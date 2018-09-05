<?php

use Illuminate\Database\Seeder;

class TestInstancesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Default tests
        $tests = [
            [
                'name'               => 'ESR',
                'favorableGenotype'  => 'BB'
            ],
            [
                'name'               => 'PRLR',
                'favorableGenotype'  => 'AA'
            ],
            [
                'name'               => 'RBP4',
                'favorableGenotype'  => 'BB'
            ],
            [
                'name'               => 'LIF',
                'favorableGenotype'  => 'BB'
            ],
            [
                'name'               => 'HFABP',
                'favorableGenotype'  => 'AA'
            ],
            [
                'name'               => 'IGF2',
                'favorableGenotype'  => 'CC'
            ],
            [
                'name'               => 'LEPR',
                'favorableGenotype'  => 'BB'
            ],
            [
                'name'               => 'MYOG',
                'favorableGenotype'  => 'AA'
            ],
            [
                'name'               => 'PSS',
                'favorableGenotype'  => 'NEGATIVE'
            ],
            [
                'name'               => 'RN',
                'favorableGenotype'  => 'NEGATIVE'
            ],
            [
                'name'               => 'BAX',
                'favorableGenotype'  => 'NEGATIVE'
            ],
            [
                'name'               => 'FUT1',
                'favorableGenotype'  => 'AA'
            ],
            [
                'name'               => 'MX1',
                'favorableGenotype'  => 'RESISTANT'
            ],
            [
                'name'               => 'NRAMP',
                'favorableGenotype'  => 'BB'
            ],
            [
                'name'               => 'BPI',
                'favorableGenotype'  => 'GG'
            ]
        ];

        foreach ($tests as $testInstance) {
            $test = new App\Models\Test;
            $test->name = $testInstance['name'];
            $test->favorable_genotype = $testInstance['favorableGenotype'];
            $test->save();
        }
    }
}
