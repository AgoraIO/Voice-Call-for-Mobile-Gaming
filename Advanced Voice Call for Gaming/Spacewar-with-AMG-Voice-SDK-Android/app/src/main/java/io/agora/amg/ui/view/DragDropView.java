package io.agora.amg.ui.view;

import android.content.Context;
import android.util.AttributeSet;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.ImageView;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by Lucy on 7/27/17.
 */
public class DragDropView extends FrameLayout {

    private final static Logger log = LoggerFactory.getLogger(DragDropView.class);
    private int width;
    private int height;

    /**
     * Default Constructor
     * @param context
     */
    public DragDropView(Context context, View parent) {
        super(context);
        width = parent.getWidth();
        height = parent.getHeight();
    }

    /**
     * Default Constructor
     * @param context
     * @param attrs
     */
    public DragDropView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    /**
     * Default Constructor
     * @param context
     * @param attrs
     * @param defStyle
     */
    public DragDropView(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
    }

    /** Adding draggable object to the dragView
     * @param - draggableView - object to be dragged
     * @param - x horizontal position of the view
     * @param - y vertical position of the view
     * @param - width width of the view
     * @param - height height of the view
     */
    public void AddDraggableView(View draggableObject, int x, int y, int width, int height) {
        LayoutParams lpDraggableView = new LayoutParams(width, height);
        lpDraggableView.gravity = Gravity.TOP;
        lpDraggableView.leftMargin = x;
        lpDraggableView.topMargin = y;
        if(draggableObject instanceof ImageView) {
            ImageView ivDrag = (ImageView) draggableObject;
            ivDrag.setLayoutParams(lpDraggableView);
            ivDrag.setOnTouchListener(OnTouchToDrag);
            this.addView(ivDrag);
        }
        //TODO implement to do other type of view
//		else if(draggableObject instanceof TextView) {
//			TextView tvDrag = (TextView) draggableObject;
//			tvDrag.setLayoutParams(lpDraggableView);
//			tvDrag.setOnTouchListener(OnTouchToDrag);
//			this.addView(tvDrag);
//		}
//		else if(draggableObject instanceof Button) {
//			Button btnDrag = (Button) draggableObject;
//			btnDrag.setLayoutParams(lpDraggableView);
//			btnDrag.setOnTouchListener(OnTouchToDrag);
//			this.addView(btnDrag);
//		}

    }

    /**
     * Draggable object ontouch listener
     * Handle the movement of the object when dragged and dropped
     */
    private View.OnTouchListener OnTouchToDrag = new View.OnTouchListener() {

        @Override
        public boolean onTouch(View v, MotionEvent event) {
            FrameLayout.LayoutParams dragParam = (LayoutParams) v.getLayoutParams();

            switch(event.getAction())
            {
                case MotionEvent.ACTION_MOVE:
                {
                    dragParam.topMargin = (int)event.getRawY() - (v.getHeight()/2);
                    dragParam.bottomMargin = (int)event.getRawY() + (v.getHeight()/2);
                    dragParam.leftMargin = (int)event.getRawX() - (v.getWidth()/2);
                    dragParam.rightMargin = (int)event.getRawX() + (v.getWidth()/2);

                    log.debug("topMargin: " + dragParam.topMargin + "bottomMargin: " + dragParam.bottomMargin
                    + "leftMargin: " + dragParam.leftMargin + "rightMargin: " + dragParam.rightMargin);

                    log.debug("parent: " + width + " - " + height);

                    //1080 - 1467


                    if (dragParam.leftMargin < 0) {
                        dragParam.leftMargin = 0;
                    }
                    if (dragParam.rightMargin > width) {
                        dragParam.leftMargin = width - v.getWidth();
                    }
                    if (dragParam.topMargin < 0) {
                        dragParam.topMargin = 0;
                    }
                    if (dragParam.bottomMargin > height){
                        dragParam.topMargin = height - v.getHeight() - 10;
                    }
                    v.setLayoutParams(dragParam);
                    break;
                }
                case MotionEvent.ACTION_UP:
                {
                    dragParam.height = v.getHeight();
                    dragParam.width = v.getWidth();
                    dragParam.topMargin = (int)event.getRawY() - (v.getHeight()/2);
                    dragParam.bottomMargin = (int)event.getRawY() + (v.getHeight()/2);
                    dragParam.leftMargin = (int)event.getRawX() - (v.getWidth()/2);
                    dragParam.rightMargin = (int)event.getRawX() + (v.getWidth()/2);

                    if (dragParam.leftMargin < 0) {
                        dragParam.leftMargin = 0;
                    }
                    if (dragParam.rightMargin > width) {
                        dragParam.leftMargin = width - v.getWidth();
                    }
                    if (dragParam.topMargin < 0) {
                        dragParam.topMargin = 0;
                    }
                    if (dragParam.bottomMargin > height){
                        dragParam.topMargin = height - v.getHeight() - 10;
                    }
                    v.setLayoutParams(dragParam);
                    break;
                }
                case MotionEvent.ACTION_DOWN:
                {
                    dragParam.height = v.getHeight();
                    dragParam.width = v.getWidth();
                    dragParam.topMargin = (int)event.getRawY() - (v.getHeight()/2);
                    dragParam.bottomMargin = (int)event.getRawY() + (v.getHeight()/2);
                    dragParam.leftMargin = (int)event.getRawX() - (v.getWidth()/2);
                    dragParam.rightMargin = (int)event.getRawX() + (v.getWidth()/2);
                    v.setLayoutParams(dragParam);
                    break;
                }
            }
            return true;
        }

    };

}
