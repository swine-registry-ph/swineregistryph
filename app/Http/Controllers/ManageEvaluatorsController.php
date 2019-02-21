<?php

namespace App\Http\Controllers;

use App\Mail\EvaluatorCreated;
use App\Mail\EvaluatorUpdated;
use App\Mail\EvaluatorDeleted;
use App\Models\Evaluator;
use App\Models\User;
use Illuminate\Http\Request;

use Auth;
use Mail;

class ManageEvaluatorsController extends Controller
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
     * Show manage evaluators page
     *
     * @return View
     */
    public function index()
    {
        $customizedEvaluatorData = [];
        $evaluators = Evaluator::with('users')
            ->where('status_instance', 'active')
            ->get();

        foreach ($evaluators as $evaluator) {
            $customizedEvaluatorData[] = [
                'evaluatorId' => $evaluator->id,
                'userId'      => $evaluator->users[0]->id,
                'name'        => $evaluator->users[0]->name,
                'email'       => $evaluator->users[0]->email,
                'status'      => $evaluator->status_instance,
            ];
        }

        $customizedEvaluatorData = collect($customizedEvaluatorData);

        return view('users.admin.manageEvaluators', compact('customizedEvaluatorData'));
    }

    /**
     * Add Evaluator details
     *
     * @param   Request $request
     * @return  JSON
     */
    public function add(Request $request)
    {
        if($request->ajax()){

            $initialPassword = str_random(8);

            $evaluatorUser = User::create([
                'name'          => $request->name,
                'email'         => $request->email,
                'password'      => bcrypt($initialPassword),
                'userable_id'   => 0,
                'userable_type' => ''
            ]);

            $evaluator = Evaluator::create([]);
            $evaluator->users()->save($evaluatorUser);

            // Send email to newly created Evaluator user
            // Put sending of email in queue
            $evaluatorDetails = [
                'name'              => $evaluatorUser->name,
                'email'             => $evaluatorUser->email,
                'initialPassword'   => $initialPassword
            ];

            Mail::to($evaluatorUser->email)->queue(new EvaluatorCreated($evaluatorDetails));

            return [
                'evaluatorId' => $evaluator->id,
                'userId'      => $evaluatorUser->id,
                'name'        => $evaluatorUser->name,
                'email'       => $evaluatorUser->email,
                'status'      => $evaluatorUser->userable()->first()->status_instance
            ];
        }
    }

    /**
     * Update Evaluator details
     *
     * @param   Request $request
     * @return  JSON
     */
    public function update(Request $request)
    {
        if($request->ajax()){

            $evaluatorUser = User::find($request->userId);
            $evaluatorUser->name = $request->name;
            $evaluatorUser->save();

            // Send email to updated Evaluator user
            // Put sending of email in queue
            $evaluatorDetails = [
                'name'              => $evaluatorUser->name,
                'email'             => $evaluatorUser->email
            ];

            Mail::to($evaluatorUser->email)->queue(new EvaluatorUpdated($evaluatorDetails));

            return [
                'updated' => true
            ];
        }
    }

    /**
     * Delete Evaluator user
     *
     * @param   Request $request
     * @param   integer $userId
     * @return  JSON
     */
    public function delete(Request $request, $userId)
    {
        if($request->ajax()){
            // Set status of Evaluator to inactive then
            // soft delete Evaluator user
            $evaluatorUser = User::find($userId);

            // Send email to updated Evaluator user
            // Put sending of email in queue
            $evaluatorDetails = [
                'name'              => $evaluatorUser->name,
                'email'             => $evaluatorUser->email
            ];

            Mail::to($evaluatorUser->email)->queue(new EvaluatorDeleted($evaluatorDetails));

            $evaluator = $evaluatorUser->userable()->first();
            $evaluator->status_instance = 'inactive';
            $evaluator->save();

            $evaluatorUser->delete();

            return [
                'deleted' => true
            ];
        }
    }
}
