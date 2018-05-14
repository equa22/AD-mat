#!/bin/sh


# Remove main .git
rm -Rf .git

# Remove .git from modules
rm -Rf modules/media_entity_browser/.git

# Remove pipelines
rm -rf scripts/bitbucket-pipelines
rm -f bitbucket-pipelines.yml