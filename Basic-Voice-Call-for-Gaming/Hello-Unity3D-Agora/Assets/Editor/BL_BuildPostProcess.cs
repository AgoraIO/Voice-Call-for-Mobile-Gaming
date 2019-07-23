using UnityEngine;
using UnityEditor;
using UnityEditor.Callbacks;
using System.Collections;
using UnityEditor.iOS.Xcode;
using System.IO;

public class BL_BuildPostProcess {

	[PostProcessBuild]
	public static void OnPostprocessBuild(BuildTarget buildTarget, string path) {

		if (buildTarget == BuildTarget.iOS) {
			string projPath = path + "/Unity-iPhone.xcodeproj/project.pbxproj";

			DisableBitcode (projPath);
			LinkLibraries (projPath);
		}
	}

	public static void DisableBitcode (string projPath) {
		
		PBXProject proj = new PBXProject();
		proj.ReadFromString(File.ReadAllText(projPath));

		string target = proj.TargetGuidByName("Unity-iPhone");

		proj.SetBuildProperty(target, "ENABLE_BITCODE", "false");

		File.WriteAllText(projPath, proj.WriteToString());
	}

	public static void LinkLibraries (string projPath) {

		string contents = File.ReadAllText(projPath);

		// StoreKit.framework
		contents = contents.Replace("/* Bulk_Assembly-CSharp_0.cpp */; };",
			"/* Bulk_Assembly-CSharp_0.cpp */; };\n\t\t07B07E8E1EB2FB1D003DF680 /* CoreTelephony.framework in Frameworks */ = {isa = PBXBuildFile; fileRef = 07B07E8D1EB2FB1D003DF680 /* CoreTelephony.framework */; };\n\t\t07B07E901EB2FB22003DF680 /* libresolv.tbd in Frameworks */ = {isa = PBXBuildFile; fileRef = 07B07E8F1EB2FB22003DF680 /* libresolv.tbd */; };");
		contents = contents.Replace("path = Classes/Native/Bulk_Generics_3.cpp; sourceTree = SOURCE_ROOT; };",
			"path = Classes/Native/Bulk_Generics_3.cpp; sourceTree = SOURCE_ROOT; };\n\t\t07B07E8D1EB2FB1D003DF680 /* CoreTelephony.framework */ = {isa = PBXFileReference; lastKnownFileType = wrapper.framework; name = CoreTelephony.framework; path = System/Library/Frameworks/CoreTelephony.framework; sourceTree = SDKROOT; };\n\t\t07B07E8F1EB2FB22003DF680 /* libresolv.tbd */ = {isa = PBXFileReference; lastKnownFileType = \"sourcecode.text-based-dylib-definition\"; name = libresolv.tbd; path = usr/lib/libresolv.tbd; sourceTree = SDKROOT; };");
		contents = contents.Replace("00000000008063A1000160D3 /* libiPhone-lib.a in Frameworks */,",
			"07B07E901EB2FB22003DF680 /* libresolv.tbd in Frameworks */,\n\t\t\t\t07B07E8E1EB2FB1D003DF680 /* CoreTelephony.framework in Frameworks */,\n\t\t\t\t00000000008063A1000160D3 /* libiPhone-lib.a in Frameworks */,");
		contents = contents.Replace("AA5D99861AFAD3C800B27605 /* CoreText.framework */,",
			"07B07E8F1EB2FB22003DF680 /* libresolv.tbd */,\n\t\t\t\t07B07E8D1EB2FB1D003DF680 /* CoreTelephony.framework */,\n\t\t\t\tAA5D99861AFAD3C800B27605 /* CoreText.framework */,");

		File.WriteAllText(projPath, contents);
	}
}
