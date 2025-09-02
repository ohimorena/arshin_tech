<?php
require_once("vendor/autoload.php");

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;


$json = file_get_contents("php://input");
$data = json_decode($json, true);

$arr = [
  "ФИО" => $data["full_name"],
  "Компания" => $data["company"],
  "Город" => $data["city"],
  "Email" => $data["email"],
  "Телефон" => $data["phone"],
  "Объект наблюдения" => $data["object"],
  "Размер помещения" => $data["room_size"],
  "Разрешение записи видео" => $data["video_resolution"],
  "Объём видеоархива" => $data["archive_volume"],
  "Расстояние от камер до видеорегистратора" => $data["distance_to_dvr"],
  "Расстояние от камеры до источника питания" => $data["distance_to_power"],
  "Назначение камер" => $data["camera_purpose"],
  "Количество камер" => $data["camera_count"],
  "Примечания и пожелания" => $data["notes"]
];

$txt_tg = '';
$txt_mail = '';
foreach($arr as $key => $value) {
  $txt_tg .= "<b>".$key."</b>: ".$value."%0A";
  $txt_mail .= "<p><b>{$key}</b>: {$value}</p>";
};

// Формирование письма
$mail = new PHPMailer();
$mail->setFrom('mail_smtp@mail.ru', 'Команда Arshin Tech');
$mail->addAddress('mail_to@mail.ru');
$mail->Subject = 'Заявка с сайта';
$mail->msgHTML("<html><body>
                {$txt_mail}
                </html></body>");
$mail->isSMTP();
$mail->Host = 'smtp.timeweb.ru';
$mail->Username = 'mail_smtp@mail.ru';
$mail->Password = 'password';
$mail->SMTPAuth = true;
$mail->SMTPSecure = 'ssl';
$mail->Port = 465;
$mail->CharSet = 'UTF-8';

try {
  // Отправка данных в телеграм-бот
  $token = "";
  $chat_id = "";
  $sendTg = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text={$txt_tg}", "r");

  // Отправка данных на почту
  $mail->send();

  echo "{$data['full_name']}, ваша заявка принята";
} catch (Exception $e) {
  echo "Ошибка отправки, попробуйте ещё раз";
}