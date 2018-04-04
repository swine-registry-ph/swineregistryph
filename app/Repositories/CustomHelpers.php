<?php

namespace App\Repositories;

trait CustomHelpers
{
    /**
     * Generate Registration number of swine according to the following naming system:
     * [Location][Farm][Breed][BirthYear][Gender][Tunnel/Open]-earmark/farmID
     * Ex. DAOJJLW16MT-1896
     *
     * @param
     * @return string
     */
    function generateRegistrationNumber($farmProvinceCode,
                                        $farmCode,
                                        $breedCode,
                                        $birthYear,
                                        $gender,
                                        $houseType,
                                        $earMark)
    {
        return "{$farmProvinceCode}{$farmCode}{$breedCode}{$birthYear}{$gender}{$houseType}-{$earMark}";
    }
}
