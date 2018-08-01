<?php

namespace App\Http\Controllers;

use App\Models\Evaluator;
use Illuminate\Http\Request;

use Auth;

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
        $evaluators = Evaluator::with('users')->get();

        foreach ($evaluators as $evaluator) {
            $customizedEvaluatorData[] = [
                'evaluatorId' => $evaluator->id,
                'userId'      => $evaluator->users[0]->id,
                'name'        => $evaluator->users[0]->name,
                'email'       => $evaluator->users[0]->email
            ];
        }

        $customizedEvaluatorData = collect($customizedEvaluatorData);

        return view('users.admin.manageEvaluators', compact('customizedEvaluatorData'));
    }
}
