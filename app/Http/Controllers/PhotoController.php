<?php

namespace App\Http\Controllers;

use App\Models\Photo;
use App\Models\Swine;
use Carbon\Carbon;
use Illuminate\Http\Request;

use Auth;
use Storage;

class PhotoController extends Controller
{
    protected $user;
    protected $breederUser;

    // Constant variable paths
    const SWINE_IMG_PATH = '/images/swine/';

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
     * Upload swine photos
     *
     * @param   Request     $request
     * @return  string
     */
    public function uploadPhotos(Request $request)
    {
        // Check if there are uploaded files
        if($request->files->count() > 0){
            foreach ($request->files->all() as $file) {

                // Check if file is successfully uploaded
                if($file->isValid()){
                    $swine = Swine::find($request->swineId);

                    $fileExtension = $file->getClientOriginalExtension();
                    $fileName = $file->getClientOriginalName();

                    // Check if file is of image file extension
                    ($this->isImage($fileExtension))
                        ? $photoInfo = $this->createImageDetails($swine->id, $fileName, $fileExtension)
                        : response()->json('Invalid file extension', 500);

                    // Save image to Storage
                    Storage::disk('public')->put($photoInfo['directory'].$photoInfo['filename'], file_get_contents($file));

                    // Save image details to database if successfully moved
                    if($file){

                        $photo = new Photo;
                        $photo->name = $photoInfo['filename'];
                        $swine->photos()->save($photo);

                        return response()->json($photo, 200);
                    }
                    else return response()->json('Move file failed', 500);
                }
                else return response()->json('Upload failed', 500);
            }
        }
        else return response()->json('No files detected.', 500);

    }

    /**
     * Create image details specific for the system
     *
     * @param   integer     $swineId
     * @param   string      $filename
     * @param   string      $extension
     * @return  Array
     */
    private function createImageDetails($swineId, $filename, $extension)
    {
        $imageDetails = [];

        $imageDetails['directory'] = self::SWINE_IMG_PATH;
        $imageDetails['filename'] = md5($swineId) . '_' . md5($filename . time()) . '.' . $extension;

        return $imageDetails;
    }

    /**
     * Check if media is an image depending on specified extensions
     *
     * @param   String      $extension
     * @return  Boolean
     */
    private function isImage($extension)
    {
        return (
            $extension == 'jpg'     ||
            $extension == 'jpeg'    ||
            $extension == 'png'     ||
            $extension == 'tiff'    ||
            $extension == 'heif'    ||
            $extension == 'heic'
            ) ? true : false;
    }

}
