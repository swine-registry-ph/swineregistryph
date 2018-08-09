<?php

use App\Repositories\CustomHelpers;
use Illuminate\Database\Seeder;

class UserInstancesSeeder extends Seeder
{
    use CustomHelpers;

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

        // For Genomics User
        factory(App\Models\User::class, 1)->create()->each(function ($user) {
            // Create Genomics Profile
            $genomics = factory(App\Models\Genomics::class)->create();
            $genomics->users()->save($user);
        });

        // For Evaluators
        factory(App\Models\User::class, 3)->create()->each(function ($user) {
            // Create Evaluator Profile
            $evaluator = factory(App\Models\Evaluator::class)->create();
            $evaluator->users()->save($user);
        });

        // For Breeders
        factory(App\Models\User::class, 10)->create()->each(function ($user) {

            // Create Breeder Profile
            $breeder = factory(App\Models\Breeder::class)->create();
            $breeder->users()->save($user);

            /**
             * 1. Add Farm first to User
             */

            // How do we even create a farm code? Current implementation
            // is getting the first three characters of farm name
            // then making it all uppercase letters
            $faker = Faker\Factory::create();
            $fakerFarmName = $faker->company;
            $farm = factory(App\Models\Farm::class)->make([
                'name' => $fakerFarmName,
                'farm_code' => strtoupper(substr($fakerFarmName, 0, 3)),
                'farm_accreditation_no' => random_int(1000, 2000),
                'farm_accreditation_date' => \Carbon\Carbon::now()->subYear()
            ]);

            // Attach farm to breeder
            $breeder->farms()->save($farm);

            /**
             * 2. Add Swine Collection
             */
            // Need to contextualize properties especially in GP A/Sire
            // (father of pig) and GP B/Dam (mother of pig)

            $sexes = ['male', 'female'];
            $houseTypes = ['open', 'tunnel'];
            $breeds = [
                [ 'id' => 1, 'name' => 'landrace', 'code' => 'LR' ],
                [ 'id' => 2, 'name' => 'largewhite', 'code' => 'LW' ],
                [ 'id' => 3, 'name' => 'duroc', 'code' => 'DR' ],
                [ 'id' => 4, 'name' => 'pietrain', 'code' => 'PT' ]
            ];

            // Insert 5 default swines
            for($i = 0; $i < 5; $i++){
                $farmSwineId = random_int(1000,3000);
                $farmGpSireId = random_int(1000,3000);
                $farmGpDamId = random_int(1000,3000);
                $swineBreedIndex = random_int(0,3);
                $swineSexIndex = random_int(0,1);
                $swineHouseTypeIndex = random_int(0,1);
                $chosenBreedName = $breeds[$swineBreedIndex]['name'];
                $chosenBreedId = $breeds[$swineBreedIndex]['id'];
                $swineData = [
                    'farmProvinceCode' => $farm->province_code,
                    'farmCode' => $farm->farm_code,
                    'breedCode' => $breeds[$swineBreedIndex]['code'],
                    'birthYear' => \Carbon\Carbon::now()->subYear()->year,
                    'sex' => $sexes[$swineSexIndex],
                    'houseType' => $houseTypes[$swineHouseTypeIndex],
                    'farmSwineId' => $farmSwineId
                ];

                $swine = factory(App\Models\Swine::class)->create([
                    'breed_id' => $chosenBreedId,
                    'breeder_id' => $breeder->id,
                    'farm_id' => $farm->id,
                    'registration_no' => $this->generateRegistrationNumber($swineData),
                    'swinecart' => true
                ]);

                // Properties are as follows: sex, birth_date, birth_weight,
                // adgBirth, adgBirth_endDate, adgBirth_endWeight, adgTest,
                // adgTest_startDate, adgTest_startWeight, adgTest_endDate,
                // adgTest_endWeight, house_type, bft, fe, teat_number,
                // parity, littersize_male, littersize_female,
                // littersize_weaning, litterweight_weaning,
                // date_weaning
                $swine->swineProperties()->saveMany(
                    [
                        new App\Models\SwineProperty([
                            'property_id' => 1, // sex
                            'value' => $sexes[$swineSexIndex]
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 2, // birthdate
                            'value' => \Carbon\Carbon::now()->subYear()->toDateString()
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 3, // birth weight
                            'value' => random_int(10,20)/10.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 4, // adg from birth
                            'value' => random_int(4,15)/10.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 5, // end date (adg from birth)
                            'value' => \Carbon\Carbon::now()->toDateString()
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 6, // end weight (adg from birth)
                            'value' => random_int(90,150)/1.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 7, // adg on test
                            'value' => random_int(4,15)/10.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 8, // start date (adg on test)
                            'value' => \Carbon\Carbon::now()->subMonths(9)->toDateString()
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 9, // start weight (adg on test)
                            'value' => random_int(50,80)/1.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 10, // end date (adg on test)
                            'value' => \Carbon\Carbon::now()->subMonths(7)->toDateString()
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 11, // end weight (adg on test)
                            'value' => random_int(110,160)/1.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 12, // house type
                            'value' => $houseTypes[$swineHouseTypeIndex]
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 13, // bft
                            'value' => random_int(90,130)/10.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 14, // bft collected
                            'value' => \Carbon\Carbon::now()->subMonths(7)->toDateString()
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 15, // feed intake
                            'value' => random_int(100,200)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 16, // feed efficiency
                            'value' => random_int(10,60)/10.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 17, // teat number
                            'value' => random_int(6,8)*2
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 18, // parity
                            'value' => random_int(1,5)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 19, // total male born alive
                            'value' => random_int(3,9)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 20, // total female born alive
                            'value' => random_int(3,9)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 21, // littersize at weaning
                            'value' => random_int(6,16)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 22, // litterweight at weaning
                            'value' => random_int(36,96)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 23, // date at weaning
                            'value' => \Carbon\Carbon::now()->toDateString()
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 24, // farm swine id / ear mark
                            'value' => $farmSwineId
                        ])
                    ]
                );

                // Create default GP sire of swine
                $sireData = [
                    'farmProvinceCode' => $farm->province_code,
                    'farmCode' => $farm->farm_code,
                    'breedCode' => $breeds[$swineBreedIndex]['code'],
                    'birthYear' => \Carbon\Carbon::now()->subYear()->year,
                    'sex' => 'M',
                    'houseType' => $houseTypes[$swineHouseTypeIndex],
                    'farmSwineId' => $farmGpSireId
                ];

                $gpSire = factory(App\Models\Swine::class)->create([
                    'breed_id' => $chosenBreedId,
                    'breeder_id' => $breeder->id,
                    'farm_id' => $farm->id,
                    'registration_no' => $this->generateRegistrationNumber($sireData),
                    'swinecart' => false
                ]);

                $gpSire->swineProperties()->saveMany(
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
                            'property_id' => 3, // birth weight
                            'value' => random_int(10,20)/10.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 4, // adg from birth
                            'value' => random_int(4,15)/10.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 5, // end date (adg from birth)
                            'value' => \Carbon\Carbon::now()->toDateString()
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 6, // end weight (adg from birth)
                            'value' => random_int(90,160)/1.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 7, // adg on test
                            'value' => random_int(4,15)/10.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 8, // start date (adg on test)
                            'value' => \Carbon\Carbon::now()->subMonths(9)->toDateString()
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 9, // start weight (adg on test)
                            'value' => random_int(50,80)/1.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 10, // end date (adg on test)
                            'value' => \Carbon\Carbon::now()->subMonths(7)->toDateString()
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 11, // end weight (adg on test)
                            'value' => random_int(110,160)/1.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 12, // house type
                            'value' => $houseTypes[$swineHouseTypeIndex]
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 13, // bft
                            'value' => random_int(90,130)/10.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 14, // bft collected
                            'value' => \Carbon\Carbon::now()->subMonths(7)->toDateString()
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 15, // feed intake
                            'value' => random_int(100,200)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 16, // feed efficiency
                            'value' => random_int(10,60)/10.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 17, // teat number
                            'value' => random_int(6,8)*2
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 18, // parity
                            'value' => random_int(1,5)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 19, // total male born alive
                            'value' => random_int(3,9)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 20, // total female born alive
                            'value' => random_int(3,9)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 21, // littersize at weaning
                            'value' => random_int(6,16)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 22, // litterweight at weaning
                            'value' => random_int(36,96)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 23, // date at weaning
                            'value' => \Carbon\Carbon::now()->toDateString()
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 24, // farm swine id / ear mark
                            'value' => $farmGpSireId
                        ])
                    ]
                );

