<?php

namespace App\Models;

use App\Models\Farm;
use App\Models\Swine;
use Illuminate\Database\Eloquent\Model;

class Breed extends Model
{
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
        'breed',
    ];

    /**
     * Get the swines that belongs to the breed
     */
    public function swines()
    {
        return $this->hasMany(Swine::class);
    }
}
