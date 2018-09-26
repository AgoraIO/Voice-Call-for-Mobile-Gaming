using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class CommanderButton : MonoBehaviour {

	public Sprite commanderImage;
	public Sprite audienceImage;
	public GameController gameController;

	Image myImageComponent;
	private bool isCommander = false;

	void Start () {
		myImageComponent = GetComponent<Image> ();
		gameObject.SetActive (false);
	}

	public void SetHidden (bool hidden) {
		if (!hidden) {
			SetCommander (ApplicationModal.AudioGameProfile == 1);
		}

		gameObject.SetActive (!hidden);
	}

	public void CommanderClicked () {
		SetCommander (!isCommander);
		gameController.CommanderChange (isCommander);
	}

	void SetCommander (bool commander) {
		isCommander = commander;
		myImageComponent.sprite = isCommander ? commanderImage : audienceImage;
	}
}
