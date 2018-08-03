@extends('users.admin.home')

@section('title')
    | Manage Evaluators
@endsection

@section('content')

<div class="container">
    <manage-evaluators :initial-evaluators="{{ $customizedEvaluatorData }}"> </manage-evaluators>
</div>

@endsection