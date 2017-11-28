@extends('users.admin.home')

@section('title')
    | View Farms
@endsection

@section('content')

<div class="container">
    <div class="row">
        <div class="col s12">
            <h4 class="title-page"> View Registered Swine </h4>
        </div>
        <div class="col s12">
            <ul class="collapsible" data-collapsible="accordion">
                @foreach ($farms as $farm)
                    <li>
                        <div class="collapsible-header">{{ $farm->name }}</div>
                        <div class="collapsible-body">
                            <table class="striped">
                                <thead>
                                    <tr>
                                        <th> Registration No. </th>
                                        <th> Date Registered </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach ($farm->swines as $swine)
                                        <tr>
                                            <td> {{ $swine->registration_no }} </td>
                                            <td> {{ $swine->date_registered }} </td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    </li>
                @endforeach
            </ul>
        </div>
    </div>
</div>

@endsection


@section('customScript')
@endsection
