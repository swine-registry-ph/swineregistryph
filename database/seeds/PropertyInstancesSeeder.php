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
                'slug' => 'birth-date'
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
                'slug' => 'birth-weight'
            ],
            [
                'property' => 'Total (M) when born',
                'definition' => 'Total male when born',
                'slug' => 'total-male'
            ],
            [
                'property' => 'Total (F) when born',
                'definition' => 'Total female when born',
                'slug' => 'total-female'
            ],
            [
                'property' => 'Littersize born alive',
                'definition' => 'Littersize born alive',
                'slug' => 'litter-alive'
            ],
            [
                'property' => 'Parity',
                'definition' => 'Parity',
                'slug' => 'parity'
            ],
            [
                'property' => 'Littersize at weaning',
                'definition' => 'Littersize at weaning',
                'slug' => 'litter-weaning'
            ],
            [
                'property' => 'Total litterweight at weaning',
                'definition' => 'Total litterweight at weaning',
                'slug' => 'litterweight-weaning'
            ],
            [
                'property' => 'GP Sire',
                'definition' => 'The boar father of the swine',
                'slug' => 'gp-sire'
            ],
            [
                'property' => 'GP Dam',
                'definition' => 'The sow mother of the swine',
                'slug' => 'gp-dam'
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
