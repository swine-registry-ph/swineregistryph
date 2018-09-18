<?php

namespace App\Repositories;

use App\Models\Farm;
use App\Models\Genomics;
use App\Models\LaboratoryResult;
use App\Models\LaboratoryTest;
use App\Repositories\CustomHelpers;
use Illuminate\Http\Request;

use Carbon\Carbon;

class GenomicsRepository
{
    use CustomHelpers;

    /**
     * Add laboratory results for genomics
     *
     * @param   Request             $request
     * @param   Genomics            $genomicsUser
     * @return  LaboratoryResult
     */
    public function addLabResults(Request $request, Genomics $genomicsUser)
    {

        $labResult = new LaboratoryResult;

        $labResult->farm_id = $request->farmId ?? null;
        $labResult->farm_name = $request->farmName ?? null;
        $labResult->laboratory_result_no = $request->laboratoryResultNo;
        $labResult->animal_id = $request->animalId;
        $labResult->sex = $request->sex;
        $labResult->date_result = Carbon::createFromFormat(
            'F d, Y', 
            $request->dateResult)
            ->toDateString();
        $labResult->date_submitted = Carbon::createFromFormat(
            'F d, Y', 
            $request->dateSubmitted)
            ->toDateString();
        
        $genomicsUser->laboratoryResults()->save($labResult);

        if($request->tests['esr']) {
            $this->addSpecificTest($labResult, 1, $request->tests['esr']);
        }

        if($request->tests['prlr']) {
            $this->addSpecificTest($labResult, 2, $request->tests['prlr']);
        }

        if($request->tests['rbp4']) {
            $this->addSpecificTest($labResult, 3, $request->tests['rbp4']);
        }

        if($request->tests['lif']) {
            $this->addSpecificTest($labResult, 4, $request->tests['lif']);
        }

        if($request->tests['hfabp']) {
            $this->addSpecificTest($labResult, 5, $request->tests['hfabp']);
        }

        if($request->tests['igf2']) {
            $this->addSpecificTest($labResult, 6, $request->tests['igf2']);
        }

        if($request->tests['lepr']) {
            $this->addSpecificTest($labResult, 7, $request->tests['lepr']);
        }

        if($request->tests['myog']) {
            $this->addSpecificTest($labResult, 8, $request->tests['myog']);
        }

        if($request->tests['pss']) {
            $this->addSpecificTest($labResult, 9, $request->tests['pss']);
        }

        if($request->tests['rn']) {
            $this->addSpecificTest($labResult, 10, $request->tests['rn']);
        }

        if($request->tests['bax']) {
            $this->addSpecificTest($labResult, 11, $request->tests['bax']);
        }

        if($request->tests['fut1']) {
            $this->addSpecificTest($labResult, 12, $request->tests['fut1']);
        }

        if($request->tests['mx1']) {
            $this->addSpecificTest($labResult, 13, $request->tests['mx1']);
        }

        if($request->tests['nramp']) {
            $this->addSpecificTest($labResult, 14, $request->tests['nramp']);
        }

        if($request->tests['bpi']) {
            $this->addSpecificTest($labResult, 15, $request->tests['bpi']);
        }

        return $labResult;
    }

