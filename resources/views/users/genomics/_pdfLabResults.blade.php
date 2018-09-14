{{-- Style --}}
<style>
    h1#header {
        text-align: center;
        font-size: 18pt;
    }
    
    p#address {
        text-align: center;
    }

    table#genetic-information {
        text-align: center;
    }
</style>

{{-- HTML --}}
<div id="certificate-container" class="">
    <div class="">
        <h1 id="header">Swine Genetic Analytical Service Laboratory</h1>
        <p id="address">Honey Bee St., Bureau of Anmal Industry Compound, Visayas Avenue, Quezon City</p>
    </div>

    <div id="body" class="">
        <table border="">
            <tbody>
                <tr>
                    <td>Laboratory Result No: <b>{{ $customLabResult['labResultNo'] }}</b></td>
                    <td>Date of Result: <b>{{ $customLabResult['dateResult'] }}</b></td>
                </tr>
                <tr>
                    <td>Farm: <b>{{ $customLabResult['farm']['name'] }}</b></td>
                    <td>Date Submitted: <b>{{ $customLabResult['dateSubmitted'] }}</b></td>
                </tr>
                <tr>
                    <td>Animal ID: <b>{{ $customLabResult['animalId'] }}</b></td>
                    <td>Sex: <b>{{ $customLabResult['sex'] }}</b></td>
                </tr>
            </tbody>
        </table>
        
        <br><br><br><br><br>
        <table id="genetic-information" border="1">
            <tbody>
                {{-- Fertility Traits --}}
                <tr>
                    <td style="background-color:black;color:white;" colspan="3" align="center"> 
                        Fertility Traits 
                    </td>
                </tr>
                <tr>
                    {{-- Headers --}}
                    <td>Trait</td>
                    <td>Favorable Genotypes</td>
                    <td>Results</td>
                </tr>
                <tr>
                    {{-- ESR --}}
                    <td>ESR</td>
                    <td>BB</td>
                    @if(isset($customLabResult['tests']['esr']))
                        <td>{{ $customLabResult['tests']['esr'] }}</td>
                    @else 
                        <td>---</td>
                    @endif
                </tr>
                <tr>
                    {{-- PRLR --}}
                    <td>PRLR</td>
                    <td>AA</td>
                    @if(isset($customLabResult['tests']['prlr']))
                        <td>{{ $customLabResult['tests']['prlr'] }}</td>
                    @else 
                        <td>---</td>
                    @endif
                </tr>
                <tr>
                    {{-- RBP4 --}}
                    <td>RBP4</td>
                    <td>BB</td>
                    @if(isset($customLabResult['tests']['rbp4']))
                        <td>{{ $customLabResult['tests']['rbp4'] }}</td>
                    @else 
                        <td>---</td>
                    @endif
                </tr>
                <tr>
                    {{-- LIF --}}
                    <td>LIF</td>
                    <td>BB</td>
                    @if(isset($customLabResult['tests']['lif']))
                        <td>{{ $customLabResult['tests']['lif'] }}</td>
                    @else 
                        <td>---</td>
                    @endif
                </tr>
                {{-- Meat Quality and Growth Rate --}}
                <tr>
                    <td style="background-color:black;color:white;" colspan="3" align="center"> 
                        Meat Quality and Growth Rate
                    </td>
                </tr>
                <tr>
                    {{-- Headers --}}
                    <td>Trait</td>
                    <td>Favorable Genotypes</td>
                    <td>Results</td>
                </tr>
                <tr>
                    {{-- HFABP --}}
                    <td>HFABP</td>
                    <td>AA</td>
                    @if(isset($customLabResult['tests']['hfabp']))
                        <td>{{ $customLabResult['tests']['hfabp'] }}</td>
                    @else 
                        <td>---</td>
                    @endif
                </tr>
                <tr>
                    {{-- IGF2 --}}
                    <td>IGF2</td>
                    <td>CC</td>
                    @if(isset($customLabResult['tests']['igf2']))
                        <td>{{ $customLabResult['tests']['igf2'] }}</td>
                    @else 
                        <td>---</td>
                    @endif
                </tr>
                <tr>
                    {{-- LEPR --}}
                    <td>LEPR</td>
                    <td>BB</td>
                    @if(isset($customLabResult['tests']['lepr']))
                        <td>{{ $customLabResult['tests']['lepr'] }}</td>
                    @else 
                        <td>---</td>
                    @endif
                </tr>
                <tr>
                    {{-- MYOG --}}
                    <td>MYOG</td>
                    <td>AA</td>
                    @if(isset($customLabResult['tests']['myog']))
                        <td>{{ $customLabResult['tests']['myog'] }}</td>
                    @else 
                        <td>---</td>
                    @endif
                </tr>
                {{-- Genetic Defects --}}
                <tr>
                    <td style="background-color:black;color:white;" colspan="3" align="center"> 
                        Genetic Defects
                    </td>
                </tr>
                <tr>
                    {{-- Headers --}}
                    <td>Trait</td>
                    <td>Favorable Genotypes</td>
                    <td>Results</td>
                </tr>
                <tr>
                    {{-- PSS --}}
                    <td>PSS</td>
                    <td>NEGATIVE</td>
                    @if(isset($customLabResult['tests']['pss']))
                        <td>{{ $customLabResult['tests']['pss'] }}</td>
                    @else 
                        <td>---</td>
                    @endif
                </tr>
                <tr>
                    {{-- RN --}}
                    <td>RN</td>
                    <td>NEGATIVE</td>
                    @if(isset($customLabResult['tests']['rn']))
                        <td>{{ $customLabResult['tests']['rn'] }}</td>
                    @else 
                        <td>---</td>
                    @endif
                </tr>
                <tr>
                    {{-- BAX --}}
                    <td>BAX</td>
                    <td>NEGATIVE</td>
                    @if(isset($customLabResult['tests']['bax']))
                        <td>{{ $customLabResult['tests']['bax'] }}</td>
                    @else 
                        <td>---</td>
                    @endif
                </tr>
                {{-- Diseases Resistance --}}
                <tr>
                    <td style="background-color:black;color:white;" colspan="3" align="center"> 
                        Diseases Resistance
                    </td>
                </tr>
                <tr>
                    {{-- Headers --}}
                    <td>Trait</td>
                    <td>Favorable Genotypes</td>
                    <td>Results</td>
                </tr>
                <tr>
                    {{-- FUT1 --}}
                    <td>FUT1</td>
                    <td>AA</td>
                    @if(isset($customLabResult['tests']['fut1']))
                        <td>{{ $customLabResult['tests']['fut1'] }}</td>
                    @else 
                        <td>---</td>
                    @endif
                </tr>
                <tr>
                    {{-- MX1 --}}
                    <td>MX1</td>
                    <td>RESISTANT</td>
                    @if(isset($customLabResult['tests']['mx1']))
                        <td>{{ $customLabResult['tests']['mx1'] }}</td>
                    @else 
                        <td>---</td>
                    @endif
                </tr>
                <tr>
                    {{-- NRAMP --}}
                    <td>NRAMP</td>
                    <td>BB</td>
                    @if(isset($customLabResult['tests']['nramp']))
                        <td>{{ $customLabResult['tests']['nramp'] }}</td>
                    @else 
                        <td>---</td>
                    @endif
                </tr>
                <tr>
                    {{-- BPI --}}
                    <td>BPI</td>
                    <td>GG</td>
                    @if(isset($customLabResult['tests']['bpi']))
                        <td>{{ $customLabResult['tests']['bpi'] }}</td>
                    @else 
                        <td>---</td>
                    @endif
                </tr>
            </tbody>
        </table>
        {{-- <div class="">
            <table border="">
                <tbody>
                    <tr>
                        <th colspan="4"><b>*{{ $swineInfo['registrationNo'] }}</b> means the ff: </th>
                        <th colspan="1"></th>
                        <th colspan="5"><b>Breeding Values</b></th>
                    </tr>
                    <tr>
                        <td colspan="4">
                            <table border="">
                                <tbody>
                                    <tr>
                                        <td colspan="1"><b>{{ $swineInfo['farmProvinceCode'] }}</b> </td>
                                        <td colspan="2">{{ $swineInfo['farmProvince'] }}</td>
                                        <td colspan="3"><i>Province of Farm</i></td>
                                    </tr>
                                    <tr>
                                        <td colspan="1"><b>{{ $swineInfo['farmCode'] }}</b> </td>
                                        <td colspan="2">{{ $swineInfo['farmName'] }}</td>
                                        <td colspan="3"><i>Name of Farm</i></td>
                                    </tr>
                                    <tr>
                                        <td colspan="1"><b>{{ $swineInfo['breedCode'] }}</b></td>
                                        <td colspan="2">{{ $swineInfo['breed'] }}</td>
                                        <td colspan="3"><i>Breed</i></td>
                                    </tr>
                                    <tr>
                                        <td colspan="1"><b>{{ $swineInfo['birthYear'] }}</b></td>
                                        <td colspan="2">{{ $swineInfo['birthYear'] }}</td>
                                        <td colspan="3"><i>Birthyear</i></td>
                                    </tr>
                                    <tr>
                                        <td colspan="1"><b>{{ ucfirst(substr($swineInfo['sex'], 0, 1)) }}</b></td>
                                        <td colspan="2">{{ ucfirst($swineInfo['sex']) }}</td>
                                        <td colspan="3"><i>Sex</i></td>
                                    </tr>
                                    <tr>
                                        <td colspan="1"><b>{{ ucfirst(substr($swineInfo['houseType'], 0, 1)) }}</b></td>
                                        <td colspan="2">{{ ucfirst($swineInfo['houseType']) }}</td>
                                        <td colspan="3"><i>House Type</i></td>
                                    </tr>
                                    <tr>
                                        <td colspan="1"><b>{{ $swineInfo['farmSwineId'] }}</b></td>
                                        <td colspan="2">{{ $swineInfo['farmSwineId'] }}</td>
                                        <td colspan="3"><i>Farm Id</i></td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                        <td colspan="1"> </td>
                        <td colspan="5">
                            <table border="">
                                <tbody>
                                    <tr>
                                        <td>ADG from Birth</td>
                                        <td><b>{{ $swineInfo['adgFromBirth'] }} kg/day</b></td>
                                        <td>Trait</td>
                                        <td><b>9.99</b> </td>
                                    </tr>
                                    <tr>
                                        <td>ADG on Test</td>
                                        <td><b>{{ $swineInfo['adgOnTest'] }} kg/day</b> </td>
                                        <td>Trait</td>
                                        <td><b>9.99</b></td>
                                    </tr>
                                    <tr>
                                        <td>Feed Efficiency </td>
                                        <td><b>{{ $swineInfo['feedEfficiency'] }}</b> </td>
                                        <td>Trait</td>
                                        <td><b>9.99</b></td>
                                    </tr>
                                    <tr>
                                        <td>Backfat</td>
                                        <td><b>{{ $swineInfo['bft'] }} mm</b> </td>
                                        <td>Trait</td>
                                        <td><b>9.99</b></td>
                                    </tr>
                                    <tr>
                                        <td></td> <td></td> <td></td> <td></td>
                                    </tr>
                                    <tr>
                                        <td colspan="4" style="text-align:center;"> Selection Index (SI) &nbsp; <b>99.99</b> </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div> --}}
    </div>

</div>
