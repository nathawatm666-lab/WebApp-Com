<?php
// backend_php/index.php
// ใช้เป็น Router หลักในการจำลอง JSON Server ด้วย PHP
require_once 'db.php';

$request = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

$parsedUrl = parse_url($request);
$path = $parsedUrl['path'];
$query = [];
if (isset($parsedUrl['query'])) {
    parse_str($parsedUrl['query'], $query);
}

// ตัด slash ด้านหน้า และแบ่ง path
$pathParts = explode('/', trim($path, '/'));
$table = $pathParts[0] ?? '';
$id = $pathParts[1] ?? null;

// รองรับไฟล์อื่นๆ ในโฟลเดอร์ให้สามารถเปิดได้ตรงๆ
if ($table === 'seed.php' || $table === 'test_db.php') {
    return false; // ให้ PHP Built-in Server ทำงานต่อไปเพื่ออ่านไฟล์
}

// ตารางที่อนุญาตให้เรียกใช้งานได้
$allowedTables = ['products', 'categories', 'brands', 'users', 'orders', 'reviews', 'promotions'];

if (!in_array($table, $allowedTables)) {
    http_response_code(404);
    echo json_encode(["error" => "Endpoint not found"]);
    exit();
}

function decodeJsonFields(&$row) {
    if (!$row) return;
    foreach ($row as $k => $v) {
        if (is_string($v) && (strpos($v, '{') === 0 || strpos($v, '[') === 0)) {
            $decoded = json_decode($v, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $row[$k] = $decoded;
            }
        }
    }
}

try {
    if ($method === 'GET') {
        if ($id) {
            $stmt = $conn->prepare("SELECT * FROM `$table` WHERE id = ?");
            $stmt->execute([$id]);
            $result = $stmt->fetch();
            decodeJsonFields($result);
            echo json_encode($result ?: ["error" => "Not found"]);
        } else {
            $where = [];
            $params = [];
            foreach ($query as $key => $val) {
                // Ignore limit/sort for simplicity, just handle exact matches
                if (in_array($key, ['_limit', '_sort', '_order'])) continue;
                $where[] = "`$key` = ?";
                $params[] = $val;
            }
            $sql = "SELECT * FROM `$table`";
            if (!empty($where)) {
                $sql .= " WHERE " . implode(" AND ", $where);
            }
            $stmt = $conn->prepare($sql);
            $stmt->execute($params);
            $results = $stmt->fetchAll();
            
            foreach ($results as &$row) {
                decodeJsonFields($row);
            }
            echo json_encode($results);
        }
    } elseif ($method === 'POST') {
        $originalData = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($originalData['id'])) {
            $originalData['id'] = uniqid();
        }
        
        $data = $originalData;
        $keys = array_keys($data);
        $fields = implode("`, `", $keys);
        $placeholders = implode(", ", array_fill(0, count($keys), "?"));
        
        // Encode arrays back to json string before saving
        foreach ($data as $k => $v) {
            if (is_array($v) || is_object($v)) {
                $data[$k] = json_encode($v, JSON_UNESCAPED_UNICODE);
            } elseif(is_bool($v)) {
                $data[$k] = $v ? 1 : 0;
            }
        }
        
        $sql = "INSERT INTO `$table` (`$fields`) VALUES ($placeholders)";
        $stmt = $conn->prepare($sql);
        $stmt->execute(array_values($data));
        
        echo json_encode($originalData);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
