<?php

namespace App\Http\Controllers;

use App\Models\Breed;
use App\Models\Collection;
use App\Models\Property;
use App\Models\Swine;
use App\Models\SwineProperty;
use Carbon\Carbon;
use Illuminate\Http\Request;

use Auth;
use Storage;

class SwineController extends Controller
{
    protected $user;
    protected $breederUser;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware(function($request, $next){
            $this->user = Auth::user();
            $this->breederUser = Auth::user()->userable()->first();

            return $next($request);
        });
    }

    /**
     * Show Registration form for adding swine
     *
     * @return  View
     */
    public function showRegistrationForm()
    {
        $farmOptions = [];
        $breedOptions = [];

        // Get farm options for farm from input select
        foreach ($this->breederUser->farms as $farm) {
            array_push($farmOptions,
                [
                    'text' => $farm->name . ' , ' . $farm->province,
                    'value' => $farm->id
                ]
            );
        }

        // Get breed options for breed input select
        foreach(Breed::all() as $breed){
            array_push($breedOptions,
                [
                    'text' => $breed->title,
                    'value' => $breed->id
                ]
            );
        }

        $farmOptions = collect($farmOptions);
        $breedOptions = collect($breedOptions);

        return view('users.breeder.form', compact('farmOptions', 'breedOptions'));
    }

    /**
     * Get Swine according to registration number
     *
     * @param   Request     $request
     * @param   integer     $regNo
     * @return  JSON
     */
    public function getSwine(Request $request, $regNo)
    {
        if($request->ajax()){
            $swine = Swine::where('registration_no', $regNo)->with('swineProperties')->first();

            foreach ($swine->swineProperties as $swineProperty) {
                $swineProperty->title = Property::find($swineProperty->property_id)->property;
            }

            return ($swine) ? $swine : 'Swine with registration no. ' . $regNo . ' cannot be found.';
        }
    }

    /**
     * Add Swine to database
     *
     * @param   Request     $request
     * @return  string
     */
    public function addSwineInfo(Request $request)
    {
        if($request->ajax()){

            // Collection instance
            $collection = new Collection;
            $collection->user_id = $breederUser->id;
            $collection->date_collected = new Carbon($request->basicInfo['dateCollected']);
            $collection->save();

            // Swine Instance
            $swine = new Swine;
            $swine->collection_id = $collection->id;
            $swine->registration_no = str_random(15);
            $swine->farm_id = $request->basicInfo['farmFrom'];
            $swine->breed_id = $request->basicInfo['breed'];
            $swine->date_registered = Carbon::now();
            $swine->gpSire_id = ($request->gpSireId) ? $request->gpSireId : null;
            $swine->gpDam_id = ($request->gpDamId) ? $request->gpDamId : null;
            $swine->save();

            // Swine Properties
            $swine->swineProperties()->saveMany(
                [
                    new SwineProperty([
                        'property_id' => 1, // sex
                        'value' => $request->basicInfo['sex']
                    ]),
                    new SwineProperty([
                        'property_id' => 2, // birthdate
                        'value' => Carbon::createFromFormat('F m, Y', $request->basicInfo['birthDate'])->toDateString()
                    ]),
                    new SwineProperty([
                        'property_id' => 4, // weight when data was collected
                        'value' => $request->basicInfo['weight']
                    ]),
                    new SwineProperty([
                        'property_id' => 5, // adg
                        'value' => $request->gpOne['adg']
                    ]),
                    new SwineProperty([
                        'property_id' => 6, // bft
                        'value' => $request->gpOne['bft']
                    ]),
                    new SwineProperty([
                        'property_id' => 7, // feed efficiency
                        'value' => $request->gpOne['fe']
                    ]),
                    new SwineProperty([
                        'property_id' => 8, // birth weight
                        'value' => $request->gpOne['birth_weight']
                    ]),
                    new SwineProperty([
                        'property_id' => 9, // total male born alive
                        'value' => $request->gpOne['littersizeAlive_male']
                    ]),
                    new SwineProperty([
                        'property_id' => 10, // total female born alive
                        'value' => $request->gpOne['littersizeAlive_female']
                    ]),
                    new SwineProperty([
                        'property_id' => 11, // parity
                        'value' => $request->gpOne['parity']
                    ]),
                    new SwineProperty([
                        'property_id' => 12, // littersize at weaning
                        'value' => $request->gpOne['littersize_weaning']
                    ]),
                    new SwineProperty([
                        'property_id' => 13, // litterweight at weaning
                        'value' => $request->gpOne['litterweight_weaning']
                    ]),
                    new SwineProperty([
                        'property_id' => 14, // date at weaning
                        'value' => Carbon::createFromFormat('F m, Y', $request->gpOne['date_weaning'])->toDateString()
                    ])
                ]
            );

            return "Successfully added";
        }
    }

    /**
     * Upload swine photos
     *
     * @param   Request     $request
     * @return  string
     */
    public function uploadPhotos(Request $request)
    {
        dd($request);
        // Check if request contains media file input
        // if($request->hasFile('media')) {
        //     $files = $request->file('media.*');
        //     $fileDetails = [];
        //
        //     foreach ($files as $file) {
        //
        //         // Check if file has no problems in uploading
        //         if($file->isValid()){
        //             $fileExtension = $file->getClientOriginalExtension();
        //             $fileName = $file->getClientOriginalName();
        //
        //             // Get media (Image/Video) info according to extension
        //             if($this->isImage($fileExtension)) $mediaInfo = $this->createMediaInfo($fileName, $fileExtension, $request->productId, $request->type, $request->breed);
        //             else if($this->isVideo($fileExtension)) $mediaInfo = $this->createMediaInfo($fileName, $fileExtension, $request->productId, $request->type, $request->breed);
        //             else return response()->json('Invalid file extension', 500);
        //
        //             Storage::disk('public')->put($mediaInfo['directoryPath'].$mediaInfo['filename'], file_get_contents($file));
        //
        //             // Check if file is successfully moved to desired path
        //             if($file){
        //                 $product = Product::find($request->productId);
        //
        //                 // Make Image/Video instance
        //                 $media = $mediaInfo['type'];
        //                 $media->name = $mediaInfo['filename'];
        //
        //                 if($this->isImage($fileExtension)){
        //                     $product->images()->save($media);
        //
        //                     // Resize images
        //                     dispatch(new ResizeUploadedImage($media->name));
        //                 }
        //                 else if($this->isVideo($fileExtension)) $product->videos()->save($media);
        //
        //                 array_push($fileDetails, ['id' => $media->id, 'name' => $media->name]);
        //             }
        //             else return response()->json('Move file failed', 500);
        //         }
        //         else return response()->json('Upload failed', 500);
        //     }
        //
        //     return response()->json(collect($fileDetails)->toJson(), 200);
        // }
        // else return response()->json('No files detected', 500);
        return response()->json('Great!', 200);
    }

}
