<?php

namespace App\Repositories;

use App\Models\Breed;
use App\Models\Farm;
use App\Models\Swine;
use App\Models\SwineProperty;
use App\Repositories\CustomHelpers;
use Carbon\Carbon;

use Auth;

class PedigreeRepository
{
    use CustomHelpers;

    /**
     * Build pedigree of swine up to the specified generation
     *
     * @param   Swine       $swine
     * @param   integer     $generation
     * @return  JSON
     */
    public function buildPedigree($swine, $generation)
    {
        // The building of pedigree uses a Breadth-First-Search (BFS) algorithm which
        // utilizes the properties and functionalities of a queue data structure.
        // An array of references (similar to queue algorithm) is used
        // to build the JSON structure of the pedigree
        $data = [];
        $pedigree = [];
        $queue = [$swine->id];
        $parentPointers = [];
        $noOfNodes = 1;
        $noOfParentNodesAtGeneration = $this->getNoOfParentNodesAtGeneration($generation);

        // Build properties of root node which is the swine requested
        // Then put its reference to parentPointers
        $pedigree = $this->buildProperties($swine->id);
        $parentPointers[] =& $pedigree;

        while(!empty($queue)){
            // Get id in front of queue
            $id = array_shift($queue);

            // Then get its parent ids
            $parentIds = $this->getParentIds($id);

            if(count($parentIds) == 2) {
                // Build parents' properties if it exists.
                // Get the front of parentPointers then
                // make a 'parents' attribute
                $currentInstance =& $parentPointers[0];
                $currentInstance['parents'] = [];

                // Put parents' properties
                $currentInstance['parents'] = [
                    $this->buildProperties($parentIds[0]),
                    $this->buildProperties($parentIds[1])
                ];

                // Pop front of parentPointers
                array_shift($parentPointers);

                // Append references of both parents to parentPointers
                $parentPointers[] =& $currentInstance['parents'][0];
                $parentPointers[] =& $currentInstance['parents'][1];
            }

            // Append parent ids to queue
            $queue = array_merge($queue, $parentIds);

            $noOfNodes++;
            if($noOfNodes > $noOfParentNodesAtGeneration) break;
        }

        $maxDepthOfTree = $this->getMaxDepthOfTree($pedigree);
        $data['pedigree'] = $pedigree;
        $data['message'] = ($generation > $maxDepthOfTree)
                            ? 'The maximum number of generation for this swine\'s pedigree is ' . $maxDepthOfTree
                            : '';

        return collect($data);
    }

    /**
     * Create an associative array of the swine's properties
     *
     * @param   integer     $swineId
     * @return  array
     */
    public function buildProperties($swineId)
    {
        $swine = Swine::find($swineId);

        return [
            'registrationnumber' =>             $swine->registration_no,
            'qualitative_info' => [
                'farm_name' =>                  $this->getFarmNameWithProvince($swine->farm_id),
                'breed' =>                      $this->getBreedTitle($swine->breed_id),
                'sex' =>                        $this->getSwinePropValue($swine, 1),
                'birthyear' =>                  $this->changeDateFormat($this->getSwinePropValue($swine, 2), 'year'),
                'date_registered' =>            $this->changeDateFormat($swine->date_registered),
                'registered_by' =>              $swine->breeder->users()->first()->name
            ],
            'quantitative_info' => [
                'birth_weight' =>               $this->getSwinePropValue($swine, 3),
                'average_daily_gain_birth' =>   $this->getSwinePropValue($swine, 4),
                'average_daily_gain_test' =>    $this->getSwinePropValue($swine, 7),
                'backfat_thickness' =>          $this->getSwinePropValue($swine, 13),
                'feed_efficiency' =>            $this->getSwinePropValue($swine, 16),
                'parity' =>                     $this->getSwinePropValue($swine, 18),
                'total_when_born_male' =>       $this->getSwinePropValue($swine, 19),
                'total_when_born_female' =>     $this->getSwinePropValue($swine, 20)
            ]
        ];
    }

    /**
     * Get number of expected nodes in a binary tree at a given generation/level.
     * Note however that since we're immediately getting the parents when
     * accessing a specific node, the number of expected nodes here
     * refer to one generation/level less
     *
     * @param   integer     $generation
     * @return  integer
     */
    private function getNoOfParentNodesAtGeneration($generation)
    {
        $noOfExpectedParentNodes = 0;

        for ($i=0; $i < $generation; $i++) $noOfExpectedParentNodes = $noOfExpectedParentNodes + pow(2, $i);

        return $noOfExpectedParentNodes;
    }

    /**
     * Get ids of parents if present
     *
     * @param   integer     $swineId
     * @return  array
     */
    private function getParentIds($swineId)
    {
        $swine = Swine::find($swineId);
        $ids = [];

        if($swine->gpSire_id) array_push($ids, $swine->gpSire_id);
        if($swine->gpDam_id) array_push($ids, $swine->gpDam_id);

        return $ids;
    }

    /**
     * Get depth of binary tree (array)
     *
     * @param   array       $tree
     * @return  integer
     */
    private function getMaxDepthOfTree($tree)
    {
        if(isset($tree['parents'])){
            $leftDepth = $this->getMaxDepthOfTree($tree['parents'][0]);
            $rightDepth = $this->getMaxDepthOfTree($tree['parents'][1]);

            return $max = ($rightDepth > $leftDepth) ? $rightDepth + 1 : $leftDepth + 1;
        }
        else return 0;

    }
}
