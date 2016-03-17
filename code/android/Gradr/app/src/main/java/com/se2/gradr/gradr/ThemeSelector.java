package com.se2.gradr.gradr;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;

public class ThemeSelector {
    static AlertDialog themeDialog;
    static final CharSequence[] themes = {"Fire", "Wind", "Ice"};

    public static void showThemeDialog(Activity activity) {
        AlertDialog.Builder builder = new AlertDialog.Builder(activity);
        builder.setTitle("Set default theme");
        builder.setSingleChoiceItems(themes, -1, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                switch(which) {
                    case 0:
                        System.out.println("Fire theme");
                        break;
                    case 1:
                        System.out.println("Wind theme");
                        break;
                    case 2:
                        System.out.println("Ice theme");
                        break;
                    default:
                        break;
                }
                themeDialog.dismiss();
            }
        });

        themeDialog = builder.create();
        themeDialog.show();
    }
}
