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
                'farm'
            ])->where('swinecart', 1)->get();
    }

    /**
     * Show specific Swine and its relationships
     *
     * @param   integer     $swineId
     * @return  JSON
     */
    public function show($swineId)
    {
        $swine = Swine::where('id', $swineId)
            ->where('swinecart', 1)
            ->with([
                'swineProperties.property',
                'breed',
                'photos',
                'farm'
            ])->first();
        
        if($swine) return $swine;
        else return response('Swine not found.', 404);
    }
}
