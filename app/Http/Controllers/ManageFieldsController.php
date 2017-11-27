<?php

namespace App\Http\Controllers;

use App\Models\Breed;
use Illuminate\Http\Request;

class ManageFieldsController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('role:admin');
    }

    /**
     * Show Admin's manage breeds view
     *
     * @return void
     */
    public function showManageBreedsView()
    {
        $breeds = Breed::all();

        return view('users.admin.manageBreeds', compact('breeds'));
    }

    /**
     * Add Breed
     *
     * @param   Request   $request
     */
    public function addBreed(Request $request)
    {
        if($request->ajax()){
            $breed = new Breed;
            $breed->title = $request->title;
            $breed->save();

            return $breed;
        }
    }
}
