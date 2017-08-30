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
            'Landrace', 'Largewhite', 'Duroc'
        ];

        foreach ($breedTitles as $breedTitle) {
            $breed = new App\Models\Breed;
            $breed->title = $breedTitle;
            $breed->save();
        }
    }
}
