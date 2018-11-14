<?php

namespace App\Models;

use App\Models\InspectionRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Evaluator extends Model
{
    public $timestamps = false;

    /**
     * Get all Evaluator type users
     */
    public function users()
    {
        return $this->morphMany(User::class, 'userable');
    }

    /**
     * Get inspection requests the evaluator has inspected
     */
    public function inspectionRequests()
    {
        return $this->hasMany(InspectionRequest::class);
    }
}
