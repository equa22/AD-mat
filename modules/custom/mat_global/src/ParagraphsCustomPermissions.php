<?php

namespace Drupal\mat_global;

use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Symfony\Component\DependencyInjection\ContainerInterface;

class ParagraphsCustomPermissions implements ContainerInjectionInterface {

  use StringTranslationTrait;

  /**
   * The entity manager.
   *
   * @var \Drupal\Core\Entity\EntityManagerInterface
   */
  protected $entityTypeManager;

  /**
   * Constructs a TaxonomyViewsIntegratorPermissions instance.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity manager.
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager) {
    $this->entityTypeManager = $entity_type_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('entity_type.manager')
    );
  }

  /**
   * @return array
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
   */
  public function permissions() {
    $permissions = [];

    $nodeTypes = $this->entityTypeManager->getStorage('node_type')->loadMultiple();
    $paragraphs = $this->entityTypeManager->getStorage('paragraphs_type')->loadMultiple();

    /* @var \Drupal\node\Entity\NodeType $node_type*/
    foreach ($nodeTypes as $node_type) {
      /* @var \Drupal\paragraphs\Entity\ParagraphsType $paragraph*/
      foreach ($paragraphs as $paragraph) {
        $permissions += [
          'change order of items for content ' . $node_type->id() . 'for paragraph' . $paragraph->id() => [
            'title' => $this->t('Change the sort order of the items for content type @content and paragraph %paragraph', array('@content' => $node_type->label(), '%paragraph' => $paragraph->label())),
            'description' => $this->t('User will be able to order items for paragraph of this content type.')
          ],
        ];

        $permissions += [
          'remove items for content ' . $node_type->id() . 'for paragraph' . $paragraph->id() => [
            'title' => $this->t('Remove items for content type %content and paragraph %paragraph', array('@content' => $node_type->label(), '%paragraph' => $paragraph->label())),
            'description' => $this->t('User will be able to remove items of this paragraph type.')
          ],
        ];
      }
    }

    return $permissions;
  }
}
