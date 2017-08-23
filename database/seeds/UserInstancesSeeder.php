<?php

use Illuminate\Database\Seeder;

class UserInstancesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(App\Models\User::class, 5)->create()->each(function ($user) {

            // First, add farm/s of User
            $farm = factory(App\Models\Farm::class)->create();

            // Need farm code?
            $user->farms()->save($farm);

            // Need to contextualize properties like age/weight when data was collected.
            // Especially in GP A/Sire (father of pig) and GP B/Dam (mother of pig)

            // In implementing properties
            // Provide property slug(?)
            // In adding swine property, check if data type is number or other (string, date, etc.)
            $breeds = [
                'Landrace', 'Largewhite', 'Duroc'
            ];


        });
    }
}
