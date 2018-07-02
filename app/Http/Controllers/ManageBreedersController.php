<?php

namespace App\Http\Controllers;

use App\Models\Breeder;
use App\Models\User;
use Illuminate\Http\Request;

class ManageBreedersController extends Controller
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
     * Show manage breeders page
     *
     * @return View
     */
    public function index()
    {
        $customizedBreederData = [];
        $breeders = Breeder::with('farms', 'users')->get();
        
        // Customize breeder data for easier querying
        foreach ($breeders as $breeder) {
            array_push($customizedBreederData, 
                [
                    'id'        => $breeder->id,
                    'name'      => $breeder->users[0]->name,
                    'email'     => $breeder->users[0]->email,
                    'status'    => $breeder->status_instance,
                    'farms'     => $breeder->farms
                ]
            );
        }

        $customizedBreederData = collect($customizedBreederData);

        return view('users.admin.manageBreeders', compact('customizedBreederData'));
    }

    /**
     * Add Breeder details
     *
     * @param   Request $request
     * @return  JSON
     */
    public function addBreeder(Request $request)
    {
        if($request->ajax()){

            $initialPassword = str_random(8);

            $breederUser = User::create([
                'name'          => $request->name,
                'email'         => $request->email,
                'password'      => bcrypt($initialPassword),
                'userable_id'   => 0,
                'userable_type' => ''
            ]);

            $breeder = Breeder::create([]);
            $breeder->users()->save($breederUser);

            // Send email to Breeder user here...
            // Put sending of email in queue

            return collect(
                [
                    'id'        => $breeder->id,
                    'name'      => $breederUser->name,
                    'email'     => $breederUser->email,
                    'status'    => $breederUser->userable()->first()->status_instance,
                    'farms'     => []
                ]
            );
        }
    }
}
