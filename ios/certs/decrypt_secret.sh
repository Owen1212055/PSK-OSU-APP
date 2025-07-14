#!/bin/sh

gpg --quiet --batch --yes --decrypt --passphrase="$IOS_CERT_DECRYPT_KEY" --output dist.p12 dist.p12.gpg
gpg --quiet --batch --yes --decrypt --passphrase="$IOS_CERT_DECRYPT_KEY" --output profile.mobileprovision profile.mobileprovision.gpg
gpg --quiet --batch --yes --decrypt --passphrase="$IOS_CERT_DECRYPT_KEY" --output AuthKey.p8 AuthKey.p8.gpg
gpg --quiet --batch --yes --decrypt --passphrase="$IOS_CERT_DECRYPT_KEY_2" --output ../../credentials.json credentials.json.gpg
