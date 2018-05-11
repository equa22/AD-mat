<?php

namespace Drupal\cotailored_base_drush_commands\Commands;

use Consolidation\AnnotatedCommand\Events\CustomEventAwareInterface;
use Consolidation\AnnotatedCommand\Events\CustomEventAwareTrait;
use Drupal\Component\Utility\UrlHelper;
use Drush\Commands\DrushCommands;
use Consolidation\AnnotatedCommand\AnnotationData;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Drush\Style\DrushStyle;

/**
 * A Drush commandfile.
 *
 * In addition to this file, you need a drush.services.yml
 * in root of your module, and a composer.json file that provides the name
 * of the services file to use.
 *
 * See these files for an example of injecting Drupal services:
 *   - http://cgit.drupalcode.org/devel/tree/src/Commands/DevelCommands.php
 *   - http://cgit.drupalcode.org/devel/tree/drush.services.yml
 */
class CotailoredBaseDrushCommandsCommands extends DrushCommands implements CustomEventAwareInterface {

  use CustomEventAwareTrait;

  /**
   * An example of the table output format.
   *
   * @command cotailored_base_drush_commands:create
   *
   * @return \Consolidation\OutputFormatters\StructuredData\RowsOfFields
   */
  public function createTheme($name = NULL) {
  }

  /**
   * @param \Symfony\Component\Console\Input\InputInterface $input
   * @param \Symfony\Component\Console\Output\OutputInterface $output
   * @param \Consolidation\AnnotatedCommand\AnnotationData $annotationData
   *
   * @hook interact cotailored_base_drush_commands:create
   */
  public function interact(InputInterface $input, OutputInterface $output, AnnotationData $annotationData) {
    $io = new DrushStyle($input, $output);
    $name = $input->getArgument('name');
    if (empty($name)) {
      $io->warning('Enter name');
      $name = $io->ask('Enter mname');
    }
    $machine_name = $io->ask('Enter machine name');
    if (!$machine_name) {
      $machine_name = $name;
    }
    $machine_name = str_replace(' ', '_', strtolower($machine_name));
    $search = [
      '/[^a-z0-9_]/',
      '/^[^a-z]+/',
    ];
    $machine_name = preg_replace($search, '', $machine_name);
    $description = $io->ask('Description');
    $subtheme_path = 'themes/custom';
    $subtheme_path = $subtheme_path . '/' . $machine_name;

    // TODO: read kits from filesystem or db.
    $kits = [
      'tdx_kickstart' => 'tdx_kickstart',
    ];

    $kit = $io->choice('Choose your kit', $kits);
    $kit_path = drupal_get_path('theme', 'tdx_base') . '/kits/' . $kit;

    if (UrlHelper::isValid($kit, TRUE)) {
      $kit_url = $kit;
      $kit_name = 'kit';

      // Get kit name from kit url.
      if (preg_match("/\/tdx_base\-kit\-([a-z0-9\_]*)\//", $kit_url, $matches)) {
        $kit_name = $kit = $matches[1];
      }

      // Switch to a temp directory.
      $current_dir = getcwd();
      chdir(drush_tempdir());

      if ($filepath = drush_download_file($kit_url)) {
        $filename = basename($filepath);
        // Decompress the zip archive.
        $files = drush_tarball_extract($filename, getcwd(), TRUE);
        // Re-index array.
        // This fixes an issue where a .tag.gz tarball returns a non-zero array.
        $files = array_values($files);
        $kit_path = getcwd() . '/' . $files[0];
        // Set working directory back to the previous working directory.
        chdir($current_dir);
      }
    }
    drush_op('drush_copy_dir', $kit_path, $subtheme_path);

    // Alter the contents of the .info file based on the command options.
    $alterations = [
      'TDX_BASE_SUBTHEME_NAME' => $name,
      'TDX_BASE_SUBTHEME_DESCRIPTION' => $description,
      'TDX_BASE_SUBTHEME_MACHINE_NAME' => $machine_name,
      'hidden: true' => '',
    ];

    $files_to_replace = $this->tdx_base_get_files_to_make_replacements($kit);
    foreach ($files_to_replace as $file_to_replace) {
      $this->tdx_base_file_str_replace($subtheme_path . '/' . $file_to_replace, array_keys($alterations), $alterations);
    }

    // Rename files.
    $files_to_rename = [
      '{{kit}}.info.yml',
      '{{kit}}.libraries.yml',
      '{{kit}}.breakpoints.yml',
      '{{kit}}.theme',
      'config/install/block.block.{{kit}}_branding.yml',
      'config/install/block.block.{{kit}}_content.yml',
      'config/install/block.block.{{kit}}_footer.yml',
      'config/install/block.block.{{kit}}_mainnavigation.yml',
      'config/install/block.block.{{kit}}_messages.yml',
      'config/install/block.block.{{kit}}_page_title.yml',
      'config/install/block.block.{{kit}}_powered.yml',
      'config/install/block.block.{{kit}}_local_tasks.yml',
    ];
    foreach ($files_to_rename as $file_to_rename_path) {
      $file_original_path = $subtheme_path . '/' . str_replace('{{kit}}', $kit, $file_to_rename_path);
      $file_new_path = $subtheme_path . '/' . str_replace('{{kit}}', $machine_name, $file_to_rename_path);
      drush_op('rename', $file_original_path, $file_new_path);
    }

    $io->success('Successfully created the Tdx base subtheme "' . $name . '"created in: path ' . $file_new_path . ' using the kit ' . $kit . '');
  }

  /**
   * Returns an array of files to make string replacements.
   *
   * @param string $kit
   *   Kit name.
   *
   * @return array
   *   Return array.
   */
  function tdx_base_get_files_to_make_replacements($kit = 'tdx_kickstart') {
    return [
      $kit . '.info.yml',
      $kit . '.libraries.yml',
      $kit . '.breakpoints.yml',
      $kit . '.theme',
      'config/install/block.block.' . $kit . '_branding.yml',
      'config/install/block.block.' . $kit . '_content.yml',
      'config/install/block.block.' . $kit . '_footer.yml',
      'config/install/block.block.' . $kit . '_mainnavigation.yml',
      'config/install/block.block.' . $kit . '_messages.yml',
      'config/install/block.block.' . $kit . '_page_title.yml',
      'config/install/block.block.' . $kit . '_powered.yml',
      'config/install/block.block.' . $kit . '_local_tasks.yml',
      'README.md',
    ];
  }

  /**
   * @param $file_path
   * @param $find
   * @param $replace
   */
  function tdx_base_file_str_replace($file_path, $find, $replace) {
    $file_contents = file_get_contents($file_path);
    $file_contents = str_replace($find, $replace, $file_contents);
    file_put_contents($file_path, $file_contents);
  }

}
