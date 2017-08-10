<?php

namespace App\Models;

use App\Models\Swine;
use App\Models\User;
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
     * Get the corresponding use of the collection
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
