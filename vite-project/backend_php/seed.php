<?php
// backend_php/seed.php
header("Content-Type: text/html; charset=UTF-8");

echo "<h2>🚀 กำลังเริ่มระบบติดตั้งฐานข้อมูล (MySQL)</h2>";

try {
    $host = "127.0.0.1";
    $db_name = "techhub_db";
    $username = "root";
    $password = "12345678"; 

    $conn = new PDO("mysql:host=$host;charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "• กำลังเตรียมฐานข้อมูล `$db_name`... ";
    $conn->exec("CREATE DATABASE IF NOT EXISTS `$db_name` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $conn->exec("USE `$db_name`");
    
    // เคลียร์ตารางป้องกัน Error ทับซ้อน
    $conn->exec("SET FOREIGN_KEY_CHECKS = 0");
    $stmt = $conn->query("SHOW TABLES");
    $allTables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    foreach ($allTables as $table) {
        $conn->exec("DROP TABLE IF EXISTS `$table`");
    }
    echo "✅ สำเร็จ (ลบตารางเดิมเรียบร้อย)<br>";
    
    $jsonPath = __DIR__ . '/../src/db/db.json';
    if (!file_exists($jsonPath)) {
        die("❌ ไม่พบไฟล์ db.json กรุณาตรวจสอบตำแหน่งไฟล์");
    }

    $jsonData = json_decode(file_get_contents($jsonPath), true);
    if (!$jsonData) die("❌ รูปแบบ JSON ไม่ถูกต้อง");

    // สร้างทีละตารางและยัดข้อมูล
    foreach ($jsonData as $tableName => $rows) {
        if (!is_array($rows) || count($rows) === 0 || in_array($tableName, ['cart', 'wishlist'])) continue;

        echo "• กำลังสร้างตาราง: <b>$tableName</b>... ";
        $firstRow = $rows[0];
        $columns = [];
        foreach ($firstRow as $colName => $value) {
            $safeColName = preg_replace('/[^a-z0-9_]+/i', '', $colName);
            $type = (is_int($value)) ? "INT" : ((is_float($value)) ? "DECIMAL(10,2)" : ((is_bool($value)) ? "TINYINT(1)" : ((is_array($value) || is_object($value)) ? "JSON" : (strlen($value) > 200 ? "TEXT" : "VARCHAR(255)"))));
            if ($safeColName === 'id') $type = "VARCHAR(50) PRIMARY KEY";
            $columns[] = "`$safeColName` $type";
        }
        
        $conn->exec("CREATE TABLE `$tableName` (" . implode(', ', $columns) . ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
        echo "✅<br>";

        $insertCount = 0;
        foreach ($rows as $row) {
            $cols = []; $vals = []; $placeholders = [];
            foreach ($firstRow as $colName => $fv) {
                $safeColName = preg_replace('/[^a-z0-9_]+/i', '', $colName);
                $cols[] = "`$safeColName`";
                $placeholders[] = "?";
                $val = $row[$colName] ?? null;
                $vals[] = (is_array($val) || is_object($val)) ? json_encode($val, JSON_UNESCAPED_UNICODE) : (is_bool($val) ? ($val ? 1 : 0) : $val);
            }
            $stmt = $conn->prepare("INSERT INTO `$tableName` (" . implode(',', $cols) . ") VALUES (" . implode(',', $placeholders) . ")");
            if ($stmt->execute($vals)) $insertCount++;
        }
        echo "&nbsp;&nbsp;&nbsp; -> นำเข้าข้อมูล $insertCount รายการเรียบร้อย<br>";
    }

    $conn->exec("SET FOREIGN_KEY_CHECKS = 1");
    echo "<h3>🎉 ทุกอย่างพร้อมใช้งานแล้ว!</h3>";
    echo "ตอนนี้ข้อมูลใน MySQL ซิงค์กับระบบเรียบร้อยครับ <a href='http://localhost:5173'>กลับไปยังหน้าเว็บ</a>";

} catch (PDOException $e) {
    try { $conn->exec("SET FOREIGN_KEY_CHECKS = 1"); } catch(Exception $ex) {}
    echo "<br>❌ <b>ข้อผิดพลาด:</b> " . $e->getMessage();
}
?>
