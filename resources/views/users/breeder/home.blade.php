@extends('layouts.app')

@section('title')
    | Breeder - Home
@endsection

@section('sidebar')
    <ul id="slide-out" class="side-nav fixed">
        <li><a href="{{ route('showRegForm') }}">Register Swine</a></li>
        <li><a href="#!">View Registered Swine</a></li>
        <li><a href="#!">View Swine Pedigree</a></li>
        <li><a href="#!">Manage Farms</a></li>
        <li><a href="#!">Reports</a></li>
    </ul>
@endsection

@section('content')

<div class="container">
    <div class="row">
        <div class="col s12">
            <h1>Welcome, {{ Auth::user()->name }}!</h1>

            <div class="row">
            </div>
        </div>
    </div>
</div>

@endsection
