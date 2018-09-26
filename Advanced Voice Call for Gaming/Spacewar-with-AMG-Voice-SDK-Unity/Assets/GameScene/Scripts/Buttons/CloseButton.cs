using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class CloseButton : MonoBehaviour {

	public GameController gameController;

	public void CloseClicked () {
		gameController.UnLoadEngineCallbacks ();
		gameController.LeaveChannel ();

		SceneManager.LoadScene ("MainScene");
	}
}
