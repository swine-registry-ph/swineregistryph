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
        'name',
        'farm_code',
        'farm_accreditation_date',
        'farm_accreditation_no', 
        'address_line1',
        'address_line2',
        'province',
        'province_code'
    ];

    /**
     * Get the registered swines of the farm
     */
    public function swines()
    {
        return $this->hasMany(Swine::class);
    }

    /**
     * Get the corresponding breeder user of the farm
     */
    public function breeder()
    {
        return $this->belongsTo(Breeder::class);
    }
}