                // Create default GP dam of swine
                $damData = [
                    'farmProvinceCode' => $farm->province_code,
                    'farmCode' => $farm->farm_code,
                    'breedCode' => $breeds[$swineBreedIndex]['code'],
                    'birthYear' => \Carbon\Carbon::now()->subYear()->year,
                    'sex' => 'F',
                    'houseType' => $houseTypes[$swineHouseTypeIndex],
                    'farmSwineId' => random_int(1000, 3000)
                ];

                $gpDam = factory(App\Models\Swine::class)->create([
                    'breed_id' => $chosenBreedId,
                    'breeder_id' => $breeder->id,
                    'farm_id' => $farm->id,
                    'registration_no' => $this->generateRegistrationNumber($damData),
                    'swinecart' => false
                ]);

                $gpDam->swineProperties()->saveMany(
                    [
                        new App\Models\SwineProperty([
                            'property_id' => 1, // sex
                            'value' => 'female'
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 2, // birthdate
                            'value' => \Carbon\Carbon::now()->subYear()->toDateString()
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 3, // birth weight
                            'value' => random_int(10,20)/10.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 4, // adg from birth
                            'value' => random_int(4,15)/10.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 5, // end date (adg from birth)
                            'value' => \Carbon\Carbon::now()->toDateString()
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 6, // end weight (adg from birth)
                            'value' => random_int(90,160)/1.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 7, // adg on test
                            'value' => random_int(4,15)/10.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 8, // start date (adg on test)
                            'value' => \Carbon\Carbon::now()->subMonths(9)->toDateString()
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 9, // start weight (adg on test)
                            'value' => random_int(50,80)/1.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 10, // end date (adg on test)
                            'value' => \Carbon\Carbon::now()->subMonths(7)->toDateString()
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 11, // end weight (adg on test)
                            'value' => random_int(110,160)/1.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 12, // house type
                            'value' => $houseTypes[$swineHouseTypeIndex]
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 13, // bft
                            'value' => random_int(90,130)/10.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 14, // bft collected
                            'value' => \Carbon\Carbon::now()->subMonths(7)->toDateString()
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 15, // feed intake
                            'value' => random_int(100,200)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 16, // feed efficiency
                            'value' => random_int(10,60)/10.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 17, // teat number
                            'value' => random_int(6,8)*2
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 18, // parity
                            'value' => random_int(1,5)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 19, // total male born alive
                            'value' => random_int(3,9)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 20, // total female born alive
                            'value' => random_int(3,9)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 21, // littersize at weaning
                            'value' => random_int(6,16)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 22, // litterweight at weaning
                            'value' => random_int(36,96)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 23, // date at weaning
                            'value' => \Carbon\Carbon::now()->toDateString()
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 24, // farm swine id / ear mark
                            'value' => $farmGpDamId
                        ])
                    ]
                );

                // Attach photo to swine, GP sire, and GP dam
                // Swine
                $swinePhoto = new App\Models\Photo;
                $swinePhoto->name = $chosenBreedName . '_' . $sexes[$swineSexIndex] . '.jpg';
                $swine->photos()->save($swinePhoto);
                $swine->sidePhoto_id = $swinePhoto->id;

                // Sire
                $gpSirePhoto = new App\Models\Photo;
                $gpSirePhoto->name = $chosenBreedName . '_male.jpg';
                $gpSire->photos()->save($gpSirePhoto);
                $gpSire->sidePhoto_id = $gpSirePhoto->id;
                $gpSire->save();

                // Dam
                $gpDamPhoto = new App\Models\Photo;
                $gpDamPhoto->name = $chosenBreedName . '_female.jpg';
                $gpDam->photos()->save($gpDamPhoto);
                $gpDam->sidePhoto_id = $gpDamPhoto->id;
                $gpDam->save();

                // Attach GP sire and GP dam to swine
                $swine->gpSire_id = $gpSire->id;
                $swine->gpDam_id = $gpDam->id;
                $swine->save();

            } // endfor


        });
    }
}
