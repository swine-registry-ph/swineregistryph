{{-- Style --}}
<style>
    #certificate-container{
        border: 2px solid #29b6f6;
        border-radius: 10px;
    }

    h2 {
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
        </tbody>
    </table>

</div>
