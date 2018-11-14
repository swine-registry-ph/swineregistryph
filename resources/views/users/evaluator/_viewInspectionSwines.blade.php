{{-- Style --}}
<style>
    h1#header {
        font-size: 16pt;
    }

    table#genetic-information {
        text-align: center;
    }

    tr.headers td {
        font-weight: bold;
    }

    td.signature {
        border-top: 2px black solid;
    }

    .center-align {
        text-align: center;
    }
</style>

{{-- HTML --}}
<div id="certificate-container" class="">
    <div id="body" class="">
        <h1 id="header">Inspection #{{ $inspectionId }} ({{ $userType }}'s Copy)</h1>
        <p>
            {{ $swineInfo['registrationNo'] }} • {{ $swineInfo['farmName'] }}, {{ $swineInfo['farmProvince'] }}
        </p>
        <table border="1">
            <tbody>
                <tr>
                    <td colspan="3"></td>
                    <td colspan="3" align="center" style="font-size:12pt;">
                        <b>{{ $swineInfo['registrationNo'] }}</b>
                    </td>
                    <td colspan="3" align="center" style="font-size:12pt;">
                        Sire: <b>{{ isset($sireInfo['registrationNo']) ? $sireInfo['registrationNo'] : '---' }}</b>
                    </td>
                    <td colspan="3" align="center" style="font-size:12pt;"> 
                        Dam: <b>{{ isset($damInfo['registrationNo']) ? $damInfo['registrationNo'] : '---' }}</b>
                    </td>
                </tr>
                {{-- Basic Information --}}
                <tr>
                    <td style="background-color:gray;color:black;" colspan="12" align="center"> 
                        Basic Information 
                    </td>
                </tr>
                <tr class="headers">
                    {{-- Headers --}}
                    <td colspan="3"> Property</td>
                    {{-- GP1 --}}
                    <td colspan="2" class="center-align">Value</td>
                    <td colspan="1" class="center-align">Remarks</td>
                    {{-- GP Sire --}}
                    <td colspan="2" class="center-align">Value</td>
                    <td colspan="1" class="center-align">Remarks</td>
                    {{-- GP Dam --}}
                    <td colspan="2" class="center-align">Value</td>
                    <td colspan="1" class="center-align">Remarks</td>
                </tr>
                <tr>
                    {{-- Breed --}}
                    <td colspan="3"> Breed</td>
                    {{-- GP1 --}}
                    <td colspan="2" class="center-align">{{ $swineInfo['breed'] }}</td>
                    <td colspan="1"></td>
                    {{-- GP Sire --}}
                    <td colspan="2" class="center-align">
                        {{ isset($sireInfo['breed']) ? $sireInfo['breed'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                    {{-- GP Dam --}}
                    <td colspan="2" class="center-align">
                        {{ isset($damInfo['breed']) ? $damInfo['breed'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                </tr>
                <tr>
                    {{-- Sex --}}
                    <td colspan="3"> Sex</td>
                    {{-- GP1 --}}
                    <td colspan="2" class="center-align">{{ ucfirst($swineInfo['sex']) }}</td>
                    <td colspan="1"></td>
                    {{-- GP Sire --}}
                    <td colspan="2" class="center-align">
                        {{ isset($sireInfo['sex']) ? ucfirst($sireInfo['sex']) : '---' }}
                    </td>
                    <td colspan="1"></td>
                    {{-- GP Dam --}}
                    <td colspan="2" class="center-align">
                        {{ isset($damInfo['sex']) ? ucfirst($damInfo['sex']) : '---' }}
                    </td>
                    <td colspan="1"></td>
                </tr>
                <tr>
                    {{-- Birthdate --}}
                    <td colspan="3"> Birthdate</td>
                    {{-- GP1 --}}
                    <td colspan="2" class="center-align">{{ $swineInfo['birthDate'] }}</td>
                    <td colspan="1"></td>
                    {{-- GP Sire --}}
                    <td colspan="2" class="center-align">
                        {{ isset($sireInfo['birthDate']) ? $sireInfo['birthDate'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                    {{-- GP Dam --}}
                    <td colspan="2" class="center-align">
                        {{ isset($damInfo['birthDate']) ? $damInfo['birthDate'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                </tr>
                <tr>
                    {{-- Farm Swine ID --}}
                    <td colspan="3"> Farm Swine ID</td>
                    {{-- GP1 --}}
                    <td colspan="2" class="center-align">{{ $swineInfo['farmSwineId'] }}</td>
                    <td colspan="1"></td>
                    {{-- GP Sire --}}
                    <td colspan="2" class="center-align">
                        {{ isset($sireInfo['farmSwineId']) ? $sireInfo['farmSwineId'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                    {{-- GP Dam --}}
                    <td colspan="2" class="center-align">
                        {{ isset($damInfo['farmSwineId']) ? $damInfo['farmSwineId'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                </tr>
                <tr>
                    {{-- No. of Teats --}}
                    <td colspan="3"> No. of Teats</td>
                    {{-- GP1 --}}
                    <td colspan="2" class="center-align">{{ $swineInfo['teatNo'] }}</td>
                    <td colspan="1"></td>
                    {{-- GP Sire --}}
                    <td colspan="2" class="center-align">
                        {{ isset($sireInfo['teatNo']) ? $sireInfo['teatNo'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                    {{-- GP Dam --}}
                    <td colspan="2" class="center-align">
                        {{ isset($damInfo['teatNo']) ? $damInfo['teatNo'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                </tr>
                <tr>
                    {{-- Birthweight --}}
                    <td colspan="3"> Birthweight (kg)</td>
                    {{-- GP1 --}}
                    <td colspan="2" class="center-align">{{ $swineInfo['birthWeight'] }}</td>
                    <td colspan="1"></td>
                    {{-- GP Sire --}}
                    <td colspan="2" class="center-align">
                        {{ isset($sireInfo['birthWeight']) ? $sireInfo['birthWeight'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                    {{-- GP Dam --}}
                    <td colspan="2" class="center-align">
                        {{ isset($damInfo['birthWeight']) ? $damInfo['birthWeight'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                </tr>
                <tr>
                    {{-- Parity --}}
                    <td colspan="3"> Parity</td>
                    {{-- GP1 --}}
                    <td colspan="2" class="center-align">{{ $swineInfo['parity'] }}</td>
                    <td colspan="1"></td>
                    {{-- GP Sire --}}
                    <td colspan="2" class="center-align">
                        {{ isset($sireInfo['parity']) ? $sireInfo['parity'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                    {{-- GP Dam --}}
                    <td colspan="2" class="center-align">
                        {{ isset($damInfo['parity']) ? $damInfo['parity'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                </tr>
                <tr>
                    {{-- Total (M) born alive --}}
                    <td colspan="3"> Total (M) born alive</td>
                    {{-- GP1 --}}
                    <td colspan="2" class="center-align">{{ $swineInfo['littersizeAliveMale'] }}</td>
                    <td colspan="1"></td>
                    {{-- GP Sire --}}
                    <td colspan="2" class="center-align">
                        {{ isset($sireInfo['littersizeAliveMale']) ? $sireInfo['littersizeAliveMale'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                    {{-- GP Dam --}}
                    <td colspan="2" class="center-align">
                        {{ isset($damInfo['littersizeAliveMale']) ? $damInfo['littersizeAliveMale'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                </tr>
                <tr>
                    {{-- Total (F) born alive --}}
                    <td colspan="3"> Total (F) born alive</td>
                    {{-- GP1 --}}
                    <td colspan="2" class="center-align">{{ $swineInfo['littersizeAliveFemale'] }}</td>
                    <td colspan="1"></td>
                    {{-- GP Sire --}}
                    <td colspan="2" class="center-align">
                        {{ isset($sireInfo['littersizeAliveFemale']) ? $sireInfo['littersizeAliveFemale'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                    {{-- GP Dam --}}
                    <td colspan="2" class="center-align">
                        {{ isset($damInfo['littersizeAliveFemale']) ? $damInfo['littersizeAliveFemale'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                </tr>
                <tr>
                    {{-- Littersize at weaning --}}
                    <td colspan="3"> Littersize at weaning</td>
                    {{-- GP1 --}}
                    <td colspan="2" class="center-align">{{ $swineInfo['littersizeWeaning'] }}</td>
                    <td colspan="1"></td>
                    {{-- GP Sire --}}
                    <td colspan="2" class="center-align">
                        {{ isset($sireInfo['littersizeWeaning']) ? $sireInfo['littersizeWeaning'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                    {{-- GP Dam --}}
                    <td colspan="2" class="center-align">
                        {{ isset($damInfo['littersizeWeaning']) ? $damInfo['littersizeWeaning'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                </tr>
                <tr>
                    {{-- Litterweight at weaning --}}
                    <td colspan="3"> Litterweight at weaning</td>
                    {{-- GP1 --}}
                    <td colspan="2" class="center-align">{{ $swineInfo['litterweightWeaning'] }}</td>
                    <td colspan="1"></td>
                    {{-- GP Sire --}}
                    <td colspan="2" class="center-align">
                        {{ isset($sireInfo['litterweightWeaning']) ? $sireInfo['litterweightWeaning'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                    {{-- GP Dam --}}
                    <td colspan="2" class="center-align">
                        {{ isset($damInfo['litterweightWeaning']) ? $damInfo['litterweightWeaning'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                </tr>
                <tr>
                    {{-- Date at weaning --}}
                    <td colspan="3"> Date at weaning</td>
                    {{-- GP1 --}}
                    <td colspan="2" class="center-align">{{ $swineInfo['dateWeaning'] }}</td>
                    <td colspan="1"></td>
                    {{-- GP Sire --}}
                    <td colspan="2" class="center-align">
                        {{ isset($sireInfo['dateWeaning']) ? $sireInfo['dateWeaning'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                    {{-- GP Dam --}}
                    <td colspan="2" class="center-align">
                        {{ isset($damInfo['dateWeaning']) ? $damInfo['dateWeaning'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                </tr>
                <tr>
                    {{-- House Type --}}
                    <td colspan="3"> House Type</td>
                    {{-- GP1 --}}
                    <td colspan="2" class="center-align">{{ $swineInfo['houseType'] }}</td>
                    <td colspan="1"></td>
                    {{-- GP Sire --}}
                    <td colspan="2" class="center-align">
                        {{ isset($sireInfo['houseType']) ? $sireInfo['houseType'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                    {{-- GP Dam --}}
                    <td colspan="2" class="center-align">
                        {{ isset($damInfo['houseType']) ? $damInfo['houseType'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                </tr>
                {{-- Average Daily Gain from Birth --}}
                <tr>
                    <td style="background-color:gray;color:black;" colspan="12" align="center"> 
                        Average Daily Gain from Birth
                    </td>
                </tr>
                <tr class="headers">
                    {{-- Headers --}}
                    <td colspan="3"> Property</td>
                    {{-- GP1 --}}
                    <td colspan="2" class="center-align">Value</td>
                    <td colspan="1" class="center-align">Remarks</td>
                    {{-- GP Sire --}}
                    <td colspan="2" class="center-align">Value</td>
                    <td colspan="1" class="center-align">Remarks</td>
                    {{-- GP Dam --}}
                    <td colspan="2" class="center-align">Value</td>
                    <td colspan="1" class="center-align">Remarks</td>
                </tr>
                <tr>
                    {{-- End Date --}}
                    <td colspan="3"> End Date</td>
                    {{-- GP1 --}}
                    <td colspan="2" class="center-align">{{ $swineInfo['adgBirthEndDate'] }}</td>
                    <td colspan="1"></td>
                    {{-- GP Sire --}}
                    <td colspan="2" class="center-align">
                        {{ isset($sireInfo['adgBirthEndDate']) ? $sireInfo['adgBirthEndDate'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                    {{-- GP Dam --}}
                    <td colspan="2" class="center-align">
                        {{ isset($damInfo['adgBirthEndDate']) ? $damInfo['adgBirthEndDate'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                </tr>
                <tr>
                    {{-- End Weight --}}
                    <td colspan="3"> End Weight</td>
                    {{-- GP1 --}}
                    <td colspan="2" class="center-align">{{ $swineInfo['adgBirthEndWeight'] }}</td>
                    <td colspan="1"></td>
                    {{-- GP Sire --}}
                    <td colspan="2" class="center-align">
                        {{ isset($sireInfo['adgBirthEndWeight']) ? $sireInfo['adgBirthEndWeight'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                    {{-- GP Dam --}}
                    <td colspan="2" class="center-align">
                        {{ isset($damInfo['adgBirthEndWeight']) ? $damInfo['adgBirthEndWeight'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                </tr>
                {{-- Swine Testing Information --}}
                <tr>
                    <td style="background-color:gray;color:black;" colspan="12" align="center"> 
                        Swine Testing Information
                    </td>
                </tr>
                <tr class="headers">
                    {{-- Headers --}}
                    <td colspan="3"> Property</td>
                    {{-- GP1 --}}
                    <td colspan="2" class="center-align">Value</td>
                    <td colspan="1" class="center-align">Remarks</td>
                    {{-- GP Sire --}}
                    <td colspan="2" class="center-align">Value</td>
                    <td colspan="1" class="center-align">Remarks</td>
                    {{-- GP Dam --}}
                    <td colspan="2" class="center-align">Value</td>
                    <td colspan="1" class="center-align">Remarks</td>
                </tr>
                <tr>
                    {{-- Start Date --}}
                    <td colspan="3"> Start Date</td>
                    {{-- GP1 --}}
                    <td colspan="2" class="center-align">{{ $swineInfo['adgTestStartDate'] }}</td>
                    <td colspan="1"></td>
                    {{-- GP Sire --}}
                    <td colspan="2" class="center-align">
                        {{ isset($sireInfo['adgTestStartDate']) ? $sireInfo['adgTestStartDate'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                    {{-- GP Dam --}}
                    <td colspan="2" class="center-align">
                        {{ isset($damInfo['adgTestStartDate']) ? $damInfo['adgTestStartDate'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                </tr>
                <tr>
                    {{-- Weight at Start --}}
                    <td colspan="3"> Weight at Start (kg)</td>
                    {{-- GP1 --}}
                    <td colspan="2" class="center-align">{{ $swineInfo['adgTestStartWeight'] }}</td>
                    <td colspan="1"></td>
                    {{-- GP Sire --}}
                    <td colspan="2" class="center-align">
                        {{ isset($sireInfo['adgTestStartWeight']) ? $sireInfo['adgTestStartWeight'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                    {{-- GP Dam --}}
                    <td colspan="2" class="center-align">
                        {{ isset($damInfo['adgTestStartWeight']) ? $damInfo['adgTestStartWeight'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                </tr>
                <tr>
                    {{-- End Date --}}
                    <td colspan="3"> End Date</td>
                    {{-- GP1 --}}
                    <td colspan="2" class="center-align">{{ $swineInfo['adgTestEndDate'] }}</td>
                    <td colspan="1"></td>
                    {{-- GP Sire --}}
                    <td colspan="2" class="center-align">
                        {{ isset($sireInfo['adgTestEndDate']) ? $sireInfo['adgTestEndDate'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                    {{-- GP Dam --}}
                    <td colspan="2" class="center-align">
                        {{ isset($damInfo['adgTestEndDate']) ? $damInfo['adgTestEndDate'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                </tr>
                <tr>
                    {{-- Weight at End --}}
                    <td colspan="3"> Weight at End (kg)</td>
                    {{-- GP1 --}}
                    <td colspan="2" class="center-align">{{ $swineInfo['adgTestEndWeight'] }}</td>
                    <td colspan="1"></td>
                    {{-- GP Sire --}}
                    <td colspan="2" class="center-align">
                        {{ isset($sireInfo['adgTestEndWeight']) ? $sireInfo['adgTestEndWeight'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                    {{-- GP Dam --}}
                    <td colspan="2" class="center-align">
                        {{ isset($damInfo['adgTestEndWeight']) ? $damInfo['adgTestEndWeight'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                </tr>
                <tr>
                    {{-- Backfat Thickness --}}
                    <td colspan="3"> Backfat Thickness [BFT] (mm)</td>
                    {{-- GP1 --}}
                    <td colspan="2" class="center-align">{{ $swineInfo['bft'] }}</td>
                    <td colspan="1"></td>
                    {{-- GP Sire --}}
                    <td colspan="2" class="center-align">
                        {{ isset($sireInfo['bft']) ? $sireInfo['bft'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                    {{-- GP Dam --}}
                    <td colspan="2" class="center-align">
                        {{ isset($damInfo['bft']) ? $damInfo['bft'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                </tr>
                <tr>
                    {{-- Date when BFT was collected --}}
                    <td colspan="3"> Date when BFT was collected</td>
                    {{-- GP1 --}}
                    <td colspan="2" class="center-align">{{ $swineInfo['bftCollected'] }}</td>
                    <td colspan="1"></td>
                    {{-- GP Sire --}}
                    <td colspan="2" class="center-align">
                        {{ isset($sireInfo['bftCollected']) ? $sireInfo['bftCollected'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                    {{-- GP Dam --}}
                    <td colspan="2" class="center-align">
                        {{ isset($damInfo['bftCollected']) ? $damInfo['bftCollected'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                </tr>
                <tr>
                    {{-- Total Feed Intake (kg) --}}
                    <td colspan="3"> Total Feed Intake (kg)</td>
                    {{-- GP1 --}}
                    <td colspan="2" class="center-align">{{ $swineInfo['feedIntake'] }}</td>
                    <td colspan="1"></td>
                    {{-- GP Sire --}}
                    <td colspan="2" class="center-align">
                        {{ isset($sireInfo['feedIntake']) ? $sireInfo['feedIntake'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                    {{-- GP Dam --}}
                    <td colspan="2" class="center-align">
                        {{ isset($damInfo['feedIntake']) ? $damInfo['feedIntake'] : '---' }}
                    </td>
                    <td colspan="1"></td>
                </tr>
            </tbody>
        </table>

        <br><br><br><br><br>
        <table>
            <tbody>
                <tr>
                    <td colspan="5"></td>
                    <td colspan="2"></td>
                    <td colspan="5"></td>
                </tr>
                <tr>
                    <td colspan="5" class="center-align signature">
                        Evaluator's Signature Over Printed Name
                    </td>
                    <td colspan="2"></td>
                    <td colspan="5" class="center-align signature">
                        Breeder's Signature Over Printed Name
                    </td>
                </tr>
            </tbody>            
        </table>
    </div>

</div>
