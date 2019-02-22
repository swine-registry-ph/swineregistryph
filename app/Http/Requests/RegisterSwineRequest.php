<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterSwineRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            // GP One
            'gpOne.breedId' => 'required',
            'gpOne.farmFromId' => 'required',
            'gpOne.sex' => 'required',
            'gpOne.birthDate' => 'required',
            'gpOne.birthWeight' => 'required',
            'gpOne.adgBirth' => 'required',
            'gpOne.adgBirthEndDate' => 'required',
            'gpOne.adgBirthEndWeight' => 'required',
            'gpOne.adgTest' => 'required',
            'gpOne.adgTestStartDate' => 'required',
            'gpOne.adgTestStartWeight' => 'required',
            'gpOne.adgTestEndDate' => 'required',
            'gpOne.adgTestEndWeight' => 'required',
            'gpOne.houseType' => 'required',
            'gpOne.bft' => 'required',
            'gpOne.bftCollected' => 'required',
            'gpOne.feedIntake' => 'required',
            'gpOne.feedEfficiency' => 'required',
            'gpOne.teatNo' => 'required',
            'gpOne.parity' => 'required',
            'gpOne.littersizeAliveMale' => 'required',
            'gpOne.littersizeAliveFemale' => 'required',
            'gpOne.littersizeWeaning' => 'required',
            'gpOne.litterweightWeaning' => 'required',
            'gpOne.dateWeaning' => 'required',
            'gpOne.farmSwineId' => 'required',
            'gpOne.swinecart' => 'required',
            // GP Sire
            'gpSire.status' => 'required',
            'gpSire.existingRegNo' => 'required_if:gpSire.status,registered',
            'gpSire.imported.regNo' => 'required_if:gpSire.status,imported',
            'gpSire.imported.farmOfOrigin' => 'required_if:gpSire.status,imported',
            'gpSire.imported.countryOfOrigin' => 'required_if:gpSire.status,imported',
            'gpSire.breedId' => 'required_if:gpSire.status,new',
            'gpSire.farmFromId' => 'required_if:gpSire.status,new',
            'gpSire.sex' => 'required_if:gpSire.status,new',
            'gpSire.birthDate' => 'required_if:gpSire.status,new',
            'gpSire.birthWeight' => 'required_if:gpSire.status,new',
            'gpSire.adgBirth' => 'required_if:gpSire.status,new',
            'gpSire.adgBirthEndDate' => 'required_if:gpSire.status,new',
            'gpSire.adgBirthEndWeight' => 'required_if:gpSire.status,new',
            'gpSire.adgTest' => 'required_if:gpSire.status,new',
            'gpSire.adgTestStartDate' => 'required_if:gpSire.status,new',
            'gpSire.adgTestStartWeight' => 'required_if:gpSire.status,new',
            'gpSire.adgTestEndDate' => 'required_if:gpSire.status,new',
            'gpSire.adgTestEndWeight' => 'required_if:gpSire.status,new',
            'gpSire.houseType' => 'required_if:gpSire.status,new',
            'gpSire.bft' => 'required_if:gpSire.status,new',
            'gpSire.bftCollected' => 'required_if:gpSire.status,new',
            'gpSire.feedIntake' => 'required_if:gpSire.status,new',
            'gpSire.feedEfficiency' => 'required_if:gpSire.status,new',
            'gpSire.teatNo' => 'required_if:gpSire.status,new',
            'gpSire.parity' => 'required_if:gpSire.status,new',
            'gpSire.littersizeAliveMale' => 'required_if:gpSire.status,new',
            'gpSire.littersizeAliveFemale' => 'required_if:gpSire.status,new',
            'gpSire.littersizeWeaning' => 'required_if:gpSire.status,new',
            'gpSire.litterweightWeaning' => 'required_if:gpSire.status,new',
            'gpSire.dateWeaning' => 'required_if:gpSire.status,new',
            'gpSire.farmSwineId' => 'required_if:gpSire.status,new',
            // GP Dam
            'gpDam.status' => 'required',
            'gpDam.existingRegNo' => 'required_if:gpDam.status,registered',
            'gpDam.imported.regNo' => 'required_if:gpDam.status,imported',
            'gpDam.imported.farmOfOrigin' => 'required_if:gpDam.status,imported',
            'gpDam.imported.countryOfOrigin' => 'required_if:gpDam.status,imported',
            'gpDam.breedId' => 'required_if:gpDam.status,new',
            'gpDam.farmFromId' => 'required_if:gpDam.status,new',
            'gpDam.sex' => 'required_if:gpDam.status,new',
            'gpDam.birthDate' => 'required_if:gpDam.status,new',
            'gpDam.birthWeight' => 'required_if:gpDam.status,new',
            'gpDam.adgBirth' => 'required_if:gpDam.status,new',
            'gpDam.adgBirthEndDate' => 'required_if:gpDam.status,new',
            'gpDam.adgBirthEndWeight' => 'required_if:gpDam.status,new',
            'gpDam.adgTest' => 'required_if:gpDam.status,new',
            'gpDam.adgTestStartDate' => 'required_if:gpDam.status,new',
            'gpDam.adgTestStartWeight' => 'required_if:gpDam.status,new',
            'gpDam.adgTestEndDate' => 'required_if:gpDam.status,new',
            'gpDam.adgTestEndWeight' => 'required_if:gpDam.status,new',
            'gpDam.houseType' => 'required_if:gpDam.status,new',
            'gpDam.bft' => 'required_if:gpDam.status,new',
            'gpDam.bftCollected' => 'required_if:gpDam.status,new',
            'gpDam.feedIntake' => 'required_if:gpDam.status,new',
            'gpDam.feedEfficiency' => 'required_if:gpDam.status,new',
            'gpDam.teatNo' => 'required_if:gpDam.status,new',
            'gpDam.parity' => 'required_if:gpDam.status,new',
            'gpDam.littersizeAliveMale' => 'required_if:gpDam.status,new',
            'gpDam.littersizeAliveFemale' => 'required_if:gpDam.status,new',
            'gpDam.littersizeWeaning' => 'required_if:gpDam.status,new',
            'gpDam.litterweightWeaning' => 'required_if:gpDam.status,new',
            'gpDam.dateWeaning' => 'required_if:gpDam.status,new',
            'gpDam.farmSwineId' => 'required_if:gpDam.status,new',
        ];
    }
}
