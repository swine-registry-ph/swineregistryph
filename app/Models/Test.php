<?php

namespace App\Models;

use App\Models\LaboratoryTest;
use Illuminate\Database\Eloquent\Model;

class Test extends Model
{
    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * Get laboratory tests of the test
     */
    public function laboratoryTests()
    {
        return $this->hasMany(LaboratoryTest::class);
    }
}
