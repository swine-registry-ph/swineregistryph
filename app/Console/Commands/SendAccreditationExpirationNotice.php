<?php

namespace App\Console\Commands;

use App\Repositories\EmailRepository;
use Illuminate\Console\Command;

class SendAccreditationExpirationNotice extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'accreditation:notify';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Notify breeder users of their accreditation expiration status';

    protected $emailRepository;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(EmailRepository $emailRepository)
    {
        parent::__construct();

        $this->emailRepository = $emailRepository;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $this->info('Notifying breeders...');
        $this->emailRepository->sendAccreditationExpirationNotice();
    }
}
