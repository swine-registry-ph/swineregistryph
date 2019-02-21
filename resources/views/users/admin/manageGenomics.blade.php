@extends('users.admin.home')

@section('title')
    | Manage Genomics
@endsection

@section('content')

<div class="container">
    <manage-genomics :initial-genomics="{{ $customizedGenomicsData }}"> </manage-genomics>
</div>

@endsection