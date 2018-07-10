@extends('users.admin.home')

@section('title')
    | Manage Breeders
@endsection

@section('content')

<div class="container">
    <manage-breeders 
        :initial-breeders="{{ $customizedBreederData }}"
        :province-options="{{ $provinceOptionsSorted }}"
    > 
    </manage-breeders>
</div>

@endsection
