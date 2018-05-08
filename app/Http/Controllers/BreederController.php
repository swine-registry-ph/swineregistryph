<?php

namespace App\Http\Controllers;

use App\Models\Swine;
use Illuminate\Http\Request;

use Auth;

class BreederController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('role:breeder');
    }

    /**
     * Show Breeder's homepage view
     *
     * @return void
     */
    public function index()
    {
        return view('users.breeder.home');
    }

    /**
     * Show Breeder's swines connected to the
     * SwineCart application
     *
     * @return void
     */
    public function viewSwineCartPage()
    {
        return view('users.breeder.swinecart');
    }

    /**
     * Show pedigree of specfic swine
     *
     * @return void
     */
    public function viewSwinePedigreePage()
    {
        $breederUser = Auth::user()->userable()->first();
        $swines = $breederUser->swines;
        $autocompleteData = [];

        foreach ($swines as $swine) {
            $autocompleteData[$swine->registration_no] = null;
        }

        // $data = [
        //     'registrationnumber' => '',
        //     'qualitative_info' => [
        //         'farm_name' => '',
        //         'breed' => '',
        //         'sex' => '',
        //         'birthyear' => '',
        //         'date_registered' => '',
        //         'registered_by' => ''
        //     ],
        //     'quantitative_info' => [
        //         'average_daily_gain_birth' => 7,
        //         'average_daily_gain_test' => 7,
        //         'backfat_thickness' => 3,
        //         'feed_efficiency' => 3,
        //         'birth_weight' => 8,
        //         'total_when_born_male' => 7,
        //         'total_when_born_female' => 6,
        //         'littersize_born_alive' => 5,
        //         'parity' => 1
        //     ],
        //     'parents' => [
        //         [],
        //         []
        //     ],
        // ];

        return view('users.breeder.pedigree', compact('autocompleteData'));
    }
}
