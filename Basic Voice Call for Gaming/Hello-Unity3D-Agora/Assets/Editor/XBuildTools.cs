using UnityEngine;
using UnityEditor;

public class XBuildTools : MonoBehaviour
{
	[MenuItem ("Agora_Tools/Build Android APK")]
	public static void BuildApk ()
	{
		string[] levels = { "Assets/HelloUnity3D.unity" };
		BuildPipeline.BuildPlayer (levels, "TestApk.apk", BuildTarget.Android, BuildOptions.Development);
	}
}
