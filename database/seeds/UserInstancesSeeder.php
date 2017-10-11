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
        // For Administrator/s
        factory(App\Models\User::class, 1)->create()->each(function ($user) {
            // Create Admin Profile
            $administrator = factory(App\Models\Admin::class)->create();
            $administrator->users()->save($user);
        });

        // For Breeders
        factory(App\Models\User::class, 5)->create()->each(function ($user) {

            // Create Breeder Profile
            $breeder = factory(App\Models\Breeder::class)->create();
            $breeder->users()->save($user);

            /**
             * 1. Add Farm first to User
             */
            $farm = factory(App\Models\Farm::class)->create();

            // (?) How do we even create a farm code? NOT SURE YET.
            $farmCode = new App\Models\FarmCode;
            $farmCode->farm_id = 0;
            $farmCode->farm_code = crypt($farm->name, md5($farm->name));
            $farmCode->farm_accreditation_no = random_int(1000, 2000);
            $farmCode->save();

            // Attach farm code to farm
            $farm->farmCode()->save($farmCode);

            // Attach farm to breeder
            $breeder->farms()->save($farm);

            /**
             * 2. Add Swine Collection
             */
            // Need to contextualize properties like age/weight when data was collected
            // especially in GP A/Sire (father of pig) and GP B/Dam (mother of pig)

            $collection = factory(App\Models\Collection::class)->create([
                'breeder_id' => $breeder->id
            ]);

            // Insert 5 default swines
            for($i = 0; $i < 5; $i++){

                $swine = factory(App\Models\Swine::class)->create([
                    'collection_id' => $collection->id,
                    'farm_id' => $farm->id,
                    'registration_no' => str_random(15)
                ]);

                // breed, sex, birth date, age when data, weight when data
                // [DAO][JJ][LW][16][M][T]-earmark
                // [Location][Farm][Breed][BirthYear][Gender][Tunnel/Open]-earmark/farmID
                $swine->swineProperties()->saveMany(
                    [
                        new App\Models\SwineProperty([
                            'property_id' => 1, // sex
                            'value' => 'male'
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 2, // birthdate
                            'value' => \Carbon\Carbon::now()->subYear()->toDateString()
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 4, // weight when data was collected
                            'value' => random_int(70,130)/1.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 5, // adg
                            'value' => random_int(70,110)/100.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 6, // bft
                            'value' => random_int(90,130)/10.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 7, // feed efficiency
                            'value' => random_int(10,30)/10.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 8, // birth weight
                            'value' => random_int(10,20)/10.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 9, // total male born alive
                            'value' => random_int(3,9)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 10, // total female born alive
                            'value' => random_int(3,9)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 11, // parity
                            'value' => random_int(1,5)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 12, // littersize at weaning
                            'value' => random_int(6,16)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 13, // litterweight at weaning
                            'value' => random_int(36,96)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 14, // date at weaning
                            'value' => \Carbon\Carbon::now()->toDateString()
                        ])
                    ]
                );


                // Create default GP sire of swine
                $gpSire = factory(App\Models\Swine::class)->create([
                    'collection_id' => $collection->id,
                    'farm_id' => $farm->id,
                    'registration_no' => str_random(15)
                ]);

                $gpSire->swineProperties()->saveMany(
                    [
                        new App\Models\SwineProperty([
                            'property_id' => 1, // sex
                            'value' => 'male'
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 2, // birthdate
                            'value' => \Carbon\Carbon::now()->subYear(2)->toDateString()
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 4, // weight when data was collected
                            'value' => random_int(70,130)/1.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 5, // adg
                            'value' => random_int(70,110)/100.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 6, // bft
                            'value' => random_int(90,130)/10.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 7, // feed efficiency
                            'value' => random_int(10,30)/10.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 8, // birth weight
                            'value' => random_int(10,20)/10.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 9, // total male born alive
                            'value' => random_int(3,9)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 10, // total female born alive
                            'value' => random_int(3,9)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 11, // parity
                            'value' => random_int(1,5)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 12, // littersize at weaning
                            'value' => random_int(6,16)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 13, // litterweight at weaning
                            'value' => random_int(36,96)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 14, // date at weaning
                            'value' => \Carbon\Carbon::now()->subYear()->toDateString()
                        ])
                    ]
                );

                // Create default GP dam of swine
                $gpDam = factory(App\Models\Swine::class)->create([
                    'collection_id' => $collection->id,
                    'farm_id' => $farm->id,
                    'registration_no' => str_random(15)
                ]);

                $gpDam->swineProperties()->saveMany(
                    [
                        new App\Models\SwineProperty([
                            'property_id' => 1, // sex
                            'value' => 'female'
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 2, // birthdate
                            'value' => \Carbon\Carbon::now()->subYear(2)->toDateString()
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 4, // weight when data was collected
                            'value' => random_int(70,130)/1.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 5, // adg
                            'value' => random_int(70,110)/100.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 6, // bft
                            'value' => random_int(90,130)/10.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 7, // feed efficiency
                            'value' => random_int(10,30)/10.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 8, // birth weight
                            'value' => random_int(10,20)/10.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 9, // total male born alive
                            'value' => random_int(3,9)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 10, // total female born alive
                            'value' => random_int(3,9)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 11, // parity
                            'value' => random_int(1,5)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 12, // littersize at weaning
                            'value' => random_int(6,16)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 13, // litterweight at weaning
                            'value' => random_int(36,96)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 14, // date at weaning
                            'value' => \Carbon\Carbon::now()->subYear()->toDateString()
                        ])
                    ]
                );

                // Attach GP sire and GP dam to swine
                $swine->gpSire_id = $gpSire->id;
                $swine->gpDam_id = $gpDam->id;
                $swine->save();

            } // endfor


        });
    }
}
