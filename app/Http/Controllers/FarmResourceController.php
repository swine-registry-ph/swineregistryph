<?php

namespace App\Http\Controllers;

use App\Models\Farm;
use Illuminate\Http\Request;

class FarmResourceController extends Controller
{
    /**
     * Show all Farms and its Swines
     *
     * @return  JSON
     */
    public function index()
    {
        return Farm::with([
            'swines.swineProperties.property'
        ])->get();
    }

    /**
     * Show specific Farm and its Swines
     *
     * @param   integer     $farmId
     * @return  JSON
     */
    public function show($farmId)
    {
        return Farm::where('id', $farmId)->with([
            'swines.swineProperties.property'
        ])->get();
    }
}
