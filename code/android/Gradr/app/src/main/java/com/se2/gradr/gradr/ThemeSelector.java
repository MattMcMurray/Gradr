package com.se2.gradr.gradr;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;

public class ThemeSelector {
    private static int sTheme = 0;
    private static AlertDialog themeDialog;
    public static final CharSequence[] themes = {"Default", "Earth", "Air", "Water", "Fire"};

    public final static int THEME_DEFAULT = 0;
    public final static int THEME_EARTH = 1;
    public final static int THEME_AIR = 2;
    public final static int THEME_WATER = 3;
    public final static int THEME_FIRE = 4;

    public static void showThemeDialog(final Activity activity) {
        AlertDialog.Builder builder = new AlertDialog.Builder(activity);
        builder.setTitle("Set default theme");
        builder.setSingleChoiceItems(themes, sTheme, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                changeTheme(activity, which);
                themeDialog.dismiss();
            }
        });

        themeDialog = builder.create();
        themeDialog.show();
    }

    public static void changeTheme(Activity activity, int theme) {
        sTheme = theme;
        activity.recreate();
    }

    public static void onActivityChangeTheme(Activity activity) {
        switch (sTheme) {
            case THEME_DEFAULT:
                activity.setTheme(R.style.Theme_Default);
                break;
            case THEME_EARTH:
                activity.setTheme(R.style.Theme_Earth);
                break;
            case THEME_AIR:
                activity.setTheme(R.style.Theme_Air);
                break;
            case THEME_WATER:
                activity.setTheme(R.style.Theme_Water);
                break;
            case THEME_FIRE:
                activity.setTheme(R.style.Theme_Fire);
                break;
            default:
                break;
        }
    }
}
