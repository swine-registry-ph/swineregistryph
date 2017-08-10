<?php

namespace App\Models;

use App\Models\Farm;
use Illuminate\Database\Eloquent\Model;

class FarmCode extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'farm_accreditation_no',
    ];

    /**
     * Get the corresponding farm of the farm code
     */
    public function farm()
    {
        return $this->belongsTo(Farm::class);
    }
}
