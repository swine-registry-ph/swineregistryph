<?php

namespace App\Models;

use App\Models\InspectionRequest;
use App\Models\Swine;
use Illuminate\Database\Eloquent\Model;

class InspectionItem extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['swine_id'];

    /**
     * Get respective inspection request of 
     * the inspection item
     */
    public function inspectionRequest()
    {
        return $this->belongsTo(InspectionRequest::class);
    }

    /**
     * Get respective swine of the inspection item
     */
    public function swine()
    {
        return $this->belongsTo(Swine::class);
    }
}
