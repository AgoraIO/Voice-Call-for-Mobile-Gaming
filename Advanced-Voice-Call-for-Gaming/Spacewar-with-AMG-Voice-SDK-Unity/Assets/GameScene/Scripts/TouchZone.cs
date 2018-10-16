using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;

public class TouchZone : MonoBehaviour, IPointerDownHandler, IDragHandler, IPointerUpHandler {

	public GameController gameController;
	public Spaceship spaceship;

	private Rect availablePeerRect;
	private Vector2 selectedTouchOrigin;
	private Vector2 selectedSpeakerOrigin;

	void Start () {
		availablePeerRect = gameController.TouchPadAvailablePeerRect ();
	}

	public void OnPointerDown (PointerEventData data) {
		Vector2 touchedPoint = Camera.main.ScreenToWorldPoint(data.position);
		Speaker selectedSpeaker = SelectedSpeakerAtPosition (touchedPoint);
		gameController.selectedSpeaker = selectedSpeaker;

		if (selectedSpeaker) {
			selectedSpeaker.SetupOnDraging (true);
			selectedTouchOrigin = touchedPoint;
			selectedSpeakerOrigin = selectedSpeaker.transform.position;
		}
	}

	public void OnDrag (PointerEventData data) {
		Vector2 touchedPoint = Camera.main.ScreenToWorldPoint(data.position);
		Vector2 translation = touchedPoint - selectedTouchOrigin;

		Speaker selectedSpeaker = gameController.selectedSpeaker;
		if (selectedSpeaker) {
			MoveSpeaker (selectedSpeaker, translation);
		}
	}

	public void OnPointerUp (PointerEventData data) {
		Vector2 touchedPoint = Camera.main.ScreenToWorldPoint(data.position);

		Speaker selectedSpeaker = gameController.selectedSpeaker;
		if (selectedSpeaker) {
			selectedSpeaker.SetupOnDraging (false);
			gameController.TouchPadDidMoveSpeaker (selectedSpeaker);
			gameController.selectedSpeaker = null;
		} else {
			Vector2 spaceshipPoint = spaceship.transform.position;

			Vector2 directionRaw = new Vector2 (
				touchedPoint.x - spaceshipPoint.x, 
				touchedPoint.y - spaceshipPoint.y
			);
			Vector2 direction = directionRaw.normalized;
			spaceship.FireStar (direction);
		}
	}

	Speaker SelectedSpeakerAtPosition (Vector2 position) {
		foreach (var item in gameController.addedSpeakers) {
			Speaker speaker = item.Value;
			if (speaker.circleCollider.bounds.Contains (position)) {
				return speaker;
			}
		}

		return null;
	}

	void MoveSpeaker(Speaker speaker, Vector2 translation) {
		Vector2 newPosition = selectedSpeakerOrigin + translation;

		if (availablePeerRect.Contains(newPosition)) {
			speaker.transform.position = newPosition;
		} else if (newPosition.x > availablePeerRect.xMin && newPosition.x < availablePeerRect.xMax) {
			speaker.transform.position = new Vector2 (newPosition.x, speaker.transform.position.y);
		} else if (newPosition.y > availablePeerRect.yMin && newPosition.y < availablePeerRect.yMax) {
			speaker.transform.position = new Vector2 (speaker.transform.position.x, newPosition.y);
		}
	}
}
