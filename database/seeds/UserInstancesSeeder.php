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

        // For Breeders
        factory(App\Models\User::class, 5)->create()->each(function ($user) {

            // Create Breeder Profile
            $breeder = factory(App\Models\Breeder::class)->create();
            $breeder->users()->save($user);

            /**
             * 1. Add Farm first to User
             */

            // How do we even create a farm code? Current implementation
            // is getting the first three characters of $user->name
            // then making it all uppercase letters
            $farm = factory(App\Models\Farm::class)->create([
                'farm_code' => strtoupper(substr($user->name, 0, 3)),
                'farm_accreditation_no' => random_int(1000, 3000)
            ]);

            // Attach farm to breeder
            $breeder->farms()->save($farm);

            /**
             * 2. Add Swine Collection
             */
            // Need to contextualize properties like age/weight when data was collected
            // especially in GP A/Sire (father of pig) and GP B/Dam (mother of pig)

            $sexes = ['male', 'female'];
            $houseTypes = ['open', 'tunnel'];
            $breeds = [
                [ 'id' => 1, 'name' => 'landrace', 'code' => 'LD' ],
                [ 'id' => 2, 'name' => 'largewhite', 'code' => 'LW' ],
                [ 'id' => 3, 'name' => 'duroc', 'code' => 'DR' ],
                [ 'id' => 4, 'name' => 'pietrain', 'code' => 'PT' ]
            ];

            // Insert 5 default swines
            for($i = 0; $i < 5; $i++){
                $swineBreedIndex = random_int(0,3);
                $swineSexIndex = random_int(0,1);
                $swineHouseTypeIndex = random_int(0,1);
                $chosenBreedName = $breeds[$swineBreedIndex]['name'];
                $chosenBreedId = $breeds[$swineBreedIndex]['id'];

                $swine = factory(App\Models\Swine::class)->create([
                    'breed_id' => $chosenBreedId,
                    'breeder_id' => $breeder->id,
                    'farm_id' => $farm->id,
                    'registration_no' => $this->generateRegistrationNumber(
                                            $farm->province_code,
                                            $farm->farm_code,
                                            $breeds[$swineBreedIndex]['code'],
                                            \Carbon\Carbon::now()->subYear()->year,
                                            strtoupper(substr($sexes[$swineSexIndex], 0, 1)),
                                            strtoupper(substr($houseTypes[$swineHouseTypeIndex], 0, 1)),
                                            random_int(1000, 2000)
                                        )
                ]);

                // Properties are as follows: sex, birth_date, birth_weight, collected_weight,
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
                            'property_id' => 4, // weight when data was collected
                            'value' => random_int(70,130)/1.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 6, // end date (adg from birth)
                            'value' => \Carbon\Carbon::now()
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 7, // end weight (adg from birth)
                            'value' => random_int(70,130)/1.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 9, // start date (adg on test)
                            'value' => \Carbon\Carbon::now()->subMonths(9)->toDateString()
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 10, // start weight (adg on test)
                            'value' => random_int(70,130)/1.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 11, // end date (adg on test)
                            'value' => random_int(70,110)/100.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 12, // end weight (adg on test)
                            'value' => random_int(70,110)/100.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 13, // house type
                            'value' => $houseTypes[$swineHouseTypeIndex]
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 14, // bft
                            'value' => random_int(90,130)/10.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 15, // feed efficiency
                            'value' => random_int(10,30)/10.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 16, // teat number
                            'value' => random_int(6,8)*2
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 17, // parity
                            'value' => random_int(1,5)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 18, // total male born alive
                            'value' => random_int(3,9)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 19, // total female born alive
                            'value' => random_int(3,9)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 20, // littersize at weaning
                            'value' => random_int(6,16)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 21, // litterweight at weaning
                            'value' => random_int(36,96)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 22, // date at weaning
                            'value' => \Carbon\Carbon::now()->toDateString()
                        ])
                    ]
                );

                // Create default GP sire of swine
                $gpSire = factory(App\Models\Swine::class)->create([
                    'breed_id' => $chosenBreedId,
                    'breeder_id' => $breeder->id,
                    'farm_id' => $farm->id,
                    'registration_no' => $this->generateRegistrationNumber(
                                            $farm->province_code,
                                            $farm->farm_code,
                                            $breeds[$swineBreedIndex]['code'],
                                            \Carbon\Carbon::now()->subYear()->year,
                                            'M',
                                            strtoupper(substr($houseTypes[$swineHouseTypeIndex], 0, 1)),
                                            random_int(1000, 2000)
                                        )
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
                            'property_id' => 4, // weight when data was collected
                            'value' => random_int(70,130)/1.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 6, // end date (adg from birth)
                            'value' => \Carbon\Carbon::now()
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 7, // end weight (adg from birth)
                            'value' => random_int(70,130)/1.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 9, // start date (adg on test)
                            'value' => \Carbon\Carbon::now()->subMonths(9)->toDateString()
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 10, // start weight (adg on test)
                            'value' => random_int(70,130)/1.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 11, // end date (adg on test)
                            'value' => random_int(70,110)/100.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 12, // end weight (adg on test)
                            'value' => random_int(70,110)/100.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 13, // house type
                            'value' => $houseTypes[$swineHouseTypeIndex]
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 14, // bft
                            'value' => random_int(90,130)/10.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 15, // feed efficiency
                            'value' => random_int(10,30)/10.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 16, // teat number
                            'value' => random_int(6,8)*2
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 17, // parity
                            'value' => random_int(1,5)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 18, // total male born alive
                            'value' => random_int(3,9)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 19, // total female born alive
                            'value' => random_int(3,9)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 20, // littersize at weaning
                            'value' => random_int(6,16)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 21, // litterweight at weaning
                            'value' => random_int(36,96)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 22, // date at weaning
                            'value' => \Carbon\Carbon::now()->toDateString()
                        ])
                    ]
                );

                // Create default GP dam of swine
                $gpDam = factory(App\Models\Swine::class)->create([
                    'breed_id' => $chosenBreedId,
                    'breeder_id' => $breeder->id,
                    'farm_id' => $farm->id,
                    'registration_no' => $this->generateRegistrationNumber(
                                            $farm->province_code,
                                            $farm->farm_code,
                                            $breeds[$swineBreedIndex]['code'],
                                            \Carbon\Carbon::now()->subYear()->year,
                                            'F',
                                            strtoupper(substr($houseTypes[$swineHouseTypeIndex], 0, 1)),
                                            random_int(1000, 2000)
                                        )
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
                            'property_id' => 4, // weight when data was collected
                            'value' => random_int(70,130)/1.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 6, // end date (adg from birth)
                            'value' => \Carbon\Carbon::now()
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 7, // end weight (adg from birth)
                            'value' => random_int(70,130)/1.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 9, // start date (adg on test)
                            'value' => \Carbon\Carbon::now()->subMonths(9)->toDateString()
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 10, // start weight (adg on test)
                            'value' => random_int(70,130)/1.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 11, // end date (adg on test)
                            'value' => random_int(70,110)/100.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 12, // end weight (adg on test)
                            'value' => random_int(70,110)/100.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 13, // house type
                            'value' => $houseTypes[$swineHouseTypeIndex]
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 14, // bft
                            'value' => random_int(90,130)/10.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 15, // feed efficiency
                            'value' => random_int(10,30)/10.0
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 16, // teat number
                            'value' => random_int(6,8)*2
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 17, // parity
                            'value' => random_int(1,5)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 18, // total male born alive
                            'value' => random_int(3,9)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 19, // total female born alive
                            'value' => random_int(3,9)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 20, // littersize at weaning
                            'value' => random_int(6,16)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 21, // litterweight at weaning
                            'value' => random_int(36,96)
                        ]),
                        new App\Models\SwineProperty([
                            'property_id' => 22, // date at weaning
                            'value' => \Carbon\Carbon::now()->toDateString()
                        ])
                    ]
                );

                // Attach photo and certificate to swine, GP sire, and GP dam
                // Swine
                $swinePhoto = new App\Models\Photo;
                $swinePhoto->name = $chosenBreedName . '_' . $sexes[$swineSexIndex] . '.jpg';
                $swine->photos()->save($swinePhoto);
                $swine->primaryPhoto_id = $swinePhoto->id;

                $swineCertificate = new App\Models\Certificate;
                $swine->certificate()->save($swineCertificate);

                $swineCertficatePhoto = new App\Models\Photo;
                $swineCertficatePhoto->name = 'certificate_default.jpg';
                $swineCertificate->photos()->save($swineCertficatePhoto);

                // Sire
                $gpSirePhoto = new App\Models\Photo;
                $gpSirePhoto->name = $chosenBreedName . '_male.jpg';
                $gpSire->photos()->save($gpSirePhoto);
                $gpSire->primaryPhoto_id = $gpSirePhoto->id;
                $gpSire->save();

                $gpSireCertificate = new App\Models\Certificate;
                $gpSire->certificate()->save($gpSireCertificate);

                $gpSireCertficatePhoto = new App\Models\Photo;
                $gpSireCertficatePhoto->name = 'certificate_default.jpg';
                $gpSireCertificate->photos()->save($gpSireCertficatePhoto);

                // Dam
                $gpDamPhoto = new App\Models\Photo;
                $gpDamPhoto->name = $chosenBreedName . '_female.jpg';
                $gpDam->photos()->save($gpDamPhoto);
                $gpDam->primaryPhoto_id = $gpDamPhoto->id;
                $gpDam->save();

                $gpDamCertificate = new App\Models\Certificate;
                $gpDam->certificate()->save($gpDamCertificate);

                $gpDamCertficatePhoto = new App\Models\Photo;
                $gpDamCertficatePhoto->name = 'certificate_default.jpg';
                $gpDamCertificate->photos()->save($gpDamCertficatePhoto);

                // Attach GP sire and GP dam to swine
                $swine->gpSire_id = $gpSire->id;
                $swine->gpDam_id = $gpDam->id;
                $swine->save();

            } // endfor


        });
    }
}
