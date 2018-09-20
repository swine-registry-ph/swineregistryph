@extends('users.breeder.home')

@section('title')
    | View Registered Swine
@endsection

@section('content')

<div class="row">
    <div class="col s10 offset-s1">
        <view-registered-swine 
            :breeds="{{ $breedOptions }}"
            :current-filter-options="{{ $currentFilterOptions }}"
            :farmoptions="{{ $farmOptions }}"
            :current-search-parameter="'{{ $currentSearchParameter }}'"
            :swines="{{ $filteredSwines }}"
            :view-url="'{{ route('viewRegdSwine') }}'"
        >
        </view-registered-swine>
    </div>
</div>

@endsection


@section('customScript')
@endsection
