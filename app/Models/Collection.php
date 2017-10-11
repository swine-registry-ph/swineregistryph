<?php

namespace App\Models;

use App\Models\Breeder;
use App\Models\Swine;
use Illuminate\Database\Eloquent\Model;

class Collection extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'date_collected',
    ];

    /**
     * Get the registered swines of the collection
     */
    public function swines()
    {
        return $this->hasMany(Swine::class);
    }

    /**
     * Get the corresponding breeder user of the collection
     */
    public function breeder()
    {
        return $this->belongsTo(Breeder::class);
    }
}
