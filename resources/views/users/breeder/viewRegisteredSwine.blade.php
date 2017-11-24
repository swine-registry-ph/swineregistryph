@extends('users.breeder.home')

@section('title')
    | View Registered Swine
@endsection

@section('content')

<div class="row">
    <div class="col s10 offset-s1">
        <registered-swine :swines="{{ $swines }}"></registered-swine>
    </div>
</div>

@endsection


@section('customScript')
@endsection
