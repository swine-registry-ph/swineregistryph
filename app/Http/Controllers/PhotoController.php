<?php

namespace App\Http\Controllers;

use App\Jobs\ResizeUploadedImage;
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
        $this->middleware('role:breeder');
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

                    $photoInfo = $this->createImageDetails($swine->id, $request->orientation, $fileExtension);

                    // Save image to Storage
                    Storage::disk('public')->put($photoInfo['directory'] . $photoInfo['filename'], file_get_contents($file));

                    // Save image details to database if successfully moved
                    if($file){
                        $photo = new Photo;
                        $photo->name = $photoInfo['filename'];
                        $swine->photos()->save($photo);

                        switch ($request->orientation) {
                            case 'side':
                                $swine->sidePhoto_id = $photo->id;
                                $swine->save();
                                break;

                            case 'front':
                                $swine->frontPhoto_id = $photo->id;
                                $swine->save();
                                break;

                            case 'back':
                                $swine->backPhoto_id = $photo->id;
                                $swine->save();
                                break;

                            case 'top':
                                $swine->topPhoto_id = $photo->id;
                                $swine->save();
                                break;
                            
                            default:
                                break;
                        }

                        // Additional metadata
                        $photo->fullFilePath = asset('storage'. $photoInfo['directory'] . $photoInfo['filename']);

                        // Queue resizing of images
                        dispatch(new ResizeUploadedImage($photo->name));

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
    public function deletePhoto(Request $request, $photoId, $orientation)
    {
        if($request->ajax()){
            // Get swine parent as well to make changes to
            // applicable orientation photo id
            $photo = Photo::find($photoId);
            $swine = $photo->photoable()->first();
            $fullFilePath = self::SWINE_IMG_PATH . $photo->name;

            if(Storage::disk('public')->exists($fullFilePath)){
                Storage::disk('public')->delete($fullFilePath);
            }

            $photo->delete();

            switch ($orientation) {
                case 'side':
                    $swine->sidePhoto_id = 0;
                    $swine->save();
                    break;
                
                case 'front':
                    $swine->frontPhoto_id = 0;
                    $swine->save();
                    break;
                
                case 'back':
                    $swine->backPhoto_id = 0;
                    $swine->save();
                    break;

                case 'top':
                    $swine->topPhoto_id = 0;
                    $swine->save(); 
                    break;

                default:
                    break;
            }

            return response()->json('Image deleted', 200);
        }
    }

    /**
     * Create image details specific for the system
     *
     * @param   integer     $swineId
     * @param   string      $orientation
     * @param   string      $extension
     * @return  Array
     */
    private function createImageDetails($swineId, $orientation, $extension)
    {
        $imageDetails = [];
        $startingIndex = 100000000;
        $newFileName = $startingIndex + $swineId . '_' . $orientation . '_' . md5(bin2hex(random_bytes(2)) . time()) . '.' . $extension;

        $imageDetails['directory'] = self::SWINE_IMG_PATH;
        $imageDetails['filename'] = $newFileName;

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
