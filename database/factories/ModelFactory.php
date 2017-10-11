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
        'userable_id' => 0,
        'userable_type' => ''
    ];
});

$factory->define(App\Models\Admin::class, function (Faker\Generator $faker){
    return [];
});

$factory->define(App\Models\Breeder::class, function (Faker\Generator $faker){
    return [];
});

$factory->define(App\Models\Farm::class, function (Faker\Generator $faker) {

    $provinces = [
        // Negros Island Rregion
        'Negros Occidental',
        'Negros Oriental',
        // Cordillera Administrative Region
        'Mountain Province',
        'Ifugao',
        'Benguet',
        'Abra',
        'Apayao',
        'Kalinga',
        // Region I
        'La Union',
        'Ilocos Norte',
        'Ilocos Sur',
        'Pangasinan',
        // Region II
        'Nueva Vizcaya',
        'Cagayan',
        'Isabela',
        'Quirino',
        'Batanes',
        // Region III
        'Bataan',
        'Zambales',
        'Tarlac',
        'Pampanga',
        'Bulacan',
        'Nueva Ecija',
        'Aurora',
        // Region IV-A
        'Rizal',
        'Cavite',
        'Laguna',
        'Batangas',
        'Quezon',
        // Region IV-B
        'Occidental Mindoro',
        'Oriental Mindoro',
        'Romblon',
        'Palawan',
        'Marinduque',
        // Region V
        'Catanduanes',
        'Camarines Norte',
        'Sorsogon',
        'Albay',
        'Masbate',
        'Camarines Sur',
        // Region VI
        'Capiz',
        'Aklan',
        'Antique',
        'Iloilo',
        'Guimaras',
        // Region VII
        'Cebu',
        'Bohol',
        'Siquijor',
        // Region VIII
        'Southern Leyte',
        'Eastern Samar',
        'Northern Samar',
        'Western Samar',
        'Leyte',
        'Biliran',
        // Region IX
        'Zamboanga Sibugay',
        'Zamboanga del Norte',
        'Zamboanga del Sur',
        // Region X
        'Misamis Occidental',
        'Bukidnon',
        'Lanao del Norte',
        'Misamis Oriental',
        'Camiguin',
        // Region XI
        'Davao Oriental',
        'Compostela Valley',
        'Davao del Sur',
        'Davao Occidental',
        'Davao del Norte',
        // Region XII
        'South Cotabato',
        'Sultan Kudarat',
        'North Cotabato',
        'Sarangani',
        // Region XIII
        'Agusan del Norte',
        'Agusan del Sur',
        'Surigao del Sur',
        'Surigao del Norte',
        'Dinagat Islands',
        // ARMM
        'Tawi-tawi',
        'Basilan',
        'Sulu',
        'Maguindanao',
        'Lanao del Sur'
    ];

    // tunnel - tunnel ventilated
    // open - open area
    $typeArray = ['tunnel', 'open'];

    // Generate random integer for choosing province
    $rand = random_int(0,sizeof($provinces)-1);

    return [
        'breeder_id' => 0,
        'name' => $faker->company,
        'address_line1' => $faker->streetAddress,
        'address_line2' => $faker->secondaryAddress,
        'province' => $provinces[$rand],
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
        'breed_id' => random_int(1,4),
        'date_registered' => \Carbon\Carbon::now()
    ];
});
