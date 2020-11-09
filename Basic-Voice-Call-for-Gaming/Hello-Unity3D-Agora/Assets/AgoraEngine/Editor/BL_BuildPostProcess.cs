#if UNITY_IPHONE || UNITY_STANDALONE_OSX
using System.IO;
using UnityEditor;
using UnityEditor.Callbacks;
using UnityEditor.iOS.Xcode;


public class BL_BuildPostProcess
{

    [PostProcessBuild]
    public static void OnPostprocessBuild(BuildTarget buildTarget, string path)
    {
        if (buildTarget == BuildTarget.iOS)
        {
            #if UNITY_IPHONE
            LinkLibraries(path);
            #endif
        }
         else if (buildTarget == BuildTarget.StandaloneOSX)
         {
            string plistPath = path + "/Contents/Info.plist"; // straight to a binary
            if (path.EndsWith(".xcodeproj"))
            {
                // This must be a build that exports Xcode
                string dir = Path.GetDirectoryName(path);
                plistPath = dir + "/" + PlayerSettings.productName + "/Info.plist";
            }
            UpdatePermission(plistPath);
         }
    }

#if UNITY_IPHONE
    public static void DisableBitcode(string projPath)
    {
        PBXProject proj = new PBXProject();
        proj.ReadFromString(File.ReadAllText(projPath));

        string target = GetTargetGuid(proj);
        proj.SetBuildProperty(target, "ENABLE_BITCODE", "false");
        File.WriteAllText(projPath, proj.WriteToString());
    }

    static string GetTargetGuid(PBXProject proj)
    {
#if UNITY_2019_3_OR_NEWER
        return proj.GetUnityFrameworkTargetGuid();
#else
	    return proj.TargetGuidByName("Unity-iPhone");
#endif
    }
    // The followings are the addtional frameworks to add to the project
    static string[] ProjectFrameworks = new string[] {
        "Accelerate.framework",
        "CoreTelephony.framework",
        "CoreText.framework",
        "CoreML.framework",
        "Metal.framework",
        "VideoToolbox.framework",
        "libiPhone-lib.a",
        "libresolv.tbd",
    };

    public static void LinkLibraries(string path)
    {
        // linked library
        string projPath = path + "/Unity-iPhone.xcodeproj/project.pbxproj";
        PBXProject proj = new PBXProject();
        proj.ReadFromFile(projPath);
        string target = GetTargetGuid(proj);

        // disable bit-code
        proj.SetBuildProperty(target, "ENABLE_BITCODE", "false");

        // Frameworks
        foreach (string framework in ProjectFrameworks)
        {
            proj.AddFrameworkToProject(target, framework, true);
        }
        File.WriteAllText(projPath, proj.WriteToString());

        // permission
        string pListPath = path + "/Info.plist";
        PlistDocument plist = new PlistDocument();
        plist.ReadFromString(File.ReadAllText(pListPath));
        PlistElementDict rootDic = plist.root;
        var micPermission = "NSMicrophoneUsageDescription";
        rootDic.SetString(micPermission, "Voice call need to user mic");
        File.WriteAllText(pListPath, plist.WriteToString());
    }
#endif

    /// <summary>
    ///   Update the permission 
    /// </summary>
    /// <param name="pListPath">path to the Info.plist file</param>
    static void UpdatePermission(string pListPath)
    {
        PlistDocument plist = new PlistDocument();
        plist.ReadFromString(File.ReadAllText(pListPath));
        PlistElementDict rootDic = plist.root;
        var micPermission = "NSMicrophoneUsageDescription";
        rootDic.SetString(micPermission, "Voice call need to user mic");
        File.WriteAllText(pListPath, plist.WriteToString());
    }
}
#endif
