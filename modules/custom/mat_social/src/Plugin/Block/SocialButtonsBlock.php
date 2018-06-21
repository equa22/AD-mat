<?php

namespace Drupal\mat_social\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Block\BlockPluginInterface;

/**
 * Provides a 'Social Buttons' Block.
 *
 * @Block(
 *   id = "social_buttons_block",
 *   admin_label = @Translation("Social share buttons block"),
 *   category = @Translation("Custom"),
 * )
 */
class SocialButtonsBlock extends BlockBase {

  public function build() {    
    $node = \Drupal::routeMatch()->getParameter('node');
    if ($node instanceof \Drupal\node\NodeInterface) {
      $nid = $node->id();
      $host = $host = \Drupal::request()->getSchemeAndHttpHost();
      $alias = \Drupal::service('path.alias_manager')->getAliasByPath('/node/'.$nid);
      $full_url = $host.$alias;
      $node_title = $node->get('title')->getValue()[0]['value'];
    }
    $markup = '<div class="social-share"><div class="container">
      <div class="left"><a href="/newsroom" class="btn-news-back">'.t('Back to all news articles').'</a></div>
      <div class="right">
      <p>'.t('Share article').'</p>
        <ul class="article-share">
          <li class="fb"><a href="https://www.facebook.com/sharer/sharer.php?u='.$full_url.'" target="_blank">Facebook</a></li>
          <li class="tw"><a href="http://twitter.com/share?text='.$node_title.'&url='.$full_url.'" target="_blank">Twitter</a></li>
          <li class="em"><a href="mailto:?subject=I wanted you to see this site&amp;body='.$node_title.' '.$full_url.'">Email</a></li>
        </ul>
      </div></div>
    </div>';
    return [
      '#markup' => $markup,
      '#cache' => [
        'max-age' => 0
      ]
    ];
  }

}
