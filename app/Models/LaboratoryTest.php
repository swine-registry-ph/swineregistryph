<?php

namespace App\Models;

use App\Models\LaboratoryResult;
use App\Models\Test;
use Illuminate\Database\Eloquent\Model;

class LaboratoryTest extends Model
{
    /**
     * Get the corresponding laboratory result 
     * of the laboratory test
     */
    public function laboratoryResult()
    {
        return $this->belongsTo(LaboratoryResult::class);
    }

    /**
     * Get the corresponding test (specific test)
     * of the laboratory test
     */
    public function test()
    {
        return $this->belongsTo(Test::class);
    }
}
