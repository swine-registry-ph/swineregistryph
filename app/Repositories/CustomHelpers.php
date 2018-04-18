<?php

namespace App\Repositories;

trait CustomHelpers
{
    /**
     * Generate Registration number of swine according to the following naming system:
     * [Location][Farm][Breed][BirthYear][Gender][Tunnel/Open]-earmark/farmID
     * Ex. DAOJJLW16MT-1896
     *
     * @param   array   $requiredData
     * @return  string
     */
    public function generateRegistrationNumber($requiredData)
    {
        return "{$requiredData['farmProvinceCode']}"
                . "{$requiredData['farmCode']}"
                . "{$requiredData['breedCode']}"
                . "{$requiredData['birthYear']}"
                . "{$this->firstLetterUpper($requiredData['sex'])}"
                . "{$this->firstLetterUpper($requiredData['houseType'])}"
                . "-"
                . "{$requiredData['farmSwineId']}";
    }

    /**
     * Turns first letter of string to uppercase
     * and return 1st letter
     *
     * @param   string  $string
     * @return  string
     */
    private function firstLetterUpper($string)
    {
        return strtoupper(substr($string, 0, 1));
    }

}