    /**
     * Add laboratory results for genomics
     *
     * @param   LaboratoryResult    $labResult
     * @param   Request             $labResult
     * @return  Array
     */
    public function updateLabResults(LaboratoryResult $labResult, Request $request)
    {
        $labResult->farm_id = $request->farmId ?? null;
        $labResult->farm_name = $request->farmName ?? null;
        $labResult->laboratory_result_no = $request->laboratoryResultNo;
        $labResult->animal_id = $request->animalId;
        $labResult->sex = $request->sex;
        $labResult->date_result = Carbon::createFromFormat(
            'F d, Y', 
            $request->dateResult)
            ->toDateString();
        $labResult->date_submitted = Carbon::createFromFormat(
            'F d, Y', 
            $request->dateSubmitted)
            ->toDateString();
        
        $labResult->save();

        // Check if test is already existing. If not,
        // then create a new laboratory test
        if($request->tests['esr']) {
            $labTestExists = $labResult->laboratoryTests()->where('test_id', 1)->first();

            if($labTestExists) $this->updateSpecificTest($labTestExists, $request->tests['esr']);
            else $this->addSpecificTest($labResult, 1, $request->tests['esr']);
        }

        if($request->tests['prlr']) {
            $labTestExists = $labResult->laboratoryTests()->where('test_id', 2)->first();
            
            if($labTestExists) $this->updateSpecificTest($labTestExists, $request->tests['prlr']);
            $this->addSpecificTest($labResult, 2, $request->tests['prlr']);
        }

        if($request->tests['rbp4']) {
            $labTestExists = $labResult->laboratoryTests()->where('test_id', 3)->first();
            
            if($labTestExists) $this->updateSpecificTest($labTestExists, $request->tests['rbp4']);
            $this->addSpecificTest($labResult, 3, $request->tests['rbp4']);
        }

        if($request->tests['lif']) {
            $labTestExists = $labResult->laboratoryTests()->where('test_id', 4)->first();
            
            if($labTestExists) $this->updateSpecificTest($labTestExists, $request->tests['lif']);
            $this->addSpecificTest($labResult, 4, $request->tests['lif']);
        }

        if($request->tests['hfabp']) {
            $labTestExists = $labResult->laboratoryTests()->where('test_id', 5)->first();
            
            if($labTestExists) $this->updateSpecificTest($labTestExists, $request->tests['hfabp']);
            $this->addSpecificTest($labResult, 5, $request->tests['hfabp']);
        }

        if($request->tests['igf2']) {
            $labTestExists = $labResult->laboratoryTests()->where('test_id', 6)->first();
            
            if($labTestExists) $this->updateSpecificTest($labTestExists, $request->tests['igf2']);
            $this->addSpecificTest($labResult, 6, $request->tests['igf2']);
        }

        if($request->tests['lepr']) {
            $labTestExists = $labResult->laboratoryTests()->where('test_id', 7)->first();
            
            if($labTestExists) $this->updateSpecificTest($labTestExists, $request->tests['lepr']);
            $this->addSpecificTest($labResult, 7, $request->tests['lepr']);
        }

        if($request->tests['myog']) {
            $labTestExists = $labResult->laboratoryTests()->where('test_id', 8)->first();
            
            if($labTestExists) $this->updateSpecificTest($labTestExists, $request->tests['myog']);
            $this->addSpecificTest($labResult, 8, $request->tests['myog']);
        }

        if($request->tests['pss']) {
            $labTestExists = $labResult->laboratoryTests()->where('test_id', 9)->first();
            
            if($labTestExists) $this->updateSpecificTest($labTestExists, $request->tests['pss']);
            $this->addSpecificTest($labResult, 9, $request->tests['pss']);
        }

        if($request->tests['rn']) {
            $labTestExists = $labResult->laboratoryTests()->where('test_id', 10)->first();
            
            if($labTestExists) $this->updateSpecificTest($labTestExists, $request->tests['rn']);
            $this->addSpecificTest($labResult, 10, $request->tests['rn']);
        }

        if($request->tests['bax']) {
            $labTestExists = $labResult->laboratoryTests()->where('test_id', 11)->first();
            
            if($labTestExists) $this->updateSpecificTest($labTestExists, $request->tests['bax']);
            $this->addSpecificTest($labResult, 11, $request->tests['bax']);
        }

        if($request->tests['fut1']) {
            $labTestExists = $labResult->laboratoryTests()->where('test_id', 12)->first();
            
            if($labTestExists) $this->updateSpecificTest($labTestExists, $request->tests['fut1']);
            $this->addSpecificTest($labResult, 12, $request->tests['fut1']);
        }

        if($request->tests['mx1']) {
            $labTestExists = $labResult->laboratoryTests()->where('test_id', 13)->first();
            
            if($labTestExists) $this->updateSpecificTest($labTestExists, $request->tests['mx1']);
            $this->addSpecificTest($labResult, 13, $request->tests['mx1']);
        }

        if($request->tests['nramp']) {
            $labTestExists = $labResult->laboratoryTests()->where('test_id', 14)->first();
            
            if($labTestExists) $this->updateSpecificTest($labTestExists, $request->tests['nramp']);
            $this->addSpecificTest($labResult, 14, $request->tests['nramp']);
        }

        if($request->tests['bpi']) {
            $labTestExists = $labResult->laboratoryTests()->where('test_id', 15)->first();
            
            if($labTestExists) $this->updateSpecificTest($labTestExists, $request->tests['bpi']);
            $this->addSpecificTest($labResult, 15, $request->tests['bpi']);
        }

        return [
            'updated' => true
        ];
    }

