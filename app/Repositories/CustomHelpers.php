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
     * Get Provinces along with respective Province code
     *
     * @return  array
     */
    public function getProvinceOptions()
    {
        return [
            // Negros Island Rregion
            [
                'text'  => 'Negros Occidental (NEC)', 
                'value' => 'Negros Occidental ; NEC'
            ],
            [
                'text'  => 'Negros Oriental (NER)', 
                'value' => 'Negros Oriental ; NER'
            ],
            // Cordillera Administrative Region
            [
                'text'  => 'Abra (ABR)', 
                'value' => 'Abra ; ABR'
            ],
            [
                'text'  => 'Apayao (APA)', 
                'value' => 'Apayao ; APA'
            ],
            [
                'text'  => 'Benguet (BEN)', 
                'value' => 'Benguet ; BEN'
            ],
            [
                'text'  => 'Ifugao (IFU)', 
                'value' => 'Ifugao ; IFU'
            ],
            [
                'text'  => 'Kalinga (KAL)', 
                'value' => 'Kalinga ; KAL'
            ],
            [
                'text'  => 'Mountain Province (MOU)', 
                'value' => 'Mountain Province ; MOU'
            ],
            // Region I
            [
                'text'  => 'Ilocos Norte (ILN)', 
                'value' => 'Ilocos Norte ; ILN'
            ],
            [
                'text'  => 'Ilocos Sur (ILS)', 
                'value' => 'Ilocos Sur ; ILS'
            ],
            [
                'text'  => 'La Union (LUN)', 
                'value' => 'La Union ; LUN'
            ],
            [
                'text'  => 'Pangasinan (PAN)', 
                'value' => 'Pangasinan ; PAN'
            ],
            // Region II
            [
                'text'  => 'Batanes (BTN)', 
                'value' => 'Batanes ; BTN'
            ],
            [
                'text'  => 'Cagayan (CAG)',
                'value' => 'Cagayan ; CAG'
            ],
            [
                'text'  => 'Isabela (ISA)',
                'value' => 'Isabela ; ISA'
            ],
            [
                'text'  => 'Nueva Vizcaya (NUV)',
                'value' => 'Nueva Vizcaya ; NUV'
            ],
            [
                'text'  => 'Quirino (QUI)',
                'value' => 'Quirino ; QUI'
            ],
            // Region III
            [
                'text'  => 'Aurora (AUR)',
                'value' => 'Aurora ; AUR'
            ],
            [
                'text'  => 'Bataan (BAN)',
                'value' => 'Bataan ; BAN'
            ],
            [
                'text'  => 'Bulacan (BUL)',
                'value' => 'Bulacan ; BUL'
            ],
            [
                'text'  => 'Nueva Ecija (NUE)',
                'value' => 'Nueva Ecija ; NUE'
            ],
            [
                'text'  => 'Pampanga (PAM)',
                'value' => 'Pampanga ; PAM'
            ],
            [
                'text'  => 'Tarlac (TAR)',
                'value' =>'Tarlac ; TAR'
            ],
            [
                'text'  => 'Zambales (ZMB)',
                'value' => 'Zambales ; ZMB'
            ],
            // Region IV-A
            [
                'text'  => 'Batangas (BTG)',
                'value' => 'Batangas ; BTG'
            ],
            [
                'text'  => 'Cavite (CAV)',
                'value' => 'Cavite ; CAV'
            ],
            [
                'text'  => 'Laguna (LAG)',
                'value' => 'Laguna ; LAG'
            ],
            [
                'text'  => 'Quezon (QUE)',
                'value' => 'Quezon ; QUE'
            ],
            [
                'text'  => 'Rizal (RIZ)',
                'value' => 'Rizal ; RIZ'
            ],
            // Region IV-B
            [
                'text'  => 'Marinduque (MAD)',
                'value' => 'Marinduque ; MAD'
            ],
            [
                'text'  => 'Occidental Mindoro (MDC)',
                'value' => 'Occidental Mindoro ; MDC'
            ],
            [
                'text'  => 'Oriental Mindoro (MDR)',
                'value' => 'Oriental Mindoro ; MDR'
            ],
            [
                'text'  => 'Palawan (PLW)',
                'value' => 'Palawan ; PLW'
            ],
            [
                'text'  => 'Romblon (ROM)',
                'value' => 'Romblon ; ROM'
            ],
            // Region V
            [
                'text'  => 'Albay (ALB)',
                'value' => 'Albay ; ALB'
            ],
            [
                'text'  => 'Camarines Norte (CAN)',
                'value' => 'Camarines Norte ; CAN'
            ],
            [
                'text'  => 'Camarines Sur (CAS)',
                'value' => 'Camarines Sur ; CAS'
            ],
            [
                'text'  => 'Catanduanes (CAT)',
                'value' => 'Catanduanes ; CAT'
            ],
            [
                'text'  => 'Masbate (MAS)',
                'value' => 'Masbate ; MAS'
            ],
            [
                'text'  => 'Sorsogon (SOR)',
                'value' => 'Sorsogon ; SOR'
            ],
            // Region VI
            [
                'text'  => 'Aklan (AKL)',
                'value' => 'Aklan ; AKL'
            ],
            [
                'text'  => 'Antique (ANT)',
                'value' => 'Antique ; ANT'
            ],
            [
                'text'  => 'Capiz (CAP)',
                'value' => 'Capiz ; CAP'
            ],
            [
                'text'  => 'Guimaras (GUI)',
                'value' => 'Guimaras ; GUI'
            ],
            [
                'text'  => 'Iloilo (ILI)',
                'value' => 'Iloilo ; ILI'
            ],
            // Region VII
            [
                'text'  => 'Bohol (BOH)',
                'value' => 'Bohol ; BOH'
            ],
            [
                'text'  => 'Cebu (CEB)',
                'value' => 'Cebu ; CEB'
            ],
            [
                'text'  => 'Siquijor (SIG)',
                'value' => 'Siquijor ; SIG'
            ],
            // Region VIII
            [
                'text'  => 'Biliran (BIL)',
                'value' => 'Biliran ; BIL'
            ],
            [
                'text'  => 'Eastern Samar (EAS)',
                'value' => 'Eastern Samar ; EAS'
            ],
            [
                'text'  => 'Leyte (LEY)',
                'value' => 'Leyte ; LEY'
            ],
            [
                'text'  => 'Northern Samar (NSA)',
                'value' => 'Northern Samar ; NSA'
            ],
            [
                'text'  => 'Southern Leyte (SLE)',
                'value' => 'Southern Leyte ; SLE'
            ],
            [
                'text'  => 'Western Samar (WSA)',
                'value' => 'Western Samar ; WSA'
            ],
            // Region IX
            [
                'text'  => 'Zamboanga del Norte (ZAN)',
                'value' => 'Zamboanga del Norte ; ZAN'
            ],
            [
                'text'  => 'Zamboanga del Sur (ZAS)',
                'value' => 'Zamboanga del Sur ; ZAS'
            ],
            [
                'text'  => 'Zamboanga Sibugay (ZSI)',
                'value' => 'Zamboanga Sibugay ; ZSI'
            ],
            // Region X
            [
                'text'  => 'Bukidnon (BUK)',
                'value' => 'Bukidnon ; BUK'
            ],
            [
                'text'  => 'Camiguin (CAM)',
                'value' => 'Camiguin ; CAM'
            ],
            [
                'text'  => 'Lanao del Norte (LAN)',
                'value' => 'Lanao del Norte ; LAN'
            ],
            [
                'text'  => 'Misamis Occidental (MSC)',
                'value' => 'Misamis Occidental ; MSC'
            ],
            [
                'text'  => 'Misamis Oriental (MSR)',
                'value' => 'Misamis Oriental ; MSR'
            ],
            // Region XI
            [
                'text'  => 'Compostela Valley (COM)',
                'value' => 'Compostela Valley ; COM'
            ],
            [
                'text'  => 'Davao del Norte (DAV)',
                'value' => 'Davao del Norte ; DAV'
            ],
            [
                'text'  => 'Davao del Sur (DAS)',
                'value' => 'Davao del Sur ; DAS'
            ],
            [
                'text'  => 'Davao Occidental (DVO)',
                'value' => 'Davao Occidental ; DVO'
            ],
            [
                'text'  => 'Davao Oriental (DAO)',
                'value' => 'Davao Oriental ; DAO'
            ],
            // Region XII
            [
                'text'  => 'Sarangani (SAR)',
                'value' => 'Sarangani ; SAR'
            ],
            [
                'text'  => 'South Cotabato (SCO)',
                'value' => 'South Cotabato ; SCO'
            ],
            [
                'text'  => 'Sultan Kudarat (SUK)',
                'value' => 'Sultan Kudarat ; SUK'
            ],
            [
                'text'  => 'North Cotabato (NCO)',
                'value' => 'North Cotabato ; NCO'
            ],
            // Region XIII
            [
                'text'  => 'Agusan del Norte (AGN)',
                'value' => 'Agusan del Norte ; AGN'
            ],
            [
                'text'  => 'Agusan del Sur (AGS)',
                'value' => 'Agusan del Sur ; AGS'
            ],
            [
                'text'  => 'Dinagat Islands (DIN)',
                'value' => 'Dinagat Islands ; DIN'
            ],
            [
                'text'  => 'Surigao del Norte (SUN)',
                'value' => 'Surigao del Norte ; SUN'
            ],
            [
                'text'  => 'Surigao del Sur (SUR)',
                'value' => 'Surigao del Sur ; SUR'
            ],
            // ARMM
            [
                'text'  => 'Basilan (BAS)',
                'value' => 'Basilan ; BAS'
            ],
            [
                'text'  => 'Lanao del Sur (LAS)',
                'value' => 'Lanao del Sur ; LAS'
            ],
            [
                'text'  => 'Maguindanao (MAG)',
                'value' => 'Maguindanao ; MAG'
            ],
            [
                'text'  => 'Sulu (SLU)',
                'value' => 'Sulu ; SLU'
            ],
            [
                'text'  => 'Tawi-tawi (TAW)',
                'value' => 'Tawi-tawi ; TAW'
            ]
        ];
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
