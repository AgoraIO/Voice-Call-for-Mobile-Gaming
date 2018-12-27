using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class MuteButton : MonoBehaviour {

	public Sprite mutedImage;
	public Sprite unmutedImage;
	public GameController gameController;

	Image myImageComponent;
	private bool isMuted = false;

	void Start () {
		myImageComponent = GetComponent<Image> ();
		gameObject.SetActive (false);
	}

	public void SetHidden (bool hidden) {
		if (!hidden) {
			isMuted = false;
			myImageComponent.sprite = unmutedImage;
		}

		gameObject.SetActive (!hidden);
	}

	public void MuteClicked () {
		isMuted = !isMuted;
		myImageComponent.sprite = isMuted ? mutedImage : unmutedImage;
		gameController.MuteSelf (isMuted);
	}
}
