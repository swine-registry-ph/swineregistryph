<?php

namespace App\Models;

use App\Models\Property;
use App\Models\SwineProperty;
use Illuminate\Database\Eloquent\Model;

class SwineProperty extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'value_quantitative', 'value_qualitative',
    ];

    /**
     * Get the corresponding swine of the swine property
     */
    public function swine()
    {
        return $this->belongsTo(Swine::class);
    }

    /**
     * Get the corresponding property (specific attribute of swine)
     * of the swine property
     */
    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
