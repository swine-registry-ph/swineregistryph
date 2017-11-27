<?php

namespace App\Models;

use App\Models\Collection;
use App\Models\Farm;
use App\Models\User;
use App\Models\Swine;
use Illuminate\Database\Eloquent\Model;

class Breeder extends Model
{

    public $timestamps = false;

    /**
     * Get all Breeder type users
     */
    public function users()
    {
        return $this->morphMany(User::class, 'userable');
    }

    /**
     * Get farms of Breeder user
     */
    public function farms()
    {
        return $this->hasMany(Farm::class);
    }

    /**
     * Get collections (registration of swines) of Breeder user
     */
    public function collections()
    {
        return $this->hasMany(Collection::class);
    }

    /**
     * Get the swines of Breeder user through its Collections
     */
    public function swines()
    {
        return $this->hasManyThrough(Swine::class, Collection::class);
    }
}
