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
        Route::post('/manage-swine/photo', 'PhotoController@uploadPhoto')->name('uploadPhoto');
        Route::delete('/manage-swine/photo/{photoId}/orientation/{orientation}', 'PhotoController@deletePhoto')->name('deletePhoto');
        Route::get('/registry-certificate/{swineId}', 'SwineController@viewRegistryCertificate')->name('viewRegistryCert');
        Route::get('/pedigree', 'PedigreeController@index')->name('viewSwinePedigreePage');
        Route::get('/pedigree/reg/{regNo}/gen/{generation}', 'PedigreeController@getSwinePedigree')->name('getSwinePedigree');
        Route::get('/inspections', 'InspectionController@breederViewAll')->name('breederInspection');
        Route::post('/inspections', 'InspectionController@createInspectionRequest')->name('createInspectionRequest');
        Route::patch('/inspections/{inspectionId}', 'InspectionController@requestForInspection')->name('requestForInspection');
        Route::get('/inspections/{inspectionId}/swines', 'InspectionController@getSwinesOfInspectionRequest')->name('getSwinesOfInspectionB');
        Route::post('/inspections/{inspectionId}/swines', 'InspectionController@addSwinesToInspectionRequest')->name('addSwinesToInspection');
        Route::delete('/inspections/{inspectionId}/item/{itemId}', 'InspectionController@removeInspectionItem')->name('removeInspectionItem');
        Route::get('/certificates', 'CertificateController@breederViewAll')->name('breederCertificate');
        Route::post('/certificates', 'CertificateController@createCertificateRequest')->name('createCertificateRequest');
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
        Route::patch('/manage/farms/renew', 'ManageBreedersController@renewFarm')->name('renewFarm');
        Route::get('/manage/evaluators', 'ManageEvaluatorsController@index')->name('showManageEvaluators');
        Route::post('/manage/evaluators', 'ManageEvaluatorsController@add')->name('addEvaluator');
        Route::patch('/manage/evaluators', 'ManageEvaluatorsController@update')->name('updateEvaluator');
        Route::delete('/manage/evaluators/{userId}', 'ManageEvaluatorsController@delete')->name('deleteEvaluator');
    });

    // Genomics-related
    Route::group(['prefix' => 'genomics'], function(){

        Route::get('/home', 'GenomicsController@index')->name('genomicsHome');
        Route::get('/register', 'GenomicsController@showRegisterLaboratoryResults')->name('genomicsRegisterForm');
        Route::get('/pdf-lab-results/{labResultId}', 'GenomicsController@viewPDFLaboratoryResults')->name('viewPDFLabResults');
        Route::post('/pdf-lab-results/{labResultId}', 'GenomicsController@downloadPDFLaboratoryResults')->name('downloadPDFLabResults');
        Route::get('/manage/laboratory-results', 'GenomicsController@viewLaboratoryResults')->name('viewLabResults');
        Route::post('/manage/laboratory-results', 'GenomicsController@addLaboratoryResults')->name('addLabResults');
        Route::patch('/manage/laboratory-results', 'GenomicsController@updateLaboratoryResults')->name('updateLabResults');
    });

    // Evaluator-related
    Route::group(['prefix' => 'evaluator'], function(){

        Route::get('/home', 'EvaluatorController@index')->name('evaluatorHome');
        Route::get('/manage/inspections', 'InspectionController@evaluatorViewAll')->name('evaluatorInspection');
        Route::patch('/manage/inspections/{inspectionId}', 'InspectionController@changeStatusOfInspection')->name('changeInspectionStatus');
        Route::get('/inspections/{inspectionId}/swines', 'InspectionController@getSwinesOfInspectionRequest')->name('getSwinesOfInspectionE');
        Route::get('/manage/inspections/{inspectionId}/view-pdf', 'InspectionController@viewPDF')->name('viewInspectionPDF');
    });

    // Override Laravel Passport routes
    Route::group(['prefix' => 'oauth', 'middleware' => 'role:admin'], function() {

        Route::post('/clients', 'PassportClientOverrideController@store');
        Route::put('/clients/{client_id}', 'PassportClientOverrideController@update');
        Route::delete('/clients/{client_id}', 'PassportClientOverrideController@destroy');
    });
});
