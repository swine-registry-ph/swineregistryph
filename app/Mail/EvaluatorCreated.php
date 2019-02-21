<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class EvaluatorCreated extends Mailable
{
    use Queueable, SerializesModels;

    protected $evaluator;

    /**
     * Create a new message instance.
     *
     * @param  array $evaluator
     * @return void
     */
    public function __construct($evaluator)
    {
        // $evaluator is an associative array that should consist of
        // 'name', 'email', and 'initialPassword' keys
        $this->evaluator = $evaluator;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $introLines = [
            'You now have an Evaluator account!',
            'The following is your evaluator user credentials:'
        ];
        $outroLines = ['Note that this is just an initial password. Make sure to change your initial password in your Evaluator\'s profile.'];

        return $this->view('emails.newevaluator')
                    ->subject('Swine Breed Registry PH Evaluator Account')
                    ->with([
                        'level'             => 'success',
                        'introLines'        => $introLines,
                        'outroLines'        => $outroLines,
                        'name'              => $this->evaluator['name'],
                        'email'             => $this->evaluator['email'],
                        'initialPassword'   => $this->evaluator['initialPassword'],
                        'actionText'        => 'Login',
                        'actionUrl'         => route('login')
                    ]);
    }
}
