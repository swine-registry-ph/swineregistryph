<?php

namespace App\Models;

use App\Models\SwineProperty;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
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
