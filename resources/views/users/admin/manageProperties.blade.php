@extends('users.admin.home')

@section('title')
    | Manage Properties
@endsection

@section('content')

<div class="container">
    <manage-properties :initial-properties="{{ $properties }}"> </manage-properties>
</div>

@endsection
