<?php

namespace App\Models;

use App\Models\LaboratoryResult;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Genomics extends Model
{

    public $timestamps = false;

    /**
     * Get all Genomics type users
     */
    public function users()
    {
        return $this->morphMany(User::class, 'userable');
    }
    
    /**
     * Get all laboratory results
     */
    public function laboratoryResults()
    {
        return $this->hasMany(LaboratoryResult::class);
    }
}
