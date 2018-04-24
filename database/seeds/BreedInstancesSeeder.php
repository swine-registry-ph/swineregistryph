<?php

use Illuminate\Database\Seeder;

class BreedInstancesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $breedTitles = [
            ['Landrace', 'LR'],
            ['Largewhite', 'LW'],
            ['Duroc', 'DR'],
            ['Pietrain', 'PT']
        ];

        foreach ($breedTitles as $breedTitle) {
            $breed = new App\Models\Breed;
            $breed->title = $breedTitle[0];
            $breed->code = $breedTitle[1];
            $breed->save();
        }
    }
}
