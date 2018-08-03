<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class EvaluatorUpdated extends Mailable
{
    use Queueable, SerializesModels;

    protected $evaluator;

    /**
     * Create a new message instance.
     *
     * @param  array $breeder
     * @return void
     */
    public function __construct($evaluator)
    {
        // $evaluator is an associative array that should consist of
        // 'name', 'email' keys
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
            'Your Evaluator account was updated!',
            'The following is your updated evaluator user credentials:'
        ];
        $outroLines = ['Contact administrator for more queries.'];

        return $this->view('emails.evaluatorNotice')
                    ->subject('Swine Breed Registry PH Evaluator Account Updated')
                    ->with([
                        'level'             => 'success',
                        'introLines'        => $introLines,
                        'outroLines'        => $outroLines,
                        'name'              => $this->evaluator['name'],
                        'email'             => $this->evaluator['email']
                    ]);
    }
}
