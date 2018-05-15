<?php

namespace App\Repositories;

use Carbon\Carbon;

trait CustomFakers
{
    /**
     * Generate fake GP One Data
     *
     * @param   integer             $breedId
     * @return  associative array
     */
    public function createGpOneData($breedId)
    {
        $sexes = ['male', 'female'];
        $houseTypes = ['open', 'tunnel'];

        return [
            'breedId' =>               $breedId,
            'farmFromId' =>            1,
            'sex' =>                   $sexes[random_int(0,1)],
            'birthDate' =>             \Carbon\Carbon::now()->subYear()->toDateString(),
            'birthWeight' =>           random_int(10,20)/10.0,
            'adgBirth' =>              random_int(5,20)/10.0,
            'adgBirthEndDate' =>       \Carbon\Carbon::now()->toDateString(),
            'adgBirthEndWeight' =>     random_int(90,160)/1.0,
            'adgTest' =>               random_int(5,20)/10.0,
            'adgTestStartDate' =>      \Carbon\Carbon::now()->subMonths(9)->toDateString(),
            'adgTestStartWeight' =>    random_int(50,80)/1.0,
            'adgTestEndDate' =>        \Carbon\Carbon::now()->subMonths(7)->toDateString(),
            'adgTestEndWeight' =>      random_int(110,160)/1.0,
            'houseType' =>             $houseTypes[random_int(0,1)],
            'bft' =>                   random_int(90,130)/10.0,
            'bftCollected' =>          \Carbon\Carbon::now()->subMonths(7)->toDateString(),
            'feedIntake' =>            random_int(100,200),
            'feedEfficiency' =>        random_int(10,60)/10.0,
            'teatNo' =>                random_int(6,8)*2,
            'parity' =>                random_int(1,5),
            'littersizeAliveMale' =>   random_int(3,9),
            'littersizeAliveFemale' => random_int(3,9),
            'littersizeWeaning' =>     random_int(6,16),
            'litterweightWeaning' =>   random_int(36,96),
            'dateWeaning' =>           \Carbon\Carbon::now()->toDateString(),
            'farmSwineId' =>           random_int(1000,3000),
            'geneticInfoId' =>         str_random(4) . '-' . random_int(1000,3000),
            'swinecart' =>             1
        ];
    }

    /**
     * Generate fake GP Parent Data
     *
     * @param   string              $status
     * @param   string              $sex
     * @param   integer             $breedId
     * @return  associative array
     */
    public function createGpParentData($status, $sex, $breedId)
    {
        switch ($status) {
            case 'new':
                $houseTypes = ['open', 'tunnel'];

                return [
                    'status' =>                $status,
                    'existingRegNo' =>         '',
                    'imported' => [
                        'regNo' =>             '',
                        'farmOfOrigin' =>      '',
                        'countryOfOrigin' =>   ''
                    ],
                    'breedId' =>               $breedId,
                    'farmFromId' =>            1,
                    'sex' =>                   $sex,
                    'birthDate' =>             \Carbon\Carbon::now()->subYear()->toDateString(),
                    'birthWeight' =>           random_int(10,20)/10.0,
                    'adgBirth' =>              random_int(5,20)/10.0,
                    'adgBirthEndDate' =>       \Carbon\Carbon::now()->toDateString(),
                    'adgBirthEndWeight' =>     random_int(90,150)/1.0,
                    'adgTest' =>               random_int(5,20)/10.0,
                    'adgTestStartDate' =>      \Carbon\Carbon::now()->subMonths(9)->toDateString(),
                    'adgTestStartWeight' =>    random_int(50,80)/1.0,
                    'adgTestEndDate' =>        \Carbon\Carbon::now()->subMonths(7)->toDateString(),
                    'adgTestEndWeight' =>      random_int(110,160)/1.0,
                    'houseType' =>             $houseTypes[random_int(0,1)],
                    'bft' =>                   random_int(90,130)/10.0,
                    'bftCollected' =>          \Carbon\Carbon::now()->subMonths(7)->toDateString(),
                    'feedIntake' =>            random_int(100,200),
                    'feedEfficiency' =>        random_int(10,60)/10.0,
                    'teatNo' =>                random_int(6,8)*2,
                    'parity' =>                random_int(1,5),
                    'littersizeAliveMale' =>   random_int(3,9),
                    'littersizeAliveFemale' => random_int(3,9),
                    'littersizeWeaning' =>     random_int(6,16),
                    'litterweightWeaning' =>   random_int(36,96),
                    'dateWeaning' =>           \Carbon\Carbon::now()->toDateString(),
                    'farmSwineId' =>           random_int(1000,3000),
                    'geneticInfoId' =>         str_random(4) . '-' . random_int(1000,3000),
                    'swinecart' =>             0
                ];

            case 'imported':
                return [
                    'status' =>                'imported',
                    'existingRegNo' =>         '',
                    'imported' => [
                        'regNo' =>             str_random(15),
                        'farmOfOrigin' =>      'Jomax & Jayes Farms',
                        'countryOfOrigin' =>   'Ireland'
                    ],
                    'breedId' =>               '',
                    'farmFromId' =>            '',
                    'sex' =>                   '',
                    'birthDate' =>             '',
                    'birthWeight' =>           '',
                    'adgBirth' =>              '',
                    'adgBirthEndDate' =>       '',
                    'adgBirthEndWeight' =>     '',
                    'adgTest' =>               '',
                    'adgTestStartDate' =>      '',
                    'adgTestStartWeight' =>    '',
                    'adgTestEndDate' =>        '',
                    'adgTestEndWeight' =>      '',
                    'houseType' =>             '',
                    'bft' =>                   '',
                    'bftCollected' =>          '',
                    'feedIntake' =>            '',
                    'feedEfficiency' =>        '',
                    'teatNo' =>                '',
                    'parity' =>                '',
                    'littersizeAliveMale' =>   '',
                    'littersizeAliveFemale' => '',
                    'littersizeWeaning' =>     '',
                    'litterweightWeaning' =>   '',
                    'dateWeaning' =>           '',
                    'farmSwineId' =>           '',
                    'geneticInfoId' =>         '',
                    'swinecart' =>             0
                ];

            case 'registered':
                return [
                    'status' =>                $status,
                    'existingRegNo' =>         str_random(15),
                    'imported' => [
                        'regNo' =>             '',
                        'farmOfOrigin' =>      '',
                        'countryOfOrigin' =>   ''
                    ],
                    'breedId' =>               '',
                    'farmFromId' =>            '',
                    'sex' =>                   '',
                    'birthDate' =>             '',
                    'birthWeight' =>           '',
                    'adgBirth' =>              '',
                    'adgBirthEndDate' =>       '',
                    'adgBirthEndWeight' =>     '',
                    'adgTest' =>               '',
                    'adgTestStartDate' =>      '',
                    'adgTestStartWeight' =>    '',
                    'adgTestEndDate' =>        '',
                    'adgTestEndWeight' =>      '',
                    'houseType' =>             '',
                    'bft' =>                   '',
                    'bftCollected' =>          '',
                    'feedIntake' =>            '',
                    'feedEfficiency' =>        '',
                    'teatNo' =>                '',
                    'parity' =>                '',
                    'littersizeAliveMale' =>   '',
                    'littersizeAliveFemale' => '',
                    'littersizeWeaning' =>     '',
                    'litterweightWeaning' =>   '',
                    'dateWeaning' =>           '',
                    'farmSwineId' =>           '',
                    'geneticInfoId' =>         '',
                    'swinecart' =>             ''
                ];

            default: break;
        }
    }

}
