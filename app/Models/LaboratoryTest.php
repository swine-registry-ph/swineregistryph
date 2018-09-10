<?php

namespace App\Models;

use App\Models\LaboratoryResult;
use App\Models\Test;
use Illuminate\Database\Eloquent\Model;

class LaboratoryTest extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'test_id', 'result'
    ];

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
