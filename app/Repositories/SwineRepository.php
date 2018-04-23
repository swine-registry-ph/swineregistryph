<?php

namespace App\Repositories;

use App\Models\Breed;
use App\Models\Farm;
use App\Models\Swine;
use App\Models\SwineProperty;
use App\Repositories\CustomHelpers;
use Carbon\Carbon;

use Auth;

class SwineRepository
{
    use CustomHelpers;

    /**
     * Add parent and its properties
     *
     * @param   array   $swine
     * @return  Swine
     */
    public function addParent($swine)
    {
        $breederUser = Auth::user()->userable()->first();

        if(isset($swine['existingRegNo'])) {
            // For existing swine
            return Swine::where('registration_no', $swine['existingRegNo'])->first();
        }
        else if(isset($swine['imported']['regNo'])){
            // For imported swine

            // Swine Instance. Note: 0 in farm_id
            // denotes imported swine
            $swineInstance = new Swine;
            $swineInstance->breeder_id = $breederUser->id;
            $swineInstance->registration_no = $swine['imported']['regNo'];
            $swineInstance->farm_id = 0;
            $swineInstance->breed_id = $swine['breedId'];
            $swineInstance->date_registered = Carbon::now();
            $swineInstance->gpSire_id = null;
            $swineInstance->gpDam_id = null;
            $swineInstance->save();

            // Swine Properties
            $swineInstance->swineProperties()->saveMany(
                [
                    new SwineProperty([
                        'property_id' => 26, // farm of origin
                        'value'       => $swine['imported']['farmOfOrigin']
                    ]),
                    new SwineProperty([
                        'property_id' => 27, // country of origin
                        'value'       => $swine['imported']['countryOfOrigin']
                    ])
                ]
            );

            return $swineInstance;
        }
        else {
            // For new swine
            $data = [
                'farmProvinceCode' => Farm::find($swine['farmFromId'])->province_code,
                'farmCode'         => Farm::find($swine['farmFromId'])->farm_code,
                'breedCode'        => Breed::find($swine['breedId'])->code,
                'birthYear'        => Carbon::createFromFormat('F d, Y', $swine['birthDate'])->year,
                'sex'              => $swine['sex'],
                'houseType'        => $swine['houseType'],
                'farmSwineId'      => $swine['farmSwineId']
            ];

            // Swine Instance
            $swineInstance = new Swine;
            $swineInstance->breeder_id = $breederUser->id;
            $swineInstance->registration_no = $this->generateRegistrationNumber($data);
            $swineInstance->farm_id = $swine['farmFromId'];
            $swineInstance->breed_id = $swine['breedId'];
            $swineInstance->date_registered = Carbon::now();
            $swineInstance->gpSire_id = null;
            $swineInstance->gpDam_id = null;
            $swineInstance->save();

            // Swine Properties
            $swineInstance->swineProperties()->saveMany(
                [
                    new SwineProperty([
                        'property_id' => 1, // sex
                        'value'       => $swine['sex']
                    ]),
                    new SwineProperty([
                        'property_id' => 2, // birthdate
                        'value'       => Carbon::createFromFormat('F d, Y', $swine['birthDate'])->toDateString()
                    ]),
                    new SwineProperty([
                        'property_id' => 3, // birth weight
                        'value'       => $swine['birthWeight']
                    ]),
                    new SwineProperty([
                        'property_id' => 4, // adg from birth
                        'value'       => $swine['adgBirth']
                    ]),
                    new SwineProperty([
                        'property_id' => 5, // end date (adg from birth)
                        'value'       => Carbon::createFromFormat('F d, Y', $swine['adgBirthEndDate'])->toDateString()
                    ]),
                    new SwineProperty([
                        'property_id' => 6, // end weight (adg from birth)
                        'value'       => $swine['adgBirthEndWeight']
                    ]),
                    new SwineProperty([
                        'property_id' => 7, // adg on test
                        'value'       => $swine['adgTest']
                    ]),
                    new SwineProperty([
                        'property_id' => 8, // start date (adg on test)
                        'value'       => Carbon::createFromFormat('F d, Y', $swine['adgTestStartDate'])->toDateString()
                    ]),
                    new SwineProperty([
                        'property_id' => 9, // start weight (adg on test)
                        'value'       => $swine['adgTestStartWeight']
                    ]),
                    new SwineProperty([
                        'property_id' => 10, // end date (adg on test)
                        'value'       => Carbon::createFromFormat('F d, Y', $swine['adgTestEndDate'])->toDateString()
                    ]),
                    new SwineProperty([
                        'property_id' => 11, // end weight (adg on test)
                        'value'       => $swine['adgTestEndWeight']
                    ]),
                    new SwineProperty([
                        'property_id' => 12, // house type
                        'value'       => $swine['houseType']
                    ]),
                    new SwineProperty([
                        'property_id' => 13, // bft
                        'value'       => $swine['bft']
                    ]),
                    new SwineProperty([
                        'property_id' => 14, // bft collected
                        'value'       => $swine['bftCollected']
                    ]),
                    new SwineProperty([
                        'property_id' => 15, // feed intake
                        'value'       => $swine['feedIntake']
                    ]),
                    new SwineProperty([
                        'property_id' => 16, // feed efficiency
                        'value'       => $swine['feedEfficiency']
                    ]),
                    new SwineProperty([
                        'property_id' => 17, // teat number
                        'value'       => $swine['teatNo']
                    ]),
                    new SwineProperty([
                        'property_id' => 18, // parity
                        'value'       => $swine['parity']
                    ]),
                    new SwineProperty([
                        'property_id' => 19, // total male born alive
                        'value'       => $swine['littersizeAliveMale']
                    ]),
                    new SwineProperty([
                        'property_id' => 20, // total female born alive
                        'value'       => $swine['littersizeAliveFemale']
                    ]),
                    new SwineProperty([
                        'property_id' => 21, // littersize at weaning
                        'value'       => $swine['littersizeWeaning']
                    ]),
                    new SwineProperty([
                        'property_id' => 22, // litterweight at weaning
                        'value'       => $swine['litterweightWeaning']
                    ]),
                    new SwineProperty([
                        'property_id' => 23, // date at weaning
                        'value'       => $swine['dateWeaning']
                    ]),
                    new SwineProperty([
                        'property_id' => 24, // farm swine id / ear mark
                        'value'       => $swine['farmSwineId']
                    ]),
                    new SwineProperty([
                        'property_id' => 25, // genetic info id
                        'value'       => $swine['geneticInfoId']
                    ])
                ]
            );

            return $swineInstance;
        }
    }

