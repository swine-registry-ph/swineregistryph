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

        $labResults = new LaboratoryResult;

        $labResults->farm_id = $request->farmId ?? null;
        $labResults->farm_name = $request->farmName ?? null;
        $labResults->laboratory_result_no = $request->laboratoryResultNo;
        $labResults->animal_id = $request->animalId;
        $labResults->sex = $request->sex;
        $labResults->date_result = Carbon::createFromFormat(
            'F d, Y', 
            $request->dateResult)
            ->toDateString();
        $labResults->date_submitted = Carbon::createFromFormat(
            'F d, Y', 
            $request->dateSubmitted)
            ->toDateString();
        
        $genomicsUser->laboratoryResults()->save($labResults);

        if($request->tests['esr']) {
            $labResults
                ->laboratoryTests()
                ->save(new LaboratoryTest([
                    'test_id' => 1, // esr
                    'result'  => $request->tests['esr']
                ]));
        }

        if($request->tests['prlr']) {
            $labResults
                ->laboratoryTests()
                ->save(new LaboratoryTest([
                    'test_id' => 2, // prlr
                    'result'  => $request->tests['prlr']
                ]));
        }

        if($request->tests['rbp4']) {
            $labResults
                ->laboratoryTests()
                ->save(new LaboratoryTest([
                    'test_id' => 3, // rbp4
                    'result'  => $request->tests['rbp4']
                ]));
        }

        if($request->tests['lif']) {
            $labResults
                ->laboratoryTests()
                ->save(new LaboratoryTest([
                    'test_id' => 4, // lif
                    'result'  => $request->tests['lif']
                ]));
        }

        if($request->tests['hfabp']) {
            $labResults
                ->laboratoryTests()
                ->save(new LaboratoryTest([
                    'test_id' => 5, // hfabp
                    'result'  => $request->tests['hfabp']
                ]));
        }

        if($request->tests['igf2']) {
            $labResults
                ->laboratoryTests()
                ->save(new LaboratoryTest([
                    'test_id' => 6, // igf2
                    'result'  => $request->tests['igf2']
                ]));
        }

        if($request->tests['lepr']) {
            $labResults
                ->laboratoryTests()
                ->save(new LaboratoryTest([
                    'test_id' => 7, // lepr
                    'result'  => $request->tests['lepr']
                ]));
        }

        if($request->tests['myog']) {
            $labResults
                ->laboratoryTests()
                ->save(new LaboratoryTest([
                    'test_id' => 8, // myog
                    'result'  => $request->tests['myog']
                ]));
        }

        if($request->tests['pss']) {
            $labResults
                ->laboratoryTests()
                ->save(new LaboratoryTest([
                    'test_id' => 9, // pss
                    'result'  => $request->tests['pss']
                ]));
        }

        if($request->tests['rn']) {
            $labResults
                ->laboratoryTests()
                ->save(new LaboratoryTest([
                    'test_id' => 10, // rn
                    'result'  => $request->tests['rn']
                ]));
        }

        if($request->tests['bax']) {
            $labResults
                ->laboratoryTests()
                ->save(new LaboratoryTest([
                    'test_id' => 11, // bax
                    'result'  => $request->tests['bax']
                ]));
        }

        if($request->tests['fut1']) {
            $labResults
                ->laboratoryTests()
                ->save(new LaboratoryTest([
                    'test_id' => 12, // fut1
                    'result'  => $request->tests['fut1']
                ]));
        }

        if($request->tests['mx1']) {
            $labResults
                ->laboratoryTests()
                ->save(new LaboratoryTest([
                    'test_id' => 13, // mx1
                    'result'  => $request->tests['mx1']
                ]));
        }

        if($request->tests['nramp']) {
            $labResults
                ->laboratoryTests()
                ->save(new LaboratoryTest([
                    'test_id' => 14, // nramp
                    'result'  => $request->tests['nramp']
                ]));
        }

        if($request->tests['bpi']) {
            $labResults
                ->laboratoryTests()
                ->save(new LaboratoryTest([
                    'test_id' => 15, // bpi
                    'result'  => $request->tests['bpi']
                ]));
        }

        return $labResults;
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
            'sex'           => ucfirst($result->sex),
            'dateResult'    => $this->changeDateFormat($result->date_result),
            'dateSubmitted' => $this->changeDateFormat($result->date_submitted),
            'farm'          => [
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
}