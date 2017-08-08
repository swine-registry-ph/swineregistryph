@extends('layouts.app')

@section('title')
    | Manage Swine
@endsection

@section('content')

<div class="container">
    <div class="row"></div>
    <div class="row"></div>
    <div class="row"></div>
    <div class="row">
        <div class="col s6 offset-s3">
            <div class="row">
                <a href="{{ url('manage-swine/register') }}" class="waves-effect waves-light btn-large indigo col s12">
                    <i class="material-icons left">add</i>Register New Swine
                </a>
                <span class="col s12"> <p></p> </span>
                <a href="#!" class="waves-effect waves-light btn-large indigo lighten-2 col s12">
                    <i class="material-icons left">search</i>View Swine Records
                </a>
                </div>
            </div>
        </div>
    </div>
</div>

@endsection
