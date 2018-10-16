using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class SpeakerButton : MonoBehaviour {

	public Sprite disabledImage;
	public Sprite enabledImage;
	public GameController gameController;
	public MuteButton muteButton;
	public CommanderButton commanderButton;

	Image myImageComponent;
	private bool isEnabled = false;

	void Start () {
		myImageComponent = GetComponent<Image> ();
	}

	public void SpeakerClicked () {
		isEnabled = !isEnabled;
		myImageComponent.sprite = isEnabled ? enabledImage : disabledImage;

		muteButton.SetHidden (!isEnabled);

		if (ApplicationModal.AudioGameProfile != 0) {
			commanderButton.SetHidden (!isEnabled);
		}

		if (isEnabled) {
			gameController.JoinChannel ();
		} else {
			gameController.LeaveChannel ();
		}
	}
}