    /**
     * Customize laboratory results data (collection) 
     * for better consumption in front-end
     *
     * @param   Collection  $labResults
     * @return  Collection
     */
    public function customizeLabResults($labResults)
    {
        $customData = [];

        foreach ($labResults as $result) {
            $farm = Farm::find($result->farm_id);

            $customData[] = $this->buildLabResultData($result, $farm);
        }

        return collect($customData)->sortBy('labResultNo')->values();
    }

    /**
     * Customize lab result data (individual)
     *
     * @param   LaboratoryResult    $result
     * @param   Farm                $farm
     * @return  Array
     */
    public function buildLabResultData(LaboratoryResult $result, Farm $farm = null)
    {
        return [
            'id'            => $result->id,
            'labResultNo'   => $result->laboratory_result_no,
            'animalId'      => $result->animal_id,
            'sex'           => $result->sex,
            'dateResult'    => $this->changeDateFormat($result->date_result),
            'dateSubmitted' => $this->changeDateFormat($result->date_submitted),
            'farm'          => [
                'id'         => ($result->farm_id) ?? null,
                'registered' => ($result->farm_id) ? true : false,
                'name'       => ($result->farm_id) 
                                    ? $farm->name . ', ' . $farm->province
                                    : $result->farm_name
            ],
            'tests'         => [
                'esr'   => $this->getLabTestValue($result, 1),
                'prlr'  => $this->getLabTestValue($result, 2),
                'rbp4'  => $this->getLabTestValue($result, 3),
                'lif'   => $this->getLabTestValue($result, 4),
                'hfabp' => $this->getLabTestValue($result, 5),
                'igf2'  => $this->getLabTestValue($result, 6),
                'lepr'  => $this->getLabTestValue($result, 7),
                'myog'  => $this->getLabTestValue($result, 8),
                'pss'   => $this->getLabTestValue($result, 9),
                'rn'    => $this->getLabTestValue($result, 10),
                'bax'   => $this->getLabTestValue($result, 11),
                'fut1'  => $this->getLabTestValue($result, 12),
                'mx1'   => $this->getLabTestValue($result, 13),
                'nramp' => $this->getLabTestValue($result, 14),
                'bpi'   => $this->getLabTestValue($result, 15)
            ],
            'showTests'     => [
                'fertility'     => false,
                'meatAndGrowth' => false,
                'defects'       => false,
                'diseases'      => false
            ]
        ];
    }

    /**
     * Add Laboratory Test to Laboratory Result
     *
     * @param   LaboratoryResult    $labResults
     * @param   integer             $testId
     * @param   string              $result
     * @return  void
     */
    private function addSpecificTest(LaboratoryResult $labResult, int $testId, string $result)
    {
        $labResult
            ->laboratoryTests()
            ->save(new LaboratoryTest([
                'test_id' => $testId,
                'result'  => $result
            ]));
    }

    /**
     * Update Laboratory Test of Laboratory Result
     *
     * @param   LaboratoryTest $labTest
     * @param   string $result
     * @return  void
     */
    private function updateSpecificTest(LaboratoryTest $labTest, string $result)
    {
        $labTest->result = $result;
        $labTest->save();
    }
}