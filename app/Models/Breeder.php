<?php

namespace App\Models;

use App\Models\CertificateRequest;
use App\Models\Farm;
use App\Models\InspectionRequest;
use App\Models\Swine;
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
     * Get farms of Breeder user
     */
    public function farms()
    {
        return $this->hasMany(Farm::class);
    }

    /**
     * Get the swines of Breeder
     */
    public function swines()
    {
        return $this->hasMany(Swine::class);
    }

    /**
     * Get inspection requests the breeder has requested
     */
    public function inspectionRequests()
    {
        return $this->hasMany(InspectionRequest::class);
    }

    /**
     * Get certificate requests the breeder has requested
     */
    public function certificateRequests()
    {
        return $this->hasMany(CertificateRequest::class);
    }
}
