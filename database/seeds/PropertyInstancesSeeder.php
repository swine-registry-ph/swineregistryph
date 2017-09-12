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
                'property' => 'Age when data was collected',
                'definition' => 'Age when data was collected',
                'slug' => 'age'
            ],
            [
                'property' => 'Weight when data was collected',
                'definition' => 'Weight when data was collected',
                'slug' => 'weight'
            ],
            [
                'property' => 'Average Daily Gain',
                'definition' => 'Average Daily Gain, g/day',
                'slug' => 'adg'
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
                'property' => 'Birth Weight',
                'definition' => 'Birth Weight',
                'slug' => 'birth_weight'
            ],
            [
                'property' => 'Total (M) when born',
                'definition' => 'Total male when born',
                'slug' => 'littersize_male'
            ],
            [
                'property' => 'Total (F) when born',
                'definition' => 'Total female when born',
                'slug' => 'littersize_female'
            ],
            [
                'property' => 'Littersize born alive',
                'definition' => 'Littersize born alive',
                'slug' => 'littersize_alive'
            ],
            [
                'property' => 'Parity',
                'definition' => 'The number of litters a sow has carried (including current pregnancy)',
                'slug' => 'parity'
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
                'property' => 'Age at weaning',
                'definition' => 'Age (days) at weaning',
                'slug' => 'age_weaning'
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
