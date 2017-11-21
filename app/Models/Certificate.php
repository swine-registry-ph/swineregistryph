<?php

namespace App\Models;

use App\Models\Swine;
use App\Models\Photo;
use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'certificates';

    /**
     * Get the respective swine of this certificate
     */
    public function swine()
    {
        return $this->belongsTo(Swine::class);
    }

    /**
     * Get the photo of the certificate
     */
    public function photos()
    {
        return $this->morphMany(Photo::class, 'photoable');
    }
}
