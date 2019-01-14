<?php

namespace App\Models;

use App\Models\Breeder;
use App\Models\Admin;
use App\Models\Farm;
use App\Models\CertificateItem;
use Illuminate\Database\Eloquent\Model;

class CertificateRequest extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'certificate_requests';

    /**
     * Get the respective breeder of the certificate request
     */
    public function breeder()
    {
        return $this->belongsTo(Breeder::class);
    }
    
    /**
     * Get the respective evaluator of the certificate request
     */
    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }
    
    /**
     * Get the respective farm of the certificate request
     */
    public function farm()
    {
        return $this->belongsTo(Farm::class);
    }

    /**
     * Get certificate items of the certificate request
     */
    public function certificateItems()
    {
        return $this->hasMany(CertificateItem::class);
    }
}
