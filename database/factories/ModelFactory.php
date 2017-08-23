<?php

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| Here you may define all of your model factories. Model factories give
| you a convenient way to create models for testing and seeding your
| database. Just tell the factory how a default model should look.
|
*/

/** @var \Illuminate\Database\Eloquent\Factory $factory */
$factory->define(App\Models\User::class, function (Faker\Generator $faker) {
    static $password;

    return [
        'name' => $faker->company,
        'email' => $faker->unique()->safeEmail,
        'password' => $password ?: $password = bcrypt('secret12'),
        'remember_token' => str_random(10),
    ];
});

$factory->define(App\Models\Farm::class, function (Faker\Generator $faker) {

    // tunnel - tunnel ventilated
    // open - open area
    $typeArray = ['tunnel', 'open'];

    return [
        'name' => $faker->company,
        'address' => $faker->address,
        'type' => $typeArray[random_int(0,1)]
    ];
});

$factory->define(App\Models\Collection::class, function (Faker\Generator $faker) {

    return [
        'date_collected' => \Carbon\Carbon::now()
    ];
});

$factory->define(App\Models\Swine::class, function (Faker\Generator $faker) {

    return [
        'registration_no' => str_random(15),
        'date_registered' => \Carbon\Carbon::now()
    ];
});
