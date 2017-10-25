<?php

namespace App\Models;

use App\Models\Breed;
use App\Models\Collection;
use App\Models\Farm;
use App\Models\Photo;
use App\Models\SwineProperty;
use Illuminate\Database\Eloquent\Model;

class Swine extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'swines';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'registration_no', 'date_registered',
    ];

    /**
     * Get swine properties of the swine
     */
    public function swineProperties()
    {
        return $this->hasMany(SwineProperty::class);
    }

    /**
     * Get corresponding breed of the swine
     */
    public function breed()
    {
        return $this->belongsTo(Breed::class);
    }

    /**
     * Get the corresponding collection of the swine
     */
    public function collection()
    {
        return $this->belongsTo(Collection::class);
    }

    /**
     * Get corresponding farm of the swine
     */
    public function farm()
    {
        return $this->belongsTo(Farm::class);
    }

    /**
     * Get all of the Swine's photoss
     */
    public function photos()
    {
        return $this->morphMany(Photo::class, 'photoable');
    }
}
