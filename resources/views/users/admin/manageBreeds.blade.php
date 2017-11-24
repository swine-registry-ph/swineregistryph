@extends('users.admin.home')

@section('title')
    | Manage Breeds
@endsection

@section('content')

<div class="container">
    <manage-breeds :breeds="{{ $breeds }}"> </manage-breeds>
</div>

@endsection
