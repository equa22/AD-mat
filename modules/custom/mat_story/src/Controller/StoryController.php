<?php
namespace Drupal\mat_story\Controller;

use Drupal\Core\Config\Config;
use Drupal\Core\Controller\ControllerBase;
use Psr\Container\ContainerInterface;

class StoryController extends ControllerBase  {

  /**
   * @var  Drupal\Core\Config\Config
   */
  protected $config;

  public function __construct() {
    $this->config = $this->config('mat_story.settings');
  }

  public function renderFormSubmitted() {
    $content = $this->t('Thank you! Your story has been submitted!');
    $contentFromConfig = $this->config->get('mat_story.story_submitted');

    if (isset($contentFromConfig['value'])) {
      $content = $contentFromConfig['value'];
    }

    $build = [
      '#theme' => 'story_submitted',
      '#content' => $content,
    ];
    return $build;
  }
}
