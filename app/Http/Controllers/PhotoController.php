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
    public function uploadPhoto(Request $request)
    {
        // Check if there are uploaded files
        if($request->files->count() > 0){
            foreach ($request->files->all() as $file) {

                $fileExtension = $file->getClientOriginalExtension();
                $fileName = $file->getClientOriginalName();

                // Check if file is of image file extension
                if(!$this->isImage($fileExtension)) return response()->json('Invalid file extension', 500);

                // Check if file is successfully uploaded
                if($file->isValid()){
                    $swine = Swine::find($request->swineId);

                    $photoInfo = $this->createImageDetails($swine->id, $fileName, $fileExtension);

                    // Save image to Storage
                    Storage::disk('public')->put($photoInfo['directory'] . $photoInfo['filename'], file_get_contents($file));

                    // Save image details to database if successfully moved
                    if($file){
                        $photo = new Photo;
                        $photo->name = $photoInfo['filename'];
                        $swine->photos()->save($photo);

                        // Additional metadata
                        $photo->fullFilePath = $photoInfo['directory'] . $photoInfo['filename'];

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
     * Delete Photo in file storage and database
     *
     * @param   Request     $request
     * @return  JSON
     */
    public function deletePhoto(Request $request, $photoId)
    {
        if($request->ajax()){
            $photo = Photo::find($photoId);
            $fullFilePath = self::SWINE_IMG_PATH . $photo->name;

            if(Storage::disk('public')->exists($fullFilePath)) Storage::disk('public')->delete($fullFilePath);

            $photo->delete();

            return response()->json('Image deleted', 200);
        }
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
        $extension = strtolower($extension);

        return (
            $extension == 'jpg'     ||
            $extension == 'jpeg'    ||
            $extension == 'png'     ||
            $extension == 'tiff'    ||
            $extension == 'heif'    ||
            $extension == 'heic'
        );

    }

}
