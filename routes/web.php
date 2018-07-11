<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Auth::routes();

Route::get('/', function () {
    if(Auth::guest()) return view('auth.login');
    else return redirect('home');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/home', 'HomeController@index')->name('home');

    // Breeder-related
    Route::group(['prefix' => 'breeder'], function(){

        Route::get('/home', 'BreederController@index')->name('breederHome');
        Route::get('/manage-swine/register', 'SwineController@showRegistrationForm')->name('showRegForm');
        Route::get('/manage-swine/view', 'SwineController@viewRegisteredSwine')->name('viewRegdSwine');
        Route::post('/manage-swine/register', 'SwineController@addSwineInfo')->name('addSwineInfo');
        Route::get('/manage-swine/get/{sex}/{regNo}', 'SwineController@getSwine')->name('getSwine');
        Route::post('/manage-swine/set-primary-photo', 'PhotoController@setPrimaryPhoto')->name('setPrimaryPhoto');
        Route::post('/manage-swine/upload-photo', 'PhotoController@uploadPhoto')->name('uploadPhoto');
        Route::delete('/manage-swine/upload-photo/{photoId}', 'PhotoController@deletePhoto')->name('deletePhoto');
        Route::get('/registry-certificate/{swineId}', 'SwineController@viewRegistryCertificate')->name('viewRegistryCert');
        Route::get('/temp-registry-certificate', 'SwineController@viewTempRegistryCertificate')->name('viewTempRegistryCert');
        Route::get('/pedigree', 'PedigreeController@index')->name('viewSwinePedigreePage');
        Route::get('/pedigree/reg/{regNo}/gen/{generation}', 'PedigreeController@getSwinePedigree')->name('getSwinePedigree');
        Route::get('/swinecart', 'BreederController@viewSwineCartPage')->name('viewSwineCartPage');
    });

    // Admin-related
    Route::group(['prefix' => 'admin'], function() {

        Route::get('/home', 'AdminController@index')->name('adminHome');
        Route::get('/view-registered-swine', 'AdminController@viewRegisteredSwine')->name('adminViewRegdSwine');
        Route::get('/manage/apis', 'AdminController@viewManageAPIs')->name('manageAPIsView');
        Route::get('/manage/breeds', 'ManageFieldsController@showManageBreedsView')->name('showManageBreedsView');
        Route::post('/manage/breeds', 'ManageFieldsController@addBreed')->name('addBreed');
        Route::patch('/manage/breeds', 'ManageFieldsController@updateBreed')->name('updateBreed');
        Route::get('/manage/properties', 'ManageFieldsController@showManagePropertiesView')->name('showManagePropertiesView');
        Route::post('/manage/properties', 'ManageFieldsController@addProperty')->name('addProperty');
        Route::patch('/manage/properties', 'ManageFieldsController@updateProperty')->name('updateProperty');
        Route::get('/manage/breeders', 'ManageBreedersController@index')->name('showManageBreeders');
        Route::post('/manage/breeders', 'ManageBreedersController@addBreeder')->name('addBreeder');
        Route::patch('/manage/breeders', 'ManageBreedersController@updateBreeder')->name('updateBreeder');
        Route::post('/manage/farms', 'ManageBreedersController@addFarm')->name('addFarm');
        Route::patch('/manage/farms', 'ManageBreedersController@updateFarm')->name('updateFarm');
    });

    // Genomics-related
    Route::group(['prefix' => 'genomics'], function(){

        Route::get('/home', 'GenomicsController@index')->name('genomicsHome');
    });

    // Override Laravel Passport routes
    Route::group(['prefix' => 'oauth', 'middleware' => 'role:admin'], function() {
        Route::post('/clients', 'PassportClientOverrideController@store');
        Route::put('/clients/{client_id}', 'PassportClientOverrideController@update');
        Route::delete('/clients/{client_id}', 'PassportClientOverrideController@destroy');
    });
});
