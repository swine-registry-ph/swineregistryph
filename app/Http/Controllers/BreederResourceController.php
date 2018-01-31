<?php

namespace App\Http\Controllers;

use App\Models\Breeder;
use Illuminate\Http\Request;

class BreederResourceController extends Controller
{
    /**
     * Get all Breeders and its respective Farms
     *
     * @return  JSON
     */
    public function index()
    {
        return Breeder::with([
            'farms'
        ])->get();
    }

    /**
     * Get specific Breeder and its Farms
     *
     * @param   integer     $breederId
     * @return  JSON
     */
    public function show($breederId)
    {
        return Breeder::where('id', $breederId)->with([
            'farms'
        ])->get();
    }
}
