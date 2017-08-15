<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Initialize default swine property names first before
        // adding swine instances to user's collection
        $this->call(PropertyInstancesSeeder::class)
        $this->call(UserInstancesSeeder::class);
    }
}
