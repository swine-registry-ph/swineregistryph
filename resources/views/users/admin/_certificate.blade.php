{{-- Style --}}
<style>
    div#body{
        border-left: 4px solid #0aa4ff;
        /*red - #ba2931*/
        /*green - #61b017*/
    }

    h1#largewhite-title {
        color: #0aa4ff;
        font-size:18pt;
    }

    h1#header {
        text-align: center;
        font-size: 24pt;
    }

    div#notes-container {
        text-align: center;
    }

    div#pedigree-diagram-container {
        text-align: center;
    }
</style>

{{-- HTML --}}
<div id="certificate-container" class="">
    <div class="">
        <h1 id="header">CERTIFICATE OF REGISTRY</h1>
    </div>

    <div id="body" class="">
        {{-- Breed info --}}
        <table border="">
            <tbody>
                <tr>
                    <td><h1 id="largewhite-title">{{ $swineInfo['breed'] }}</h1></td>
                </tr>
            </tbody>
        </table>

        <br/>

        {{-- Basic info --}}
        <div class="">
            <table border="">
                <tbody>
                    <tr>
                        <td>{{ ucfirst($swineInfo['sex']) }} | 
                            {{ $swineInfo['birthDate'] }} 
                        </td>
                    </tr>
                    <tr>
                        <td><h3>{{ $swineInfo['registrationNo'] }}*</h3></td>
                    </tr>
                    <tr>
                        <td><b>{{ $swineInfo['teatNo'] }}</b> teats •
                            <b>{{ $swineInfo['littersizeAliveMale'] }}</b>(M) born alive •
                            <b>{{ $swineInfo['littersizeAliveFemale'] }}</b>(F) born alive
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <br/>

        {{-- Pedigree diagram --}}
        <div id="pedigree-diagram-container" class="">
            SVG Diagram
        </div>

        <br/> <br/> <br/>

        {{-- Breeder info --}}
        <div class="">
            <table border="">
                <tbody>
                    <tr>
                        <td>Breeder</td>
                    </tr>
                    <tr>
                        <td><h3>{{ $swineInfo['farmName'] }}</h3></td>
                    </tr>
                    <tr>
                        <td>Accreditation No.: {{ $swineInfo['farmAccreditationNo'] }}</td>
                    </tr>
                    <tr>
                        <td>{{ $swineInfo['farmAddressLine1'] }},
                            {{ $swineInfo['farmAddressLine2'] }}, 
                            {{ $swineInfo['farmProvince'] }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <br/> <br/> <br/>

        <div class="">
            <table border="">
                <tbody>
                    <tr>
                        <th colspan="5"><b>*{{ $swineInfo['registrationNo'] }}</b> means the ff: </th>
                        <th colspan="2"></th>
                        <th colspan="5"><b>Performance Values</b></th>
                    </tr>
                    <tr>
                        <td colspan="5">
                            <table border="">
                                <tbody>
                                    <tr>
                                        <td colspan="1"><b>{{ $swineInfo['farmProvinceCode'] }}</b> </td>
                                        <td colspan="4">{{ $swineInfo['farmProvince'] }}</td>
                                        <td colspan="3"><i>Province of Farm</i></td>
                                    </tr>
                                    <tr>
                                        <td colspan="1"><b>{{ $swineInfo['farmCode'] }}</b> </td>
                                        <td colspan="4">{{ $swineInfo['farmName'] }}</td>
                                        <td colspan="3"><i>Name of Farm</i></td>
                                    </tr>
                                    <tr>
                                        <td colspan="1"><b>{{ $swineInfo['breedCode'] }}</b></td>
                                        <td colspan="4">{{ $swineInfo['breed'] }}</td>
                                        <td colspan="3"><i>Breed</i></td>
                                    </tr>
                                    <tr>
                                        <td colspan="1"><b>{{ $swineInfo['birthYear'] }}</b></td>
                                        <td colspan="4">{{ $swineInfo['birthYear'] }}</td>
                                        <td colspan="3"><i>Birthyear</i></td>
                                    </tr>
                                    <tr>
                                        <td colspan="1"><b>{{ ucfirst(substr($swineInfo['sex'], 0, 1)) }}</b></td>
                                        <td colspan="4">{{ ucfirst($swineInfo['sex']) }}</td>
                                        <td colspan="3"><i>Sex</i></td>
                                    </tr>
                                    <tr>
                                        <td colspan="1"><b>{{ ucfirst(substr($swineInfo['houseType'], 0, 1)) }}</b></td>
                                        <td colspan="4">{{ ucfirst($swineInfo['houseType']) }}</td>
                                        <td colspan="3"><i>House Type</i></td>
                                    </tr>
                                    <tr>
                                        <td colspan="1"><b>{{ $swineInfo['farmSwineId'] }}</b></td>
                                        <td colspan="4">{{ $swineInfo['farmSwineId'] }}</td>
                                        <td colspan="3"><i>Farm Id</i></td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                        <td colspan="2"> </td>
                        <td colspan="5">
                            <table border="">
                                <tbody>
                                    <tr>
                                        <td>ADG from Birth</td>
                                        <td><b>{{ $swineInfo['adgFromBirth'] }} kg/day</b></td>
                                        <td>ESR</td>
                                        <td><b>BB</b> </td>
                                    </tr>
                                    <tr>
                                        <td>ADG on Test</td>
                                        <td><b>{{ $swineInfo['adgOnTest'] }} kg/day</b> </td>
                                        <td>PRLR</td>
                                        <td><b>AA</b></td>
                                    </tr>
                                    <tr>
                                        <td>Feed Efficiency </td>
                                        <td><b>{{ $swineInfo['feedEfficiency'] }}</b> </td>
                                        <td>PSS</td>
                                        <td><b>NN</b></td>
                                    </tr>
                                    <tr>
                                        <td>Backfat</td>
                                        <td><b>{{ $swineInfo['bft'] }} mm</b> </td>
                                        <td>MYOG</td>
                                        <td><b>AA</b></td>
                                    </tr>
                                    <tr>
                                        <td></td> <td></td> <td></td> <td></td>
                                    </tr>
                                    <tr>
                                        <td colspan="4" style="text-align:center;">Selection Index (SI) &nbsp; <b>{{ $swineInfo['selectionIndex'] }}</b></td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

</div>
