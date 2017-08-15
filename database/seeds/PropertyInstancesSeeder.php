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
                'definition' => 'Sex'
            ],
            [
                'property' => 'Birth Date',
                'definition' => 'Birth Date'
            ],
            [
                'property' => 'Age when data was collected',
                'definition' => 'Age when data was collected'
            ],
            [
                'property' => 'Weight when data was collected',
                'definition' => 'Weight when data was collected'
            ],
            [
                'property' => 'Backfat Thickness',
                'definition' => 'Backfat Thickness (mm)'
            ],
            [
                'property' => 'Feed Efficiency',
                'definition' => 'Feed Efficiency, gain/feed'
            ],
            [
                'property' => 'Birth Weight',
                'definition' => 'Birth Weight'
            ],
            [
                'property' => 'Total (M) when born',
                'definition' => 'Total male when born'
            ],
            [
                'property' => 'Total (F) when born',
                'definition' => 'Total female when born'
            ],
            [
                'property' => 'Littersize born alive',
                'definition' => 'Littersize born alive'
            ],
            [
                'property' => 'Parity',
                'definition' => 'Parity'
            ],
            [
                'property' => 'Littersize at weaning',
                'definition' => 'Littersize at weaning'
            ],
            [
                'property' => 'Total litterweight at weaning',
                'definition' => 'Total litterweight at weaning'
            ],
            [
                'property' => 'GP Sire',
                'definition' => 'The boar father of the swine'
            ],
            [
                'property' => 'GP Dam',
                'definition' => 'The sow mother of the swine'
            ]
        ];

        foreach ($properties as $propInstance) {
            $property = new App\Models\Property;
            $property->property = $propInstance->property;
            $property->definition = $propInstance->definition;
            $property->save();
        }
    }
}
