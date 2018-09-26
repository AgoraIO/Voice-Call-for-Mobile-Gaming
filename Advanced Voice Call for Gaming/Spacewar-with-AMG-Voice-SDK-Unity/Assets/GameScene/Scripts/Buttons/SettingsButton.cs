using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SettingsButton : MonoBehaviour {

	public GameController gameController;
	private bool shouldDispalyCanvas = false;

	void Start () {
		gameController.DisplaySettingsCanvas (false);
	}
	
	public void SetHidden (bool hidden) {
		if (!hidden && shouldDispalyCanvas) {
			shouldDispalyCanvas = false;
			gameController.DisplaySettingsCanvas (false);
		}

		gameObject.SetActive (!hidden);
	}

	public void SettingsClicked () {
		shouldDispalyCanvas = !shouldDispalyCanvas;
		gameController.DisplaySettingsCanvas (shouldDispalyCanvas);
	}
}
