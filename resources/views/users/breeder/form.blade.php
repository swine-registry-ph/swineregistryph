@extends('users.breeder.home')

@section('title')
    | Register Swine
@endsection

@section('content')

<div class="">
    <div class="row">
        <collection :farmoptions="{{ $farmOptions }}" :breeds="{{ $breedOptions }}" :uploadurl="'{{ route('uploadPhoto') }}'"></collection>
    </div>
</div>

@endsection


@section('customScript')
@endsection
