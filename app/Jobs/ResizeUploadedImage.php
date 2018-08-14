<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

use Image as ImageManipulator;
use Storage;

class ResizeUploadedImage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    const SWINE_IMG_PATH = '/images/swine/';
    const SWINE_SIMG_PATH = '/images/swine/small/';
    const SWINE_MIMG_PATH = '/images/swine/medium/';
    const SWINE_LIMG_PATH = '/images/swine/large/';

    protected $filename;
    
    /**
     * Create a new job instance.
     *
     * @param  String   filename
     * @return void
     */
    public function __construct($filename)
    {
        $this->filename = $filename;
    }

    /**
     * Resize image proportionally according to size
     * - Large  image [<> x 410]
     * - Medium image [<> x 270]
     * - Small  image [<> x 75]
     *
     * @return void
     */
    public function handle()
    {
        $absoluteFilePath = public_path('storage') . self::SWINE_IMG_PATH . $this->filename;
        
        $image = ImageManipulator::make($absoluteFilePath);

        // Do not save resized image if original height is less
        // than the supposed to be rescaled image
        while(true){
            if($image->height() > 75){
                // Resize image proportionally given height 75
                $smallImage = ImageManipulator::make($absoluteFilePath)->heighten(75, function($constraint){
                    $constraint->upsize();
                });

                // Make directory if it does not exist
                if(!Storage::disk('public')->exists(self::SWINE_SIMG_PATH)){
                    Storage::disk('public')->makeDirectory(self::SWINE_SIMG_PATH);
                }

                $smallImage->save(public_path('storage') . self::SWINE_SIMG_PATH . $this->filename);
            } else break;

            if($image->height() > 270){
                // Resize image proportionally given height 270
                $mediumImage =  ImageManipulator::make($absoluteFilePath)->heighten(270, function($constraint){
                    $constraint->upsize();
                });

                // Make directory if it does not exist
                if(!Storage::disk('public')->exists(self::SWINE_MIMG_PATH)){
                    Storage::disk('public')->makeDirectory(self::SWINE_MIMG_PATH);
                }

                $mediumImage->save(public_path('storage') . self::SWINE_MIMG_PATH . $this->filename, 80);
            } else break;

            if($image->height() > 410){
                // Resize image proportionally given height 410
                $largeImage =  ImageManipulator::make($absoluteFilePath)->heighten(410, function($constraint){
                    $constraint->upsize();
                });

                // Make directory if it does not exist
                if(!Storage::disk('public')->exists(self::SWINE_LIMG_PATH)){
                    Storage::disk('public')->makeDirectory(self::SWINE_LIMG_PATH);
                }

                $largeImage->save(public_path('storage') . self::SWINE_LIMG_PATH . $this->filename, 80);
            }
            
            break;
        }
    }
}
