@extends('users.admin.home')

@section('title')
    | Manage Breeders
@endsection

@section('content')

<div class="container">
    <manage-breeders :breeders="{{ $breeders }}"> </manage-breeders>
</div>

@endsection
