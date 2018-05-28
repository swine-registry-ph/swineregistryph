{{-- Style --}}
<style>
    div#certificate-container {
        border-left: 2px solid #29b6f6;
        /*border-style: solid solid solid solid;
        border-width: 2px 2px 2px 2px;
        border-color: green #FF00FF blue red;*/
        border-radius: 10px;
    }

    h2 {
        text-align: center;
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
    <h2>CERTIFICATE OF REGISTRY</h2>

    <table>
        <tbody>
            <tr>
                <td> Registration: </td>
                <td> <b>{{$swine->registration_no}}</b> </td>
            </tr>
            <tr>
                <td> Sex: </td>
                <td> <b>{{$swine->swineProperties[0]->value}}</b> </td>
            </tr>
            <tr>
                <td> Teat No: </td>
                <td> <b>{{$swine->swineProperties[16]->value}}</b> </td>
            </tr>
            <tr>
                <td> Total (M) alive: </td>
                <td> <b>{{$swine->swineProperties[18]->value}}</b> </td>
            </tr>
            <tr>
                <td> Total (F) alive: </td>
                <td> <b>{{$swine->swineProperties[19]->value}}</b> </td>
            </tr>
        </tbody>
    </table>

    <br />

    <div id="pedigree-diagram-container" class="">
        SVG Diagram
    </div>

    <br />

    <div class="">
        <table>
            <tbody>
                <tr>
                    <td>
                        <table>
                            <tbody>
                                <tr>
                                    <td> Breeder </td>
                                    <td>  </td>
                                </tr>
                                <tr>
                                    <td> Farm </td>
                                    <td> <b>{{$swine->farm->name}}</b> </td>
                                </tr>
                                <tr>
                                    <td> Province </td>
                                    <td> <b>{{$swine->farm->province}}</b> </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                    <td>
                        <table>
                            <tbody>
                                <tr>
                                    <td> Breeding Values </td>
                                    <td>  </td>
                                </tr>
                                <tr>
                                    <td> ADG on Test </td>
                                    <td> <b>{{$swine->swineProperties[6]->value}}</b> </td>
                                </tr>
                                <tr>
                                    <td> Feed Efficiency </td>
                                    <td> <b>{{$swine->swineProperties[15]->value}}</b> </td>
                                </tr>
                                <tr>
                                    <td> Backfat Thickness </td>
                                    <td> <b>{{$swine->swineProperties[12]->value}}</b> </td>
                                </tr>
                                <tr>
                                    <td> Selection Index </td>
                                    <td>  </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <br />

    <div id="notes-container" class="">
        Notes on Registration No.
    </div>

</div>
