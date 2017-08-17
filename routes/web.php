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

Route::get('/manage-swine', function(){
    return view('users.breeder.manage');
});

Route::get('/manage-swine/register', function(){
    return view('users.breeder.form');
});


Route::get('/home', 'HomeController@index')->name('home');
