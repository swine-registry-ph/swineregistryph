<?php

namespace App\Http\Controllers;

use App\Models\Swine;
use Illuminate\Http\Request;

class SwineResourceController extends Controller
{
    /**
     * Get all of Swine and its  respective relationsips
     *
     * @return  JSON
     */
    public function index()
    {
        return Swine::with([
            'swineProperties.property',
            'breed',
            'photos',
            'farm',
            'certificate.photos'
        ])->get();
    }

    /**
     * Show specific Swine and its relationships
     *
     * @param   integer     $swineId
     * @return  JSON
     */
    public function show($swineId)
    {
        return Swine::where('id', $swineId)->with([
            'swineProperties.property',
            'breed',
            'photos',
            'farm',
            'certificate.photos'
        ])->get();
    }
}
