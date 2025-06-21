<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if ($data && isset($data['addr']) && isset($data['provider'])) {
    $log = [
        'time' => date("Y-m-d H:i:s"),
        'addr' => $data['addr'],
        'provider' => $data['provider']
    ];

    $file = 'wallet_logs.json';
    $logs = [];

    if (file_exists($file)) {
        $logs = json_decode(file_get_contents($file), true);
    }

    $logs[] = $log;
    file_put_contents($file, json_encode($logs, JSON_PRETTY_PRINT));

    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid input"]);
}
?>
