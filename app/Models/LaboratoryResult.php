<?php

namespace App\Models;

use App\Models\Genomics;
use App\Models\LaboratoryTest;
use Illuminate\Database\Eloquent\Model;

class LaboratoryResult extends Model
{
    /**
     * Get the corresponding genomics user of 
     * the laboratory result
     */
    public function genomics()
    {
        return $this->belongsTo(Genomics::class);
    }

    /**
     * Get the laboratory tests of the respective
     * laboratory result
     */
    public function laboratoryTests()
    {
        return $this->hasMany(LaboratoryTest::class);
    }
}
