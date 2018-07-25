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
                    <td><h1 id="largewhite-title">LANDRACE</h1></td>
                </tr>
            </tbody>
        </table>

        <br/>

        {{-- Basic info --}}
        <div class="">
            <table border="">
                <tbody>
                    <tr>
                        <td>Boar | {{$swine->swineProperties[1]->value}}</td>
                    </tr>
                    <tr>
                        <td><h3>{{$swine->registration_no}}*</h3></td>
                    </tr>
                    <tr>
                        <td><b>{{$swine->swineProperties[16]->value}}</b> teats •
                            <b>{{$swine->swineProperties[18]->value}}</b> (M) born alive •
                            <b>{{$swine->swineProperties[19]->value}}</b> (F) born alive
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
                        <td><h3>{{$swine->farm->name}}</h3></td>
                    </tr>
                    <tr>
                        <td>Accreditation No.: {{$swine->farm->farm_accreditation_no}}</td>
                    </tr>
                    <tr>
                        <td>{{$swine->farm->address_line1}}, {{$swine->farm->province}}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <br/> <br/> <br/>

        <div class="">
            <table border="">
                <tbody>
                    <tr>
                        <th colspan="4"><b>*{{$swine->registration_no}}</b> means the ff:</th>
                        <th colspan="1"> </th>
                        <th colspan="5"><b>Breeding Values</b></th>
                    </tr>
                    <tr>
                        <td colspan="4">
                            <table border="">
                                <tbody>
                                    <tr>
                                        <td colspan="1"><b>{{$swine->farm->province_code}}</b></td>
                                        <td colspan="2">{{$swine->farm->province}}</td>
                                        <td colspan="3"><i>Province of Farm</i></td>
                                    </tr>
                                    <tr>
                                        <td colspan="1"><b>{{$swine->farm->farm_code}}</b></td>
                                        <td colspan="2">{{$swine->farm->name}}</td>
                                        <td colspan="3"><i>Name of Farm</i></td>
                                    </tr>
                                    <tr>
                                        <td colspan="1"><b>LR</b></td>
                                        <td colspan="2">Landrace</td>
                                        <td colspan="3"><i>Breed</i></td>
                                    </tr>
                                    <tr>
                                        <td colspan="1"><b>2017</b></td>
                                        <td colspan="2">2017</td>
                                        <td colspan="3"><i>Birthyear</i></td>
                                    </tr>
                                    <tr>
                                        <td colspan="1"><b>M</b></td>
                                        <td colspan="2">Male</td>
                                        <td colspan="3"><i>Sex</i></td>
                                    </tr>
                                    <tr>
                                        <td colspan="1"><b>O</b></td>
                                        <td colspan="2">Open-house</td>
                                        <td colspan="3"><i>House Type</i></td>
                                    </tr>
                                    <tr>
                                        <td colspan="1"><b>12344</b></td>
                                        <td colspan="2">12344</td>
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
                                        <td>ADG on Birth</td>
                                        <td><b>{{$swine->swineProperties[3]->value}} kg/day</b></td>
                                        <td>Trait</td>
                                        <td><b>9.99</b></td>
                                    </tr>
                                    <tr>
                                        <td>ADG on Test</td>
                                        <td><b>{{$swine->swineProperties[6]->value}} kg/day</b></td>
                                        <td>Trait</td>
                                        <td><b>9.99</b></td>
                                    </tr>
                                    <tr>
                                        <td>Feed Efficiency</td>
                                        <td><b>{{$swine->swineProperties[15]->value}}</b></td>
                                        <td>Trait</td>
                                        <td><b>9.99</b></td>
                                    </tr>
                                    <tr>
                                        <td>Backfat</td>
                                        <td><b>{{$swine->swineProperties[12]->value}} mm</b></td>
                                        <td>Trait</td>
                                        <td><b>9.99</b></td>
                                    </tr>
                                    <tr>
                                        <td></td> <td></td> <td></td> <td></td>
                                    </tr>
                                    <tr>
                                        <td colspan="4" style="text-align:center;">Selection Index (SI) &nbsp; <b>99.99</b></td>
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
