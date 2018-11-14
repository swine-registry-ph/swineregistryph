<?php

namespace App\Models;

use App\Models\Breeder;
use App\Models\Evaluator;
use App\Models\Farm;
use App\Models\InspectionItem;
use Illuminate\Database\Eloquent\Model;

class InspectionRequest extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'inspection_requests';

    /**
     * Get the respective breeder of the inspection request
     */
    public function breeder()
    {
        return $this->belongsTo(Breeder::class);
    }
    
    /**
     * Get the respective evaluator of the inspection request
     */
    public function evaluator()
    {
        return $this->belongsTo(Evaluator::class);
    }
    
    /**
     * Get the respective farm of the inspection request
     */
    public function farm()
    {
        return $this->belongsTo(Farm::class);
    }

    /**
     * Get inspection items of the inspection request
     */
    public function inspectionItems()
    {
        return $this->hasMany(InspectionItem::class);
    }
}
