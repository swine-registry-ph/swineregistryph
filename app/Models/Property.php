<?php

namespace App\Models;

use App\Models\SwineProperty;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    /**
     * We can make the id of this Class to be non-integer
     * See Models documentation on trigerring false values
     */

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'property', 'definition',
    ];

    /**
     * Get swine properties of the property
     * (specific attribute of swine)
     */
    public function swineProperties()
    {
        return $this->hasMany(SwineProperty::class);
    }
}
