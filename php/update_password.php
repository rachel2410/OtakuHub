<?php
header("Content-Type: application/json");

// Allow requests from specific origins
$allowedOrigins = [
    'http://localhost:3000'
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header("Access-Control-Allow-Credentials: true");
}

// Handle preflight (OPTIONS) request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    http_response_code(200);
    exit;
}

require 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $data['username'] ?? null;
    $newPassword = isset($data['password']) ? password_hash($data['password'], PASSWORD_DEFAULT) : null;

    if (!$username || !$newPassword) {
        echo json_encode(["success" => false, "message" => "Username and password are required."]);
        exit();
    }

    try {
        $stmt = $pdo->prepare("UPDATE otakuUsers SET password = ? WHERE username = ?");
        $stmt->execute([$newPassword, $username]);

        echo json_encode(["success" => true, "message" => "Password updated successfully."]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request."]);
}
?>
