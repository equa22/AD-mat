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
      $alias = \Drupal::service('path.alias_manager')
        ->getAliasByPath('/node/' . $nid);
      $full_url = $host . $alias;
      $facebook_url = $host . '/node/' . $nid;
      $node_title = $node->get('title')->getValue()[0]['value'];
    }
    $markup = '<div class="nav-pre-content nav-pre-content--news"><div class="container">
      <div class="nav-pre-content--news__back"><a href="/newsroom">' . t('Back to all news articles') . '</a></div>
      <div class="nav-pre-content--news__social-share">
        <span>' . t('Share article') . '</span>
        <div class="news__social-share">
          <a href="https://www.facebook.com/sharer/sharer.php?u=' . $facebook_url . '" target="_blank" class="share-window i-facebook"></a>
          <a href="http://twitter.com/share?text=' . $node_title . '&url=' . $full_url . '" target="_blank" class="share-window i-twitter"></a>
          <a href="mailto:?subject=I wanted you to see this site&amp;body=' . $node_title . ' ' . $full_url . '" class="i-mail"></a>
        </div>
      </div>
    </div></div>';
    return [
      '#markup' => $markup,
      '#cache' => [
        'max-age' => 0,
      ],
    ];
  }

}
