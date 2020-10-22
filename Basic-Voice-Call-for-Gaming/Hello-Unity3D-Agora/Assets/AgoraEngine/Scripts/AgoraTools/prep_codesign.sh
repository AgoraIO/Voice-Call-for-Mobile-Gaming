#!/bin/bash
################################################################################
#   Script:  prep_codesign.sh
#
#   Synosis: prep_codesign.sh <App>
#
#   Description
#	Use for Unity Mac build only.  When an Agora Unity Project gets built,
#   the framework library symbolic link structure gets lost.  This script will
#   restore the symlink structure inside the AgoraRTCKit frame work.
#	
#	For a reference to the original framework structure, you may also take
#   a look at the online download zipped version and look inside the bundle.
#	
#   Usage:
#   *	Use for preparation for codesign and distribution that requires Apple 
#	notarization.
#
#   *	Run this from the build directory where your Mac build ("YourApp.app") is.
#	Build the Unity Project and execute this script, for example:
#	    ./prep_codesign.sh YourApp.app
#   *   A entitlement file "App.entitlements" will be created.  Use that for your
#	codesign --entitlements option.
#	
################################################################################

if [ "$1" == "" ] || [ $# -lt 1 ]; then
   echo "Please enter the app location"
   exit 1
fi

echo "--------------------------------------"
echo "start restructure framework links..."
echo "--------------------------------------"
APP="$PWD/$1"
ENTITLEMENT="App.entitlements"

shopt -s extglob


function create_entitlement {
echo "Writing entitlement to $ENTITLEMENT ..."

echo "
<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">
<plist version=\"1.0\">
<dict>
	<key>com.apple.security.cs.disable-library-validation</key>
	<true/>
	<key>com.apple.security.cs.disable-executable-page-protection</key>
	<true/>
	<key>com.apple.security.device.audio-input</key>
	<true/>
	<key>com.apple.security.device.camera</key>
	<true/>
	<key>com.apple.security.network.client</key>
	<true/>
	<key>com.apple.security.network.server</key>
	<true/>
</dict>
</plist>
" > $ENTITLEMENT
}

function relink {
    # remove everything except versions
    echo "removing duplicate framework files... in $PWD"
    rm -rf !(Versions)
    rm -rf Versions/Current*
    
    cd Versions
    ln -s A Current
    cd ..
    
    for filename in Versions/Current/*; do
        if [ ${filename: -5} != ".meta" ]; then
          echo "linking $filename"
          ln -s $filename .
        fi
    done
}

function signhelp {
AGORA_FRAMEWORK='$APP/Contents/PlugIns/agoraSdkCWrapper.bundle/Contents/Resources/AgoraRtcKit.framework'
AGORA_CLIB='$APP/Contents/Plugins/agoraSdkCWrapper.bundle/Contents/MacOS/agoraSdkCWrapper'

echo ""
echo "Make sure you code sign the following items in addition to the App itself:"
echo "1. $AGORA_FRAMEWORK"
echo "2. $AGORA_CLIB"

}

# remove all meta files
find $APP -type f -name "*.meta" -delete

(cd $APP/Contents/Plugins/agoraSdkCWrapper.bundle/Contents/Resources/AgoraRtcKit.framework && relink) 2>/dev/null
(cd $APP/Contents/Plugins/agoraSdkCWrapper.bundle/Contents/Frameworks/AgoraRtcKit.framework && relink) 2>/dev/null

create_entitlement

echo "--------------------------------------"
echo "done."
signhelp
echo "--------------------------------------"
