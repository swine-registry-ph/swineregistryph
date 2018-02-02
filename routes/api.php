<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
Route::group(['prefix' => 'v1'], function() {
    Route::group(['prefix' => 'breeders'], function() {
        Route::get('/', 'BreederResourceController@index');
        Route::get('/{farm}', 'BreederResourceController@show');
    });

    Route::group(['prefix' => 'farms'], function() {
        Route::get('/', 'FarmResourceController@index');
        Route::get('/{farm}', 'FarmResourceController@show');
    });

    Route::group(['prefix' => 'swines'], function() {
        Route::get('/', 'SwineResourceController@index');
        Route::get('/{swine}', 'SwineResourceController@show');
    });
});
