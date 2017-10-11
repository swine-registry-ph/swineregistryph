<?php

namespace App\Models;

use App\Models\Collection;
use App\Models\Farm;
use App\Models\User;
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
     * Get farms of user
     */
    public function farms()
    {
        return $this->hasMany(Farm::class);
    }

    /**
     * Get collections (registration of swines) of user
     */
    public function collections()
    {
        return $this->hasMany(Collection::class);
    }
}
