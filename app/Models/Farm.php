<?php

namespace App\Models;

use App\Models\Breeder;
use App\Models\FarmCode;
use App\Models\Swine;
use Illuminate\Database\Eloquent\Model;

class Farm extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'address', 'type',
    ];

    /**
     * Get the registered swines of the farm
     */
    public function swines()
    {
        return $this->hasMany(Swine::class);
    }

    /**
     * Get the corresponding farm code of the farm
     */
    public function farmCode()
    {
        return $this->hasOne(FarmCode::class);
    }

    /**
     * Get the corresponding breeder user of the farm
     */
    public function breeder()
    {
        return $this->belongsTo(Breeder::class);
    }
}
