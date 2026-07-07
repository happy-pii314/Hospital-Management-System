<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$conn=mysqli_connect("localhost","root","","hospital_db");

if(!$conn){
    die(json_encode([
        "success"=>false,
        "message"=>"Database Connection Failed"
    ]));
}

$method=$_SERVER["REQUEST_METHOD"];

switch($method){

case "GET":

    if(isset($_GET["id"])){

        $id=$_GET["id"];

        $result=mysqli_query($conn,"SELECT * FROM patients WHERE patient_id='$id'");

        echo json_encode(mysqli_fetch_assoc($result));

    }else{

        $result=mysqli_query($conn,"SELECT * FROM patients ORDER BY patient_id DESC");

        $patients=[];

        while($row=mysqli_fetch_assoc($result)){

            $patients[]=$row;

        }

        echo json_encode($patients);

    }

break;

case "POST":

    $data=json_decode(file_get_contents("php://input"),true);

    $patient_name=$data["patient_name"];
    $age=$data["age"];
    $gender=$data["gender"];
    $blood_group=$data["blood_group"];
    $disease=$data["disease"];
    $doctor_name=$data["doctor_name"];
    $mobile=$data["mobile"];
    $admit_date=$data["admit_date"];

    if($patient_name=="" || $age=="" || $gender=="" || $blood_group=="" || $disease=="" || $doctor_name=="" || $mobile=="" || $admit_date==""){

        echo json_encode([
            "success"=>false,
            "message"=>"All Fields Required"
        ]);

        exit;

    }

    $sql="INSERT INTO patients(patient_name,age,gender,blood_group,disease,doctor_name,mobile,admit_date)
    VALUES('$patient_name','$age','$gender','$blood_group','$disease','$doctor_name','$mobile','$admit_date')";

    if(mysqli_query($conn,$sql)){

        echo json_encode([
            "success"=>true,
            "message"=>"Patient Added Successfully"
        ]);

    }else{

        echo json_encode([
            "success"=>false,
            "message"=>"Insert Failed"
        ]);

    }

break;

case "PUT":

    parse_str($_SERVER["QUERY_STRING"],$query);

    $id=$query["id"];

    $data=json_decode(file_get_contents("php://input"),true);

    $patient_name=$data["patient_name"];
    $age=$data["age"];
    $gender=$data["gender"];
    $blood_group=$data["blood_group"];
    $disease=$data["disease"];
    $doctor_name=$data["doctor_name"];
    $mobile=$data["mobile"];
    $admit_date=$data["admit_date"];

    $sql="UPDATE patients SET

    patient_name='$patient_name',
    age='$age',
    gender='$gender',
    blood_group='$blood_group',
    disease='$disease',
    doctor_name='$doctor_name',
    mobile='$mobile',
    admit_date='$admit_date'
    WHERE patient_id='$id'";

    if(mysqli_query($conn,$sql)){

        echo json_encode([
            "success"=>true,
            "message"=>"Patient Updated Successfully"
        ]);

    }else{

        echo json_encode([
            "success"=>false,
            "message"=>"Update Failed"
        ]);

    }

break;

case "DELETE":

    parse_str($_SERVER["QUERY_STRING"],$query);

    $id=$query["id"];

    $sql="DELETE FROM patients WHERE patient_id='$id'";

    if(mysqli_query($conn,$sql)){

        echo json_encode([
            "success"=>true,
            "message"=>"Patient Deleted Successfully"
        ]);

    }else{
        echo json_encode([
            "success"=>false,
            "message"=>"Delete Failed"
        ]);
    }
break;

default:
    echo json_encode([
        "success"=>false,
        "message"=>"Invalid Request"
    ]);
}