Steps to reproduce to deploy a new version:

Signing and Notarizing pkg help:
https://www.davidebarranca.com/2019/04/notarizing-installers-for-macos-catalina/

* Package UI
* Deploy UI
* Build the Driver in Release mode
* Build in app Release mode
* Product > Archive
* Window > Organizer
* Select build > Distribute app > Developer ID > Next next next
* Wait for notarization to happen > Export notarized .app to native/app/update
* Goto native/app/update
* Check for: `codesign -dvv eqMac.app`

* `open ../eqMac.pkgproj`

* Build the .pkg move it to the /native/update dir: `mv ../build/eqMac.pkg eqMac_unsigned.pkg`

* Codesign the pkg file: `productsign --sign 'Developer ID Installer: Bitgapp Ltd.' eqMac_unsigned.pkg eqMac.pkg`

* Make a copy for the update zip file: `cp eqMac.pkg eqMac.sparkle_interactive.pkg`

* Check codesign with: `pkgutil --check-signature eqMac.pkg` (also for the sparkle_interactive.pkg)

* Send pkg for notarization: `xcrun altool --username "APPLE_EMAIL" --password "APPLE_APP_PASSWORD" --notarize-app --primary-bundle-id "com.bitgapp.eqmac.pkg" --file "~/Programming/Bitgapp/eqMac/native/update/eqMac.pkg" --asc-provider "JZA6C97KJA"`
Copy the RequestUUID!!

* Keep checking for notarization status with until Package Approved: `xcrun altool --username "APPLE_EMAIL" --password "APPLE_APP_PASSWORD" --notarization-info COPIED_RequestUUID`

* Stamp the notarized pkg with ticket: 
`xcrun stapler staple "/Users/nodeful/Programming/Bitgapp/eqMac/native/update/eqMac.pkg"`
`xcrun stapler staple "/Users/nodeful/Programming/Bitgapp/eqMac/native/update/eqMac.sparkle_interactive.pkg"`

* Check the valid ticket (Look for "The validate action worked!"):
`stapler validate --verbose "/Users/nodeful/Programming/Bitgapp/eqMac/native/update/eqMac.sparkle_interactive.pkg"`

* Make a zip for Spakle updated: `zip -r -X eqMac.zip eqMac.sparkle_interactive.pkg`
* Sparkle Sign: `sign_update eqMac.zip`
replace the sparkle:edSignature and length in update.xml file

* Set correct version and date in update.xml file
* Update Changelog.md
* Run: `./generate-changelog.sh`
* Copy the generated update.html content to the update.xml
* `./deploy.sh`
