<?php

namespace Drupal\mat_global;


use Drupal\node\Entity\Node;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Event\FilterResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class StoriesRedirectSubscriber implements EventSubscriberInterface {

  /**
   * {@inheritdoc}
   */
  static function getSubscribedEvents() {
    $events[KernelEvents::RESPONSE][] = ['checkForRedirection'];
    return $events;
  }

  /**
   * Check for redirection.
   *
   * @param \Symfony\Component\HttpKernel\Event\FilterResponseEvent $event
   */
  public function checkForRedirection(FilterResponseEvent $event) {

    $request = $event->getRequest();
    $node = $request->attributes->get('node');
    if ($node instanceof Node && $node->getType() == "story_profile") {
      $route = \Drupal::routeMatch()->getRouteObject();
      $is_admin = \Drupal::service('router.admin_context')
        ->isAdminRoute($route);
      if (!$is_admin) {
        $event->setResponse(new RedirectResponse('/stories#' . $node->id()));
      }
    }
  }
}
