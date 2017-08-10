<?php

namespace App\Models;

use App\Models\Swine;
use Illuminate\Database\Eloquent\Model;

class Breed extends Model
{
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
