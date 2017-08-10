<?php

namespace App\Models;

use App\Models\FarmCode;
use App\Models\Swine;
use App\Models\User;
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
     * Get the corresponding user of the farm
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
