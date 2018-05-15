<?php

namespace App\Repositories;

use App\Models\Breed;
use App\Models\Farm;
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

    /**
     * Changes "Y-m-d" date format to  readable format "F d, Y"
     * Ex. "2018-04-18" -> "April 18, 2018"
     *
     * Or just get the year of "Y-m-d" format
     *
     * @param   string
     * @return  string
     */
    public function changeDateFormat($originalFormat, $toFormat = '')
    {
        switch ($toFormat) {
            case 'year':
                return ($originalFormat)
                    ? Carbon::createFromFormat('Y-m-d', $originalFormat)->format('Y')
                    : '';

            default:
                return ($originalFormat)
                    ? Carbon::createFromFormat('Y-m-d', $originalFormat)->format('F d, Y')
                    : '';
        }
    }

    /**
     * Append Farm name with Province
     *
     * @param   integer     $farm
     * @return  string
     */
    public function getFarmNameWithProvince($farmId)
    {
        $farm = Farm::find($farmId);

        return "{$farm->name}" . ", " . "{$farm->province}";
    }

    /**
     * Get breed title
     *
     * @param   integer     $breedId
     * @return  string
     */
    public function getBreedTitle($breedId)
    {
        return Breed::find($breedId)->title;
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
