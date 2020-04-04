Steps to reproduce to deploy a new version:

Package UI
Deploy UI
Build in app Release mode
Product > Archive
Window > Organizer
Select build > Distribute app > Developer ID > Next next next
Wait for notarization to happen > Export notarized .app to native/app/update
Goto native/app/update
Check for codesign
create-dmg eqMac.app
Update Changelog.md
run ./generate-changelog.sh
run .~/Programming/Sparkle/bin/generate_appcast ~/Programming/Bitgapp/eqmac/native/app/update