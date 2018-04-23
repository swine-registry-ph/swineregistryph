<?php

namespace App\Repositories;

use Carbon\Carbon;

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
     * Changes "Y-m-d" date format to "F d, Y"
     * Ex. "2018-04-18" -> "April 18, 2018"
     *
     * @param   string
     * @return  string
     */
    public function changeDateFormat($originalFormat)
    {
        return ($originalFormat)
            ? Carbon::createFromFormat('Y-m-d', $originalFormat)->format('F d, Y')
            : '';
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
