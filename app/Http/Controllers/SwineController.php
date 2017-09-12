<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\Swine;
use App\Models\SwineProperty;
use Illuminate\Http\Request;

class SwineController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Get Swine according to registration number
     *
     * @return JSON
     */
    public function getSwine(Request $request, $regNo)
    {
        if($request->ajax()){
            $swine = Swine::where('registration_no', $regNo)->with('swineProperties')->first();

            foreach ($swine->swineProperties as $swineProperty) {
                $swineProperty->title = Property::find($swineProperty->property_id)->property;
            }

            return ($swine) ? $swine : 'Swine with registration no. ' . $regNo . ' cannot be found.';
        }
    }

}