    /**
     * Add swine, its parents, and its properties
     *
     * @param   array       $swine
     * @param   integer     $sire
     * @param   integer     $dam
     * @return  Swine
     */
    public function addSwine($swine, $sireId, $damId)
    {
        $breederUser = Auth::user()->userable()->first();

        $data = [
            'farmProvinceCode' => Farm::find($swine['farmFromId'])->province_code,
            'farmCode'         => Farm::find($swine['farmFromId'])->farm_code,
            'breedCode'        => Breed::find($swine['breedId'])->code,
            'birthYear'        => Carbon::createFromFormat('F d, Y', $swine['birthDate'])->year,
            'sex'              => $swine['sex'],
            'houseType'        => $swine['houseType'],
            'farmSwineId'      => $swine['farmSwineId']
        ];

        // Swine Instance
        $swineInstance = new Swine;
        $swineInstance->breeder_id = $breederUser->id;
        $swineInstance->registration_no = $this->generateRegistrationNumber($data);
        $swineInstance->farm_id = $swine['farmFromId'];
        $swineInstance->breed_id = $swine['breedId'];
        $swineInstance->date_registered = Carbon::now();
        $swineInstance->gpSire_id = $sireId;
        $swineInstance->gpDam_id = $damId;
        $swineInstance->swinecart = ($swine['swinecart']) ? 1 : 0;
        $swineInstance->save();

        // Swine Properties
        $swineInstance->swineProperties()->saveMany(
            [
                new SwineProperty([
                    'property_id' => 1, // sex
                    'value'       => $swine['sex']
                ]),
                new SwineProperty([
                    'property_id' => 2, // birthdate
                    'value'       => Carbon::createFromFormat('F d, Y', $swine['birthDate'])->toDateString()
                ]),
                new SwineProperty([
                    'property_id' => 3, // birth weight
                    'value'       => $swine['birthWeight']
                ]),
                new SwineProperty([
                    'property_id' => 4, // adg from birth
                    'value'       => $swine['adgBirth']
                ]),
                new SwineProperty([
                    'property_id' => 5, // end date (adg from birth)
                    'value'       => Carbon::createFromFormat('F d, Y', $swine['adgBirthEndDate'])->toDateString()
                ]),
                new SwineProperty([
                    'property_id' => 6, // end weight (adg from birth)
                    'value'       => $swine['adgBirthEndWeight']
                ]),
                new SwineProperty([
                    'property_id' => 7, // adg on test
                    'value'       => $swine['adgTest']
                ]),
                new SwineProperty([
                    'property_id' => 8, // start date (adg on test)
                    'value'       => Carbon::createFromFormat('F d, Y', $swine['adgTestStartDate'])->toDateString()
                ]),
                new SwineProperty([
                    'property_id' => 9, // start weight (adg on test)
                    'value'       => $swine['adgTestStartWeight']
                ]),
                new SwineProperty([
                    'property_id' => 10, // end date (adg on test)
                    'value'       => Carbon::createFromFormat('F d, Y', $swine['adgTestEndDate'])->toDateString()
                ]),
                new SwineProperty([
                    'property_id' => 11, // end weight (adg on test)
                    'value'       => $swine['adgTestEndWeight']
                ]),
                new SwineProperty([
                    'property_id' => 12, // house type
                    'value'       => $swine['houseType']
                ]),
                new SwineProperty([
                    'property_id' => 13, // bft
                    'value'       => $swine['bft']
                ]),
                new SwineProperty([
                    'property_id' => 14, // bft collected
                    'value'       => $swine['bftCollected']
                ]),
                new SwineProperty([
                    'property_id' => 15, // feed intake
                    'value'       => $swine['feedIntake']
                ]),
                new SwineProperty([
                    'property_id' => 16, // feed efficiency
                    'value'       => $swine['feedEfficiency']
                ]),
                new SwineProperty([
                    'property_id' => 17, // teat number
                    'value'       => $swine['teatNo']
                ]),
                new SwineProperty([
                    'property_id' => 18, // parity
                    'value'       => $swine['parity']
                ]),
                new SwineProperty([
                    'property_id' => 19, // total male born alive
                    'value'       => $swine['littersizeAliveMale']
                ]),
                new SwineProperty([
                    'property_id' => 20, // total female born alive
                    'value'       => $swine['littersizeAliveFemale']
                ]),
                new SwineProperty([
                    'property_id' => 21, // littersize at weaning
                    'value'       => $swine['littersizeWeaning']
                ]),
                new SwineProperty([
                    'property_id' => 22, // litterweight at weaning
                    'value'       => $swine['litterweightWeaning']
                ]),
                new SwineProperty([
                    'property_id' => 23, // date at weaning
                    'value'       => $swine['dateWeaning']
                ]),
                new SwineProperty([
                    'property_id' => 24, // farm swine id / ear mark
                    'value'       => $swine['farmSwineId']
                ]),
                new SwineProperty([
                    'property_id' => 25, // genetic info id
                    'value'       => $swine['geneticInfoId']
                ])
            ]
        );

        return $swineInstance;
    }

    /**
     * Wrapper for getting a specific property of swine
     *
     * @param   Swine    $swine
     * @param   integer  $propertyId
     * @return  string
     */
    public function getSwinePropValue($swine, $propertyId)
    {
        return $swine->swineProperties->where('property_id', $propertyId)->first()->value
            ?? '';
    }

}
