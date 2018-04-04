<?php

use Illuminate\Database\Seeder;

class PropertyInstancesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Default swine property names
        $properties = [
            [
                'property' => 'Sex',
                'definition' => 'Sex',
                'slug' => 'sex'
            ],
            [
                'property' => 'Birth Date',
                'definition' => 'Birth Date',
                'slug' => 'birth_date'
            ],
            [
                'property' => 'Birth Weight',
                'definition' => 'Birth Weight',
                'slug' => 'birth_weight'
            ],
            [
                'property' => 'Weight when data was collected',
                'definition' => 'Weight when data was collected',
                'slug' => 'collected_weight'
            ],
            [
                'property' => 'Average Daily Gain from Birth',
                'definition' => 'Average Daily Gain from Birth, g/day',
                'slug' => 'adgBirth'
            ],
            [
                'property' => 'End Date (ADG from Birth)',
                'definition' => 'Average Daily Gain from Birth End Date',
                'slug' => 'adgBirth_endDate'
            ],
            [
                'property' => 'End Weight (ADG from Birth)',
                'definition' => 'Average Daily Gain from Birth End Weight',
                'slug' => 'adgBirth_endWeight'
            ],
            [
                'property' => 'Average Daily Gain on Test',
                'definition' => 'Average Daily Gain on Test, g/day',
                'slug' => 'adgTest'
            ],
            [
                'property' => 'Start Date (ADG on Test)',
                'definition' => 'Average Daily Gain on Test Start Date',
                'slug' => 'adgTest_startDate'
            ],
            [
                'property' => 'Start Weight (ADG on Test)',
                'definition' => 'Average Daily Gain on Test Start Weight',
                'slug' => 'adgTest_startWeight'
            ],
            [
                'property' => 'End Date (ADG on Test)',
                'definition' => 'Average Daily Gain on Test End Date',
                'slug' => 'adgTest_endDate'
            ],
            [
                'property' => 'End Weight (ADG on Test)',
                'definition' => 'Average Daily Gain on Test End Weight',
                'slug' => 'adgTest_endWeight'
            ],
            [
                'property' => 'House Type',
                'definition' => 'House Type where swine lives',
                'slug' => 'house_type'
            ],
            [
                'property' => 'Backfat Thickness',
                'definition' => 'Backfat Thickness (mm)',
                'slug' => 'bft'
            ],
            [
                'property' => 'Feed Efficiency',
                'definition' => 'Feed Efficiency, gain/feed',
                'slug' => 'fe'
            ],
            [
                'property' => 'Teat number',
                'definition' => 'No. of teats a swine has',
                'slug' => 'teat_number'
            ],
            [
                'property' => 'Parity',
                'definition' => 'The number of litters a sow has carried (including current pregnancy)',
                'slug' => 'parity'
            ],
            [
                'property' => 'Total (M) born alive',
                'definition' => 'Total male born alive',
                'slug' => 'littersize_male'
            ],
            [
                'property' => 'Total (F) born alive',
                'definition' => 'Total female born alive',
                'slug' => 'littersize_female'
            ],
            [
                'property' => 'Littersize at weaning',
                'definition' => 'Littersize at weaning',
                'slug' => 'littersize_weaning'
            ],
            [
                'property' => 'Total litterweight at weaning',
                'definition' => 'Total litterweight at weaning',
                'slug' => 'litterweight_weaning'
            ],
            [
                'property' => 'Date at weaning',
                'definition' => 'Date at weaning',
                'slug' => 'date_weaning'
            ],
            [
                'property' => 'Farm Swine ID / Ear Mark',
                'definition' => 'Farm swine identification / Ear mark of swine in the farm',
                'slug' => 'farmSwine_id'
            ]
        ];

        foreach ($properties as $propInstance) {
            $property = new App\Models\Property;
            $property->property = $propInstance['property'];
            $property->definition = $propInstance['definition'];
            $property->slug = $propInstance['slug'];
            $property->save();
        }
    }
}
