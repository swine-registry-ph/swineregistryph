@extends('users.breeder.home')

@section('title')
    | Register Swine
@endsection

@section('content')

<div class="container">
    <div class="row">
        <collection :farmoptions="{{ $farmOptions }}" :breeds="{{ $breedOptions }}"></collection>
    </div>
</div>

@endsection


@section('customScript')
@endsection
