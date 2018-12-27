using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Speaker : MonoBehaviour {

	public VolumeCircle volumeCircle;
	public CircleCollider2D circleCollider;

	private GameController gameController;
	private bool onDraging = false;
	private Color color;

	void Start () {
		color = RandomColor ();

		SpriteRenderer s = GetComponent<SpriteRenderer>();
		s.color = color;

		circleCollider = GetComponent<CircleCollider2D> ();
		if (circleCollider == null) {
			Debug.Log ("circleCollider not found");
		}
	}

	public void SetupController (GameController controller) {
		gameController = controller;
	}

	public void SetupOnDraging (bool onDraging) {
		this.onDraging = onDraging;
	}

	public void SetVolume (uint volume) {
		if (volume > 100) {
			VolumeCircle cloneCircle = Instantiate (volumeCircle, transform.position, transform.rotation) as VolumeCircle;
			SpriteRenderer cloneCircleRenderer = cloneCircle.GetComponent<SpriteRenderer>();
			cloneCircleRenderer.color = color;

			cloneCircle.AnimateWithVolume ((int)volume);
		}
	}

	void OnTriggerEnter2D(Collider2D other) {
		if (other.tag == "Boundary") {
			return;
		}

		if (onDraging) {
			return;
		}

		Destroy(other.gameObject);

		AudioSource boom = GetComponent<AudioSource> ();

		if (gameController.SpeakerShouldPlayCollideSound ()) {
			Debug.Log("gameController.SpeakerShouldPlayCollideSound ()");
			boom.Play ();
		} else {
			Debug.Log("gameController.SpeakerCollided");
			gameController.SpeakerCollided (this);
		}
	}

	Color RandomColor() {
		float r = Random.Range (0.02f, 0.98f);
		float g = Random.Range (0.02f, 0.98f);
		float b = Random.Range (0.02f, 0.98f);
		return new Color (r, g, b, 1f);
	}
}
