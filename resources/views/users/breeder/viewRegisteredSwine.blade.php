@extends('users.breeder.home')

@section('title')
    | View Registered Swine
@endsection

@section('content')

<div class="row">
    <div class="col s10 offset-s1">
        <view-registered-swine :swines="{{ $swines }}"></view-registered-swine>
    </div>
</div>

@endsection


@section('customScript')
@endsection
