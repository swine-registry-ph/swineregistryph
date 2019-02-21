<?php

namespace App\Http\Controllers;

use App\Models\Genomics;
use App\Models\User;
use Illuminate\Http\Request;

use Auth;
use Mail;

class ManageGenomicsController extends Controller
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
     * Show manage genomics page
     *
     * @return View
     */
    public function index()
    {
        $customizedGenomicsData = [];
        $genomics = Genomics::with('users')
            ->where('status_instance', 'active')
            ->get();

        foreach ($genomics as $aGenomic) {
            $customizedGenomicsData[] = [
                'genomicsId' => $aGenomic->id,
                'userId'    => $aGenomic->users[0]->id,
                'name'      => $aGenomic->users[0]->name,
                'email'     => $aGenomic->users[0]->email,
                'status'    => $aGenomic->status_instance,
            ];
        }

        $customizedGenomicsData = collect($customizedGenomicsData);

        return view('users.admin.manageGenomics', compact('customizedGenomicsData'));
    }

    /**
     * Add Genomics details
     *
     * @param   Request $request
     * @return  JSON
     */
    public function add(Request $request)
    {
        if($request->ajax()){

            $initialPassword = str_random(8);

            $genomicsUser = User::create([
                'name'          => $request->name,
                'email'         => $request->email,
                'password'      => bcrypt($initialPassword),
                'userable_id'   => 0,
                'userable_type' => ''
            ]);

            $genomics = Genomics::create([]);
            $genomics->users()->save($genomicsUser);

            // Send email to newly created Genomics user
            // Put sending of email in queue
            $genomicsDetails = [
                'name'              => $genomicsUser->name,
                'email'             => $genomicsUser->email,
                'initialPassword'   => $initialPassword
            ];

            // Mail::to($genomicsUser->email)->queue(new GenomicsCreated($genomicsDetails));

            return [
                'genomicsId'  => $genomics->id,
                'userId'      => $genomicsUser->id,
                'name'        => $genomicsUser->name,
                'email'       => $genomicsUser->email,
                'status'      => $genomicsUser->userable()->first()->status_instance
            ];
        }
    }

    /**
     * Update Genomics details
     *
     * @param   Request $request
     * @return  JSON
     */
    public function update(Request $request)
    {
        if($request->ajax()){

            $genomicsUser = User::find($request->userId);
            $genomicsUser->name = $request->name;
            $genomicsUser->email = $request->email;
            $genomicsUser->save();

            // Send email to updated Genomics user
            // Put sending of email in queue
            $genomicsDetails = [
                'name'              => $genomicsUser->name,
                'email'             => $genomicsUser->email
            ];

            // Mail::to($genomicsUser->email)->queue(new GenomicsUpdated($genomicsDetails));

            return [
                'updated' => true
            ];
        }
    }

    /**
     * Delete Genomics user
     *
     * @param   Request $request
     * @param   integer $userId
     * @return  JSON
     */
    public function delete(Request $request, $userId)
    {
        if($request->ajax()){
            // Set status of Genomics to inactive then
            // soft delete Genomics user
            $genomicsUser = User::find($userId);

            // Send email to updated Genomics user
            // Put sending of email in queue
            $genomicsDetails = [
                'name'              => $genomicsUser->name,
                'email'             => $genomicsUser->email
            ];

            // Mail::to($genomicsUser->email)->queue(new GenomicsDeleted($genomicsDetails));

            $genomics = $genomicsUser->userable()->first();
            $genomics->status_instance = 'inactive';
            $genomics->save();

            $genomicsUser->delete();

            return [
                'deleted' => true
            ];
        }
    }
}
