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

            /**
             * 1. Add Farm first to User
             */
            $farm = factory(App\Models\Farm::class)->create();

            $farmCode = new App\Models\FarmCode;
            $farmCode->farm_id = 0;
            $farmCode->farm_code = crypt($farm->name, md5($farm->name));
            $farmCode->farm_accreditation_no = random_int(1000, 2000);
            $farmCode->save();

            // Attach farm code to farm
            $farm->farmCode()->save($farmCode);

            // Attach farm to user
            $user->farms()->save($farm);

            /**
             * 2. Add properties to Swine
             */
            // Need to contextualize properties like age/weight when data was collected.
            // Especially in GP A/Sire (father of pig) and GP B/Dam (mother of pig)

            // In implementing properties
            // Find by slug then get id of property
            // In adding swine property, check if data type is number or other (string, date, etc.)


        });
    }
}
