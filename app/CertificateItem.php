<?php

namespace App;

use App\Models\InspectionRequest;
use App\Models\Swine;
use Illuminate\Database\Eloquent\Model;

class CertificateItem extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['swine_id'];

    /**
     * Get respective certificate request of 
     * the certificate item
     */
    public function certificateRequest()
    {
        return $this->belongsTo(CertificateRequest::class);
    }

    /**
     * Get respective swine of the certificate item
     */
    public function swine()
    {
        return $this->belongsTo(Swine::class);
    }
}
