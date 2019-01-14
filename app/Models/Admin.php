<?php

namespace App\Models;

use App\Models\CertificateRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{

    public $timestamps = false;

    /**
     * Get all Admin type users
     */
    public function users()
    {
        return $this->morphMany(User::class, 'userable');
    }

    /**
     * Get certificate requests the admin has inspected
     */
    public function certificateRequests()
    {
        return $this->hasMany(CertificateRequest::class);
    }
}
