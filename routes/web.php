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
    return view('auth.login');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/home', 'HomeController@index')->name('home');

    // Breeder-related
    Route::group(['prefix' => 'breeder'], function(){

        Route::get('/home', 'BreederController@index')->name('breederHome');

        Route::get('/manage-swine/register', 'SwineController@showRegistrationForm')->name('showRegForm');
        Route::post('/manage-swine/register', 'SwineController@addSwineInfo')->name('addSwineInfo');
        Route::post('/manage-swine/upload-photos', 'SwineController@uploadPhotos')->name('uploadPhotos');
        Route::get('/manage-swine/get/{regNo}', 'SwineController@getSwine')->name('getSwine');
    });


    // Admin-related
    Route::group(['prefix' => 'admin'], function(){

        Route::get('/sample-admin-view', 'AdminController@index')->name('adminHome');
    });
});
