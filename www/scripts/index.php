<?php
  include('mpdf/mpdf.php');

  $pdf = new mPDF();
  $pdf->WriteHTML(file_get_contents('styles.css'), 1);

  $data = json_decode(base64_decode($_GET['data']));

  $content = '<div class="' . $data->app . '"><img src="assets/' . $data->app . '.jpg" />';

  $content .= '<div class="input">' . format_input($data->input) . '</div>';
  $content .= format_output($data->output) . '</div>';

  $pdf->WriteHTML($content, 2);
  $pdf->Output();
  exit;


  function format_input ($input) {
    $content = '';

    foreach ($input as $item) {
      $content .= '<div class="row"><div class="label">' . $item->label .
        '</div><div class="value"> ' . $item->value .
        '</div></div>';
    }

    return $content;
  }

  function format_output ($output) {

    foreach ($output as $table) {
      $content .= '<table autosize="1"><tr><td class="header" colspan="' . count($table->body[0]) . '">' . $table->label . '</td></tr>';

      foreach ($table->body as $row) {
        $content .= '<tr>';

        foreach ($row as $column)
          $content .= '<td>' . (strpos($column, '$') !== false ? '<strong>' . $column . '</strong>' : $column) . '</td>';

        $content .= '</tr>';
      }
      
      $content .= '</table>';
    }

    return $content;
  }
