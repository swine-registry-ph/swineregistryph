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
        ['Negros Occidental', 'NEC'],
        ['Negros Oriental', 'NER'],
        // Cordillera Administrative Region
        ['Abra', 'ABR'],
        ['Apayao', 'APA'],
        ['Benguet', 'BEN'],
        ['Ifugao', 'IFU'],
        ['Kalinga', 'KAL'],
        ['Mountain Province', 'MOU'],
        // Region I
        ['Ilocos Norte', 'ILN'],
        ['Ilocos Sur', 'ILS'],
        ['La Union', 'LUN'],
        ['Pangasinan', 'PAN'],
        // Region II
        ['Batanes', 'BTN'],
        ['Cagayan', 'CAG'],
        ['Isabela', 'ISA'],
        ['Nueva Vizcaya', 'NUV'],
        ['Quirino', 'QUI'],
        // Region III
        ['Aurora', 'AUR'],
        ['Bataan', 'BAN'],
        ['Bulacan', 'BUL'],
        ['Nueva Ecija', 'NUE'],
        ['Pampanga', 'PAM'],
        ['Tarlac', 'TAR'],
        ['Zambales', 'ZMB'],
        // Region IV-A
        ['Batangas', 'BTG'],
        ['Cavite', 'CAV'],
        ['Laguna', 'LAG'],
        ['Quezon', 'QUE'],
        ['Rizal', 'RIZ'],
        // Region IV-B
        ['Marinduque', 'MAD'],
        ['Occidental Mindoro', 'MDC'],
        ['Oriental Mindoro', 'MDR'],
        ['Palawan', 'PLW'],
        ['Romblon', 'ROM'],
        // Region V
        ['Albay', 'ALB'],
        ['Camarines Norte', 'CAN'],
        ['Camarines Sur', 'CAS'],
        ['Catanduanes', 'CAT'],
        ['Masbate', 'MAS'],
        ['Sorsogon', 'SOR'],
        // Region VI
        ['Aklan', 'AKL'],
        ['Antique', 'ANT'],
        ['Capiz', 'CAP'],
        ['Guimaras', 'GUI'],
        ['Iloilo', 'ILI'],
        // Region VII
        ['Bohol', 'BOH'],
        ['Cebu', 'CEB'],
        ['Siquijor', 'SIG'],
        // Region VIII
        ['Biliran', 'BIL'],
        ['Eastern Samar', 'EAS'],
        ['Leyte', 'LEY'],
        ['Northern Samar', 'NSA'],
        ['Southern Leyte', 'SLE'],
        ['Western Samar', 'WSA'],
        // Region IX
        ['Zamboanga del Norte', 'ZAN'],
        ['Zamboanga del Sur', 'ZAS'],
        ['Zamboanga Sibugay', 'ZSI'],
        // Region X
        ['Bukidnon', 'BUK'],
        ['Camiguin', 'CAM'],
        ['Lanao del Norte', 'LAN'],
        ['Misamis Occidental', 'MSC'],
        ['Misamis Oriental', 'MSR'],
        // Region XI
        ['Compostela Valley', 'COM'],
        ['Davao del Norte', 'DAV'],
        ['Davao del Sur', 'DAS'],
        ['Davao Occidental', 'DVO'],
        ['Davao Oriental', 'DAO'],
        // Region XII
        ['Sarangani', 'SAR'],
        ['South Cotabato', 'SCO'],
        ['Sultan Kudarat', 'SUK'],
        ['North Cotabato', 'NCO'],
        // Region XIII
        ['Agusan del Norte', 'AGN'],
        ['Agusan del Sur', 'AGS'],
        ['Dinagat Islands', 'DIN'],
        ['Surigao del Norte', 'SUN'],
        ['Surigao del Sur', 'SUR'],
        // ARMM
        ['Basilan', 'BAS'],
        ['Lanao del Sur', 'LAS'],
        ['Maguindanao', 'MAG'],
        ['Sulu', 'SLU'],
        ['Tawi-tawi', 'TAW']
    ];

    // Generate random integer
    //  for choosing province
    $rand = random_int(0,sizeof($provinces)-1);

    return [
        'breeder_id' => 0,
        'address_line1' => $faker->streetAddress,
        'address_line2' => $faker->secondaryAddress,
        'province' => $provinces[$rand][0],
        'province_code' => $provinces[$rand][1]
    ];
});

$factory->define(App\Models\Swine::class, function (Faker\Generator $faker) {

    return [
        'date_registered' => \Carbon\Carbon::now()
    ];
});
