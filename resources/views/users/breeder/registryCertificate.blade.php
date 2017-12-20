@extends('users.breeder.home')

@section('title')
    | View Registry Certificate
@endsection

@section('content')

<div class="row">
    <div class="col s12">
        <br>
    </div>
    <div id="registry-certificate-container" class="col s10 offset-s1 white">
        <div class="row">

            {{-- Title --}}
            <div class="col s12">
                <h5 class="center-align"> CERTIFICATE OF REGISTRY </h5>
            </div>

            <div class="col s4">
                {{-- Basic Information --}}
                <p>
                    <table>
                        <tbody>
                            <tr>
                                <td> Registration: </td>
                                <td> <b>12345678</b> </td>
                            </tr>
                            <tr>
                                <td> Trait: </td>
                                <td> <b>Value</b> </td>
                            </tr>
                            <tr>
                                <td> Trait: </td>
                                <td> <b>Value</b> </td>
                            </tr>
                            <tr>
                                <td> Trait: </td>
                                <td> <b>Value</b> </td>
                            </tr>
                            <tr>
                                <td> Trait: </td>
                                <td> <b>Value</b> </td>
                            </tr>
                            <tr>
                                <td> Trait: </td>
                                <td> <b>Value</b> </td>
                            </tr>
                        </tbody>
                    </table>
                </p> <br>

                {{-- More Basic informatin --}}
                <p>
                    <table>
                        <tbody>
                            <tr>
                                <td> Trait: </td>
                                <td> <b>Value</b> </td>
                            </tr>
                            <tr>
                                <td> Trait: </td>
                                <td> <b>Value</b> </td>
                            </tr>
                            <tr>
                                <td> Trait: </td>
                                <td> <b>Value</b> </td>
                            </tr>
                            <tr>
                                <td> Trait: </td>
                                <td> <b>Value</b> </td>
                            </tr>
                        </tbody>
                    </table>
                </p>
            </div>

            {{-- Pedigree Figure --}}
            <div class="col s8">
                <p>
                    PEDIGREE <br> <br>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                    nisi ut aliquip ex ea commodo consequat.
                </p>
            </div>
        </div>

        <div class="row">
            {{-- Breeder Information --}}
            <div class="col s6">
                <p>
                    BREEDER
                </p>
            </div>

            {{-- Owner Information --}}
            <div class="col s6">
                <p>
                    OWNER
                </p>
            </div>
        </div>

        <div class="row">
            {{-- Logo --}}
            <div id="logo-container" class="col s4">
                <p>
                    Logo <br>
                    Swine Breed <br>
                    Swine Breed Registry PH <br>
                    Address
                </p>
            </div>

            {{-- Specific Traits --}}
            <div class="col s8">
                <p>
                    Traits/EPD <br> <br>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                    nisi ut aliquip ex ea commodo consequat.
                </p>
            </div>
        </div>
    </div>
</div>

@endsection


@section('customScript')
@endsection
