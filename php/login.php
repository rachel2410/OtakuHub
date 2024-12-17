<?php
header("Content-Type: application/json");

// Allow requests from multiple specific origins
$allowedOrigins = [
    'http://localhost:3000',
    'https://otakuhub-ray.vercel.app'
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

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->username) && !empty($data->password)) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM otakuUsers WHERE username = ?");
        $stmt->execute([$data->username]);
        $user = $stmt->fetch();

        if ($user && password_verify($data->password, $user['password'])) {
            echo json_encode(["success" => true, "username" => $user['username']]);
        } else {
            echo json_encode(["success" => false, "message" => "Invalid credentials"]);
        }
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "SQL Error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid input"]);
}
?>
